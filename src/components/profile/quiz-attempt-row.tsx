import { AppIcon } from '@/components/ui/app-icon';
import { timeAgo } from '@/lib/relative-time';
import { cn } from '@/lib/utils';
import type { QuizResult } from '@/types/quiz';

/** Score → traffic-light colour: pass green, borderline amber, low red. */
function scoreTone(percent: number): string {
  if (percent >= 70) return 'bg-rq-quiz-check/12 text-rq-quiz-check';
  if (percent >= 40) return 'bg-rq-due-soon/12 text-rq-due-soon';
  return 'bg-rq-error/12 text-rq-error';
}

/** One finished-quiz row: subject, when it was taken, and a coloured score pill. */
export function QuizAttemptRow({ result }: { result: QuizResult }) {
  const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-4 shadow-soft">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rq-menu-blue-well text-rq-menu-blue">
        <AppIcon name="quiz" size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-rq-on-surface">{result.sourceLabel}</p>
        <p className="mt-0.5 text-xs font-medium text-rq-on-surface-variant">
          {timeAgo(result.createdAt)} · {result.correct}/{result.total} correct
        </p>
      </div>
      <span className={cn('rounded-pill px-3 py-1 text-[13px] font-bold', scoreTone(percent))}>{percent}%</span>
    </div>
  );
}
