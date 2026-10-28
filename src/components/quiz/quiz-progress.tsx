type Props = {
  current: number;
  total: number;
};

/** "Question N of M" label above a thin fill bar that tracks progress. */
export function QuizProgress({ current, total }: Props) {
  const percent = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="flex flex-col gap-2">
      <p className="text-center text-sm font-semibold text-rq-on-surface-variant">
        Question {current} of {total}
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label="Quiz progress"
        className="h-1.5 w-full overflow-hidden rounded-pill bg-rq-surface-variant"
      >
        <div className="h-full rounded-pill bg-rq-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
