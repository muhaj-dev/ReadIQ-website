import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  seconds: number;
  onCancel: () => void;
  onStop: () => void;
};

/** m:ss for the live recording timer. */
function clock(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** The composer while dictating: cancel · pulsing dot + timer · stop-and-transcribe. */
export function RecordingBar({ seconds, onCancel, onStop }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-pill border border-rq-error/40 bg-rq-surface-lowest py-2 pr-2 pl-3 shadow-[0_2px_6px_rgb(0_0_0/0.05)]">
      <button
        type="button"
        aria-label="Cancel recording"
        onClick={onCancel}
        className="flex size-9 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container"
      >
        <AppIcon name="close" size={20} />
      </button>
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-pill bg-rq-error opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-pill bg-rq-error" />
      </span>
      <span className="text-sm font-semibold text-rq-on-surface tabular-nums" role="timer" aria-live="off">
        Listening… {clock(seconds)}
      </span>
      <div className="flex-1" />
      <button
        type="button"
        aria-label="Stop and transcribe"
        onClick={onStop}
        className="flex size-10 items-center justify-center rounded-pill bg-rq-error text-rq-on-primary transition hover:opacity-90"
      >
        <AppIcon name="stop" size={18} filled />
      </button>
    </div>
  );
}
