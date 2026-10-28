import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  playing: boolean;
  atEnd: boolean;
  /** 0–1 across the episode. */
  progress: number;
  activeIndex: number;
  count: number;
  /** Name of the host on the current turn. */
  speakerName: string;
  onToggle: () => void;
  onRestart: () => void;
};

/** Pinned player controls: progress track, restart, play/pause, turn counter. */
export function PodcastPlayerBar({ playing, atEnd, progress, activeIndex, count, speakerName, onToggle, onRestart }: Props) {
  const icon = playing ? 'pause' : atEnd ? 'replay' : 'play';

  return (
    <div className="grid gap-3 rounded-card border border-rq-outline-variant/40 bg-rq-surface-lowest px-5 pt-3 pb-4 shadow-soft">
      <div
        className="h-1 overflow-hidden rounded-pill bg-rq-surface-low"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={Math.min(activeIndex + 1, count)}
      >
        <div
          className="h-full rounded-pill bg-rq-secondary transition-[width] duration-300"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Restart episode"
          onClick={onRestart}
          className="flex size-11 items-center justify-center rounded-pill bg-rq-secondary/10 text-rq-secondary transition hover:bg-rq-secondary/15"
        >
          <AppIcon name="replay" size={22} />
        </button>

        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={onToggle}
          className="flex size-16 items-center justify-center rounded-pill bg-rq-secondary text-rq-on-primary shadow-lg transition hover:brightness-110"
        >
          <AppIcon name={icon} size={30} filled={icon !== 'replay'} />
        </button>

        <div className="flex w-12 flex-col items-center">
          <span className="font-heading text-sm font-semibold text-rq-on-surface">
            {Math.min(activeIndex + 1, count)}/{count}
          </span>
          <span className="max-w-full truncate text-[10px] font-medium tracking-wide text-rq-outline">{speakerName}</span>
        </div>
      </div>
    </div>
  );
}
