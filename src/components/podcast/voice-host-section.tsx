import { AppIcon } from '@/components/ui/app-icon';
import { PREVIEW_LINE, type DeviceVoice } from '@/lib/podcast-voices';
import { cn } from '@/lib/utils';
import { HOSTS, type PodcastSpeaker } from '@/types/podcast';

import { HOST_ACCENT } from './host-accent';
import { VoiceOptionRow } from './voice-option-row';

type Props = {
  speaker: PodcastSpeaker;
  /** Short role line under the host name. */
  role: string;
  voices: DeviceVoice[];
  selectedId: string | null;
  onSelect: (identifier: string) => void;
  /** Replays the host's current voice — fired when the preview bubble is clicked. */
  onPreview: () => void;
};

/** One host in the voice picker: a chat-style preview bubble plus its voice options. */
export function VoiceHostSection({ speaker, role, voices, selectedId, onSelect, onPreview }: Props) {
  const accent = HOST_ACCENT[speaker];
  const name = HOSTS[speaker];
  const right = speaker === 'A';
  const selected = voices.find((v) => v.identifier === selectedId);
  const voiceLabel = selected ? selected.name : 'System default';

  return (
    <div className="grid gap-3">
      <div className={cn('flex flex-col', right ? 'items-end' : 'items-start')}>
        <div className={cn('mb-1 flex items-center gap-1.5 px-1', right && 'flex-row-reverse')}>
          <span
            className={cn(
              'flex size-6 items-center justify-center rounded-pill font-heading text-[11px] font-bold text-rq-on-primary',
              accent.bg,
            )}
          >
            {name.charAt(0)}
          </span>
          <span className={cn('font-heading text-[13px] font-semibold', accent.text)}>{name}</span>
          <span className="text-xs font-medium text-rq-on-surface-variant">· {role}</span>
        </div>

        <button
          type="button"
          aria-label={`Hear ${name}'s voice, ${voiceLabel}`}
          onClick={onPreview}
          className={cn(
            'grid max-w-[88%] gap-2 rounded-card border px-4 py-3.5 text-left shadow-soft transition hover:brightness-105',
            right
              ? 'rounded-tr-[4px] border-transparent bg-rq-secondary-container text-rq-on-primary'
              : 'rounded-tl-[4px] border-rq-outline-variant bg-rq-surface-lowest text-rq-on-surface',
          )}
        >
          <span className="text-sm leading-[21px]">{PREVIEW_LINE[speaker]}</span>
          <span
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold',
              right ? 'justify-end text-rq-on-primary/85' : 'text-rq-on-surface-variant',
            )}
          >
            <AppIcon name="play" size={12} className={right ? undefined : accent.text} />
            <span className="truncate">{voiceLabel}</span>
          </span>
        </button>
      </div>

      <div className="grid gap-2">
        {voices.map((voice) => (
          <VoiceOptionRow
            key={voice.identifier}
            voice={voice}
            speaker={speaker}
            selected={voice.identifier === selectedId}
            onClick={() => onSelect(voice.identifier)}
          />
        ))}
      </div>
    </div>
  );
}
