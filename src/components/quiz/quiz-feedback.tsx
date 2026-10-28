import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

/** Post-answer line: a sparkle plus an encouraging or corrective message. */
export function QuizFeedback({ correct }: { correct: boolean }) {
  return (
    <div role="status" className="mt-1 flex items-center gap-2">
      <AppIcon name="auto-awesome" size={20} filled className="text-rq-quiz-sparkle" />
      <p className={cn('text-sm font-semibold', correct ? 'text-rq-quiz-check' : 'text-rq-error')}>
        {correct ? 'Great job!' : 'Not quite — the answer is highlighted above.'}
      </p>
    </div>
  );
}
