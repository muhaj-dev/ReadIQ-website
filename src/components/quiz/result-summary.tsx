import { cn } from '@/lib/utils';

type Props = {
  correct: number;
  total: number;
};

// r=15.9155 in a 36×36 viewBox → circumference ≈ 100, so dash = "percent, 100".
const RING_PATH = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

/** The hero score card: a ring gauge with the percentage + an encouraging line. */
export function ResultSummary({ correct, total }: Props) {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  const tint = percent >= 80 ? 'text-rq-quiz-check' : percent >= 50 ? 'text-rq-primary' : 'text-rq-error';
  const message =
    percent >= 80 ? 'Excellent work!' : percent >= 50 ? 'Good effort — keep going!' : 'Keep practising — you’ve got this.';

  return (
    <section
      aria-label="Your score"
      className="flex flex-col items-center rounded-card border border-rq-surface-low bg-rq-surface-lowest p-6 shadow-soft"
    >
      <div className={cn('relative flex size-32 items-center justify-center', tint)}>
        <svg viewBox="0 0 36 36" className="absolute inset-0 size-full" aria-hidden>
          <path d={RING_PATH} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={3} />
          <path
            d={RING_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={`${percent}, 100`}
          />
        </svg>
        <span className="font-heading text-[32px] leading-10 font-extrabold">{percent}%</span>
      </div>

      <p className="mt-4 font-heading text-xl font-bold text-rq-on-surface">
        {correct} of {total} correct
      </p>
      <p className={cn('mt-1 text-sm font-semibold', tint)}>{message}</p>
    </section>
  );
}
