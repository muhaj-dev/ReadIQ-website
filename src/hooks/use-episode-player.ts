// Episode player: spoken playback of a "From Your Notes" episode with the browser's
// built-in text-to-speech (Web Speech API). One utterance per turn, chained on
// `onend`; voice per host + speed come from the voice store.
//
// Chrome quirks handled: utterances are kept referenced (else GC can drop their
// `onend`), `cancel()` fires a stale `onend`/`onerror` (guarded by a generation
// counter), and Chrome pauses long utterances after ~15s — turns are short lines,
// so each utterance stays well under that.

import { useCallback, useEffect, useRef, useState } from 'react';

import { HOST_PITCH, voiceFor } from '@/lib/podcast-voices';
import { usePodcastVoiceStore } from '@/store/use-podcast-voice-store';
import type { PodcastTurn } from '@/types/podcast';

export type EpisodePlayer = {
  /** The turn currently spoken / highlighted. */
  activeIndex: number;
  playing: boolean;
  /** Playback has reached and stopped on the last turn. */
  atEnd: boolean;
  /** 0–1 across the episode, for the progress bar. */
  progress: number;
  count: number;
  /** False when this browser has no speech synthesis — show the transcript only. */
  supported: boolean;
  /** Play / pause; from the end, play restarts from the top. */
  toggle: () => void;
  /** Jump back to the first turn and play. */
  restart: () => void;
  /** Move to a specific turn (clicking it in the transcript). */
  seek: (index: number) => void;
};

const hasSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function useEpisodePlayer(turns: PodcastTurn[]): EpisodePlayer {
  const count = turns.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [supported] = useState(hasSpeech);

  const turnsRef = useRef(turns);
  const idxRef = useRef(0);
  const playingRef = useRef(false);
  // Bumped on every stop/seek so a stale utterance's onend can't advance playback.
  const genRef = useRef(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const initVoices = usePodcastVoiceStore((s) => s.init);
  const prefs = usePodcastVoiceStore((s) => s.prefs);
  const prefsRef = useRef(prefs);

  useEffect(() => {
    turnsRef.current = turns;
    prefsRef.current = prefs;
  });

  // Load browser voices + saved prefs once (idempotent — guarded in the store).
  useEffect(() => {
    void initVoices();
  }, [initVoices]);

  const stopSpeech = useCallback(() => {
    genRef.current += 1; // invalidate any in-flight onend/onerror
    if (hasSpeech()) window.speechSynthesis.cancel();
  }, []);

  // Speak turn `start`, then chain to the next on completion while still playing.
  const speakFrom = useCallback((start: number) => {
    if (!hasSpeech()) return;
    const myGen = genRef.current;
    const speak = (i: number) => {
      const list = turnsRef.current;
      if (i >= list.length) {
        idxRef.current = list.length; // past the end → next play restarts
        playingRef.current = false;
        setPlaying(false);
        return;
      }
      idxRef.current = i;
      setActiveIndex(i);
      const turn = list[i];
      const utter = new SpeechSynthesisUtterance(turn.text);
      const voice = voiceFor(prefsRef.current[turn.speaker]);
      if (voice) {
        utter.voice = voice;
        utter.lang = voice.lang;
      }
      utter.pitch = HOST_PITCH[turn.speaker];
      utter.rate = prefsRef.current.rate;
      const advance = () => {
        if (genRef.current !== myGen || !playingRef.current) return;
        speak(i + 1);
      };
      utter.onend = advance;
      utter.onerror = advance; // never get stuck on a single turn
      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    };
    speak(start);
  }, []);

  const play = useCallback(() => {
    if (count === 0 || !hasSpeech()) return;
    stopSpeech();
    if (idxRef.current >= count) idxRef.current = 0; // from the end → start over
    playingRef.current = true;
    setPlaying(true);
    speakFrom(idxRef.current);
  }, [count, stopSpeech, speakFrom]);

  const pause = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    stopSpeech();
  }, [stopSpeech]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else play();
  }, [pause, play]);

  const restart = useCallback(() => {
    if (!hasSpeech()) return;
    stopSpeech();
    idxRef.current = 0;
    setActiveIndex(0);
    playingRef.current = true;
    setPlaying(true);
    speakFrom(0);
  }, [stopSpeech, speakFrom]);

  const seek = useCallback(
    (index: number) => {
      if (count === 0) return;
      const clamped = Math.max(0, Math.min(index, count - 1));
      idxRef.current = clamped;
      setActiveIndex(clamped);
      if (playingRef.current) {
        stopSpeech();
        speakFrom(clamped);
      }
    },
    [count, stopSpeech, speakFrom],
  );

  // Stop audio when the page unmounts so a voice never trails a gone screen.
  useEffect(
    () => () => {
      playingRef.current = false;
      genRef.current += 1;
      if (hasSpeech()) window.speechSynthesis.cancel();
    },
    [],
  );

  const atEnd = !playing && count > 0 && activeIndex >= count - 1;
  const progress = count === 0 ? 0 : (activeIndex + 1) / count;

  return { activeIndex, playing, atEnd, progress, count, supported, toggle, restart, seek };
}
