import { AppIcon } from '@/components/ui/app-icon';
import type { QuizSource } from '@/types/quiz';

type Props = {
  source: QuizSource;
  onPress: () => void;
};

/** One quizzable subject on Quiz Home — click to build a quiz. */
export function QuizSourceCard({ source, onPress }: Props) {
  const count = source.notes.length;

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Quiz yourself on ${source.label}`}
      className="flex w-full items-center justify-between gap-3 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-rq-secondary/30 focus-visible:outline-2 focus-visible:outline-rq-secondary"
    >
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-rq-menu-purple-well text-rq-menu-purple">
          <AppIcon name="school" size={24} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-semibold text-rq-on-surface">{source.label}</span>
          <span className="mt-1 block text-xs font-semibold text-rq-secondary">
            {count} {count === 1 ? 'note' : 'notes'}
          </span>
        </span>
      </span>
      <AppIcon name="chevron-right" size={24} className="text-rq-on-surface-variant/60" />
    </button>
  );
}
