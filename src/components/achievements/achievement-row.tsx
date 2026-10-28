import { AppIcon } from '@/components/ui/app-icon';
import type { EvaluatedAchievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';

/** One badge row — coloured + checked when earned, muted while locked. */
export function AchievementRow({ achievement }: { achievement: EvaluatedAchievement }) {
  const { unlocked, icon, title, description } = achievement;

  return (
    <div
      className={cn(
        'flex h-full items-center gap-4 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-4 shadow-soft',
        !unlocked && 'opacity-70',
      )}
    >
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-lg',
          unlocked ? 'bg-rq-menu-purple-well text-rq-menu-purple' : 'bg-rq-surface-container text-rq-on-surface-variant',
        )}
      >
        <AppIcon name={icon} size={24} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-rq-on-surface">{title}</p>
        <p className="mt-0.5 text-[13px] leading-[18px] text-rq-on-surface-variant">{description}</p>
      </div>
      {unlocked ? (
        <AppIcon name="check-circle" size={22} className="text-rq-quiz-check" aria-label="Earned" />
      ) : (
        <span aria-label="Locked" className="size-5 shrink-0 rounded-pill border-2 border-rq-on-surface-variant/40" />
      )}
    </div>
  );
}
