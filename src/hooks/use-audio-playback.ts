// Plays back a recorded clip (the Record Result screen) through an off-DOM <audio>
// element. Takes any stored uri (idb:/blob:/data:) and restarts from the top once
// a clip has finished. MediaRecorder webm files often report an Infinity duration,
// so callers can pass the known length as a fallback.

import { useEffect, useRef, useState } from 'react';

import { useFileUrl } from '@/lib/blob-store';

export type AudioPlayback = {
  /** True once there's a source to play. */
  available: boolean;
  playing: boolean;
  /** Elapsed seconds. */
  position: number;
  /** Clip length in seconds (fallback until the browser knows it). */
  duration: number;
  /** 0–1 played fraction, for the progress fill. */
  progress: number;
  toggle: () => void;
};

export function useAudioPlayback(uri?: string, fallbackDuration = 0): AudioPlayback {
  const url = useFileUrl(uri);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [knownDuration, setKnownDuration] = useState(0);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const readDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) setKnownDuration(audio.duration);
    };
    const onTime = () => setPosition(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      readDuration();
    };

    audio.addEventListener('loadedmetadata', readDuration);
    audio.addEventListener('durationchange', readDuration);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
      audio.removeEventListener('loadedmetadata', readDuration);
      audio.removeEventListener('durationchange', readDuration);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [url]);

  const duration = knownDuration || fallbackDuration;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    // Finished clips replay from the start rather than sitting at the end.
    if (audio.ended || (duration > 0 && audio.currentTime >= duration - 0.1)) audio.currentTime = 0;
    audio.play().catch(() => setPlaying(false));
  };

  return {
    available: !!url,
    playing,
    position,
    duration,
    progress: duration > 0 ? Math.min(1, position / duration) : 0,
    toggle,
  };
}
