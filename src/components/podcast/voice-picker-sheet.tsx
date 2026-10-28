'use client';

import { useCallback, useEffect } from 'react';

import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { HOST_PITCH, PREVIEW_LINE, RATE_PRESETS, voiceFor } from '@/lib/podcast-voices';
import { cn } from '@/lib/utils';
import { usePodcastVoiceStore } from '@/store/use-podcast-voice-store';
import type { PodcastSpeaker } from '@/types/podcast';

import { VoiceHostSection } from './voice-host-section';

type Props = { open: boolean; onClose: () => void };

const hasSpeech = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
const stop = () => {
  if (hasSpeech()) window.speechSynthesis.cancel();
};

/** Speak a host's preview line in a given browser voice. */
function speakPreview(speaker: PodcastSpeaker, voiceId: string | null, rate: number) {
  if (!hasSpeech()) return;
  stop();
  const utter = new SpeechSynthesisUtterance(PREVIEW_LINE[speaker]);
  const voice = voiceFor(voiceId);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  }
  utter.pitch = HOST_PITCH[speaker];
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

/** "Podcast voices" sheet: pick a browser voice per host and the speaking speed. */
export function VoicePickerSheet({ open, onClose }: Props) {
  const voices = usePodcastVoiceStore((s) => s.voices);
  const prefs = usePodcastVoiceStore((s) => s.prefs);
  const setVoice = usePodcastVoiceStore((s) => s.setVoice);
  const setRate = usePodcastVoiceStore((s) => s.setRate);

  // Stop any preview when the sheet hides or unmounts.
  useEffect(() => {
    if (!open) stop();
    return stop;
  }, [open]);

  const choose = useCallback(
    (speaker: PodcastSpeaker, id: string) => {
      void setVoice(speaker, id);
      speakPreview(speaker, id, prefs.rate);
    },
    [setVoice, prefs.rate],
  );

  return (
    <Sheet open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[88dvh] w-full max-w-xl gap-0 rounded-t-3xl bg-rq-surface-lowest sm:bottom-4 sm:rounded-3xl"
      >
        <div className="border-b border-rq-outline-variant/30 px-5 pt-4 pb-3 pr-12">
          <SheetTitle className="font-heading text-[17px] font-bold text-rq-on-surface">Podcast voices</SheetTitle>
          <SheetDescription className="text-xs text-rq-on-surface-variant">
            Click a voice to hear it and set it for that host.
          </SheetDescription>
        </div>

        {!hasSpeech() || voices.length === 0 ? (
          <p className="px-5 py-10 text-sm leading-relaxed text-rq-on-surface-variant">
            {hasSpeech()
              ? "Your browser didn't offer any selectable voices, so the hosts use its default. You can still change the speaking speed below."
              : "This browser can't read aloud, so the episode plays as a transcript only. Try Chrome, Edge, or Safari to listen."}
          </p>
        ) : (
          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-5 pt-4 pb-1">
            <VoiceHostSection
              speaker="A"
              role="asks the questions"
              voices={voices}
              selectedId={prefs.A}
              onSelect={(id) => choose('A', id)}
              onPreview={() => speakPreview('A', prefs.A, prefs.rate)}
            />
            <VoiceHostSection
              speaker="B"
              role="explains"
              voices={voices}
              selectedId={prefs.B}
              onSelect={(id) => choose('B', id)}
              onPreview={() => speakPreview('B', prefs.B, prefs.rate)}
            />
            <p className="pb-2 text-xs leading-relaxed text-rq-outline">
              Up to five distinct voices from your browser. Nigerian voices show up here when your system has them
              installed — Edge offers the most natural voices.
            </p>
          </div>
        )}

        <div className="grid gap-2 border-t border-rq-outline-variant/30 px-5 pt-3 pb-5">
          <p className="text-[11px] font-bold tracking-wider text-rq-on-surface-variant">SPEAKING SPEED</p>
          <div className="flex gap-2">
            {RATE_PRESETS.map((preset) => {
              const active = Math.abs(prefs.rate - preset.value) < 0.001;
              return (
                <button
                  key={preset.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => void setRate(preset.value)}
                  className={cn(
                    'flex-1 rounded-inner py-2.5 text-sm font-semibold transition',
                    active ? 'bg-rq-secondary text-rq-on-primary' : 'bg-rq-surface-low text-rq-on-surface hover:bg-rq-surface-container',
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
