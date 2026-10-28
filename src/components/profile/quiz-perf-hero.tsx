import { ProgressRing } from '@/components/home/progress-ring';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  averagePercent: number;
  bestPercent: number;
  quizzesTaken: number;
  questionsAnswered: number;
  encouragement: string;
};

/** Score → band tint: strong green, fair indigo, low red. */
function band(percent: number) {
  if (percent >= 80) return { text: 'text-rq-quiz-check', track: 'stroke-rq-quiz-check/15', arc: 'stroke-rq-quiz-check' };
  if (percent >= 50) return { text: 'text-rq-primary', track: 'stroke-rq-primary/15', arc: 'stroke-rq-primary' };
  return { text: 'text-rq-error', track: 'stroke-rq-error/15', arc: 'stroke-rq-error' };
}

/** Quiz-analytics hero: an average-score ring above a 3-metric stat band. */
export function QuizPerfHero({ averagePercent, bestPercent, quizzesTaken, questionsAnswered, encouragement }: Props) {
  const tint = band(averagePercent);
  const metrics: { icon: AppIconName; color: string; value: string; label: string }[] = [
    { icon: 'trophy', color: 'text-rq-menu-orange', value: `${bestPercent}%`, label: 'Best' },
    { icon: 'quiz', color: 'text-rq-menu-blue', value: String(quizzesTaken), label: 'Quizzes' },
    { icon: 'check-circle', color: 'text-rq-quiz-check', value: String(questionsAnswered), label: 'Answered' },
  ];

  return (
    <section className="rounded-card border border-rq-surface-low bg-rq-surface-lowest p-6 shadow-soft">
      <div className="flex flex-col items-center text-center">
        <ProgressRing percent={averagePercent} className="size-32" trackClassName={tint.track} arcClassName={tint.arc}>
          <span className={cn('font-heading text-3xl font-extrabold', tint.text)}>{averagePercent}%</span>
        </ProgressRing>
        <h2 className="mt-4 font-heading text-lg font-bold text-rq-on-surface">Average Score</h2>
        <p className={cn('mt-1 text-sm font-semibold', tint.text)}>{encouragement}</p>
      </div>

      <div className="mt-5 grid grid-cols-3 divide-x divide-rq-outline-variant/40 border-t border-rq-outline-variant/40 pt-5">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col items-center gap-1">
            <AppIcon name={m.icon} size={18} className={m.color} />
            <span className="font-heading text-xl font-bold text-rq-on-surface">{m.value}</span>
            <span className="text-xs font-medium text-rq-on-surface-variant">{m.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
