import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  paused: boolean;
  /** Controls are inert until the mic is live. */
  disabled?: boolean;
  /** Stop and throw the recording away. */
  onDiscard: () => void;
  /** Pause ↔ resume. */
  onToggle: () => void;
  /** Stop and keep the recording. */
  onFinish: () => void;
};

/** Record controls cluster: discard · pause/resume · finish (see the record mock). */
export function RecordControls({ paused, disabled, onDiscard, onToggle, onFinish }: Props) {
  const side =
    'flex size-14 items-center justify-center rounded-pill bg-rq-surface-low text-rq-on-surface-variant transition hover:bg-rq-surface-container disabled:opacity-40';

  return (
    <div className="flex w-full max-w-sm items-center justify-between">
      <button type="button" aria-label="Stop and discard" title="Discard" onClick={onDiscard} className={side}>
        <AppIcon name="stop" size={24} />
      </button>

      <button
        type="button"
        aria-label={paused ? 'Resume recording' : 'Pause recording'}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          'flex size-20 items-center justify-center rounded-pill text-rq-on-primary transition active:scale-95 disabled:opacity-50',
          paused ? 'bg-rq-primary shadow-soft' : 'bg-rq-secondary shadow-[0_0_25px_var(--rq-secondary-container)]',
        )}
      >
        <AppIcon name={paused ? 'play' : 'pause'} size={34} filled />
      </button>

      <button type="button" aria-label="Finish and save recording" title="Finish" disabled={disabled} onClick={onFinish} className={side}>
        <AppIcon name="check-circle" size={24} />
      </button>
    </div>
  );
}
