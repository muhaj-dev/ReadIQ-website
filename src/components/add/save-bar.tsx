import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

export type SaveState = 'idle' | 'saving' | 'saved';

type Props = {
  state: SaveState;
  retakeLabel?: string;
  onRetake: () => void;
  onSave: () => void;
  /** Disable Save (e.g. no text yet). */
  disabled?: boolean;
};

/** Sticky bottom bar: Retake + the wide Save to Memory button with its states. */
export function SaveBar({ state, retakeLabel = 'Retake', onRetake, onSave, disabled }: Props) {
  return (
    <div className="sticky bottom-24 z-10 mt-8 flex gap-4 lg:bottom-6">
      <button
        type="button"
        onClick={onRetake}
        disabled={state !== 'idle'}
        className="rounded-inner bg-rq-surface-lowest px-6 py-4 text-base font-semibold text-rq-secondary shadow-soft ring-1 ring-rq-outline-variant/30 transition hover:bg-rq-surface-low disabled:opacity-60"
      >
        {retakeLabel}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={state !== 'idle' || disabled}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-inner px-6 py-4 text-base font-semibold text-rq-on-primary shadow-soft transition disabled:cursor-not-allowed',
          state === 'saved' ? 'bg-rq-method-upload' : 'bg-rq-primary-container hover:opacity-90',
          disabled && state === 'idle' && 'opacity-50',
        )}
      >
        {state === 'saving' ? (
          <span className="size-4 animate-spin rounded-pill border-2 border-rq-on-primary/30 border-t-rq-on-primary" />
        ) : state === 'saved' ? (
          <AppIcon name="check-circle" size={18} />
        ) : null}
        {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved!' : 'Save to Memory'}
      </button>
    </div>
  );
}
