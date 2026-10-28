'use client';

import { AppIcon } from '@/components/ui/app-icon';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { cn } from '@/lib/utils';

// Fixed waveform — deterministic so the recorded clip doesn't flicker on re-render.
const BARS = [30, 55, 40, 70, 50, 85, 60, 45, 75, 35, 65, 90, 55, 40, 80, 50, 60, 95, 45, 70, 35, 60, 85, 50, 40, 75, 55, 65, 45, 80];

const format = (seconds: number) =>
  [Math.floor(seconds / 60), Math.floor(seconds % 60)].map((part) => String(part).padStart(2, '0')).join(':');

type Props = {
  /** Length of the finished recording, in seconds. */
  seconds: number;
  /** Recorded clip uri (idb:) — enables play. */
  uri?: string;
  /** Whether a transcript was produced (drives the corner badge). */
  transcribed?: boolean;
};

/** Recorded-clip preview: play button + progress waveform + duration + status badge. */
export function RecordPreview({ seconds, uri, transcribed = false }: Props) {
  const { available, playing, position, progress, duration, toggle } = useAudioPlayback(uri, seconds);

  // Full colour at rest; split into played / unplayed once playback has started.
  const fill = playing || position > 0 ? progress : 1;
  const played = fill * BARS.length;

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-inner border border-rq-outline-variant bg-rq-surface-lowest px-5 py-12 shadow-soft">
      <span aria-hidden className="absolute size-64 rounded-pill bg-rq-secondary-container/30 blur-3xl" />

      <div aria-hidden className="relative flex h-24 items-center justify-center gap-1">
        {BARS.map((height, index) => (
          <span
            key={index}
            className={cn('w-[3px] rounded-sm', index < played ? 'bg-rq-secondary' : 'bg-rq-secondary-container/45')}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-4">
        <button
          type="button"
          aria-label={playing ? 'Pause recording' : 'Play recording'}
          onClick={toggle}
          disabled={!available}
          className="flex size-14 items-center justify-center rounded-pill bg-rq-primary-container text-rq-on-primary shadow-soft transition active:scale-95 disabled:bg-rq-outline-variant"
        >
          <AppIcon name={playing ? 'pause' : 'play'} size={26} filled />
        </button>
        <span className="font-heading text-lg font-bold text-rq-on-surface tabular-nums">
          {available ? `${format(position)} / ${format(duration)}` : format(seconds)}
        </span>
      </div>

      <span
        className={cn(
          'absolute top-4 right-4 flex items-center gap-2 rounded-pill px-3 py-1.5 text-xs font-semibold shadow-soft',
          transcribed ? 'bg-rq-primary-container text-rq-on-primary' : 'bg-rq-surface-container text-rq-on-surface-variant',
        )}
      >
        <AppIcon name={transcribed ? 'check-circle' : 'mic'} size={16} />
        {transcribed ? 'Transcribed' : 'Recorded'}
      </span>
    </div>
  );
}
