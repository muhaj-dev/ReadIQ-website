import { cn } from '@/lib/utils';

type Props = {
  label: string;
  /** Enabled only once the current question has been answered. */
  enabled: boolean;
  onPress: () => void;
};

/** Bottom CTA — green "Next Question" (or "Finish") button. */
export function NextButton({ label, enabled, onPress }: Props) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onPress}
      className={cn(
        'flex w-full items-center justify-center rounded-card py-4 font-heading text-lg font-semibold transition',
        enabled
          ? 'bg-rq-quiz-correct text-rq-on-primary shadow-[0_8px_16px_-4px_color-mix(in_oklab,var(--rq-quiz-correct)_45%,transparent)] hover:opacity-90'
          : 'cursor-not-allowed bg-rq-surface-variant text-rq-on-surface-variant/70',
      )}
    >
      {label}
      {enabled ? (
        <kbd className="ml-3 hidden rounded-md bg-rq-on-primary/20 px-1.5 py-0.5 font-sans text-xs lg:inline">Enter</kbd>
      ) : null}
    </button>
  );
}
