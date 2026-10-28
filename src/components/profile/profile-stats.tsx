import { GlassCard } from '@/components/profile/glass-card';
import type { ProfileStat } from '@/data/profile';

/** The 3-up glass stats row (Notes · AI Answers · Day Streak). */
export function ProfileStats({ stats }: { stats: ProfileStat[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="flex flex-col items-center justify-center gap-1 rounded-card p-4">
          <span className="font-heading text-2xl font-semibold text-rq-on-primary">{stat.value}</span>
          <span className="text-center text-xs font-medium text-rq-on-primary-soft">{stat.label}</span>
        </GlassCard>
      ))}
    </div>
  );
}
