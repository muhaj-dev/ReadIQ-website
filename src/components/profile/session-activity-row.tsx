import { AppIcon } from '@/components/ui/app-icon';
import type { StudyActivity } from '@/lib/profile-stats';
import { timeAgo } from '@/lib/relative-time';
import { cn } from '@/lib/utils';

/** One study-timeline row: an Ask chat (green) or a finished quiz (blue) with its time. */
export function SessionActivityRow({ activity }: { activity: StudyActivity }) {
  const quiz = activity.kind === 'quiz';

  return (
    <div className="flex items-center gap-3 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-4 shadow-soft">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          quiz ? 'bg-rq-menu-blue-well text-rq-menu-blue' : 'bg-rq-menu-green-well text-rq-menu-green',
        )}
      >
        <AppIcon name={quiz ? 'quiz' : 'auto-awesome'} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-rq-on-surface">{activity.title}</p>
        <p className="mt-0.5 text-xs font-medium text-rq-on-surface-variant">{activity.subtitle}</p>
      </div>
      <span className="shrink-0 text-[11px] font-medium text-rq-outline">{timeAgo(activity.at)}</span>
    </div>
  );
}
