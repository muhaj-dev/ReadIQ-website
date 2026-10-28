import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  onRetry: () => void;
  onHome: () => void;
};

/** Result CTAs — a fresh attempt on the same subject (primary) or back to the dashboard. */
export function ResultActions({ onRetry, onHome }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <button
        type="button"
        onClick={onRetry}
        className="flex w-full items-center justify-center gap-2 rounded-card bg-rq-quiz-correct py-4 font-heading text-lg font-semibold text-rq-on-primary shadow-[0_8px_16px_-4px_color-mix(in_oklab,var(--rq-quiz-correct)_45%,transparent)] transition hover:opacity-90"
      >
        <AppIcon name="auto-awesome" size={20} filled />
        Try Again
      </button>
      <button
        type="button"
        onClick={onHome}
        className="flex w-full items-center justify-center rounded-card border border-rq-surface-variant bg-rq-surface-lowest py-4 text-base font-semibold text-rq-on-surface transition hover:bg-rq-surface-low"
      >
        Back to Home
      </button>
    </div>
  );
}
