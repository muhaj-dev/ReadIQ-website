import { AppIcon } from '@/components/ui/app-icon';
import type { DeviceVoice } from '@/lib/podcast-voices';
import { cn } from '@/lib/utils';
import type { PodcastSpeaker } from '@/types/podcast';

import { HOST_ACCENT } from './host-accent';

type Props = {
  voice: DeviceVoice;
  selected: boolean;
  speaker: PodcastSpeaker;
  /** Clicking the row both selects the voice AND plays a short preview. */
  onClick: () => void;
};

/** One voice in the picker: play/check dot, name, tags, HD badge. */
export function VoiceOptionRow({ voice, selected, speaker, onClick }: Props) {
  const accent = HOST_ACCENT[speaker];
  // Skip the gender tag when the fallback name already spells it ("Female voice 2").
  const genderLabel = voice.gender === 'female' ? 'Female' : voice.gender === 'male' ? 'Male' : '';
  const showGender = !!genderLabel && !new RegExp(voice.gender, 'i').test(voice.name);

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${voice.name}${selected ? ', selected' : ''}. Click to hear and choose.`}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-inner border px-3 py-3 text-left transition',
        selected ? cn(accent.soft, accent.border) : 'border-transparent bg-rq-surface-low hover:bg-rq-surface-container',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-pill',
          selected ? cn(accent.bg, 'text-rq-on-primary') : 'bg-rq-outline/15 text-rq-on-surface-variant',
        )}
      >
        <AppIcon name={selected ? 'check' : 'play'} size={16} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-rq-on-surface">{voice.name}</span>
      {voice.nigerian ? (
        <span className="rounded-pill bg-rq-note-green/14 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rq-note-green">
          🇳🇬 Nigerian
        </span>
      ) : showGender ? (
        <span className="text-xs font-medium text-rq-on-surface-variant">{genderLabel}</span>
      ) : null}
      {voice.enhanced ? (
        <span className="rounded-pill bg-rq-secondary/12 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rq-secondary">
          HD
        </span>
      ) : null}
    </button>
  );
}
