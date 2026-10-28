import type { DashboardStat, StatTone } from '@/data/dashboard';
import { cn } from '@/lib/utils';

const TONE: Record<StatTone, string> = {
  primary: 'text-rq-primary',
  secondary: 'text-rq-secondary',
  deep: 'text-rq-primary-deep',
};

/** The 3-up quick stats row (Notes · AI Answers · Quiz Score). */
export function StatCards({ stats, className }: { stats: DashboardStat[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-3 gap-3 sm:gap-4', className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-1 rounded-inner border border-rq-surface-low bg-rq-surface-lowest p-4 shadow-soft"
        >
          <span className={cn('font-heading text-2xl font-bold', TONE[stat.tone])}>{stat.value}</span>
          <span className="text-center text-xs font-medium text-rq-on-surface-variant">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
