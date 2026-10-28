import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  unlockedCount: number;
  total: number;
  encouragement: string;
};

/** Achievements header: a big trophy with the earned score beside it + a progress bar. */
export function AchievementSummary({ unlockedCount, total, encouragement }: Props) {
  const percent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  return (
    <section className="rounded-card border border-rq-surface-low bg-rq-surface-lowest p-5 shadow-soft">
      <div className="flex items-center gap-5">
        <div className="flex size-[76px] shrink-0 items-center justify-center rounded-[22px] bg-rq-menu-orange-well text-rq-menu-orange">
          <AppIcon name="trophy" size={44} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-baseline">
            <span className="font-heading text-[40px] leading-[46px] font-extrabold text-rq-menu-orange">
              {unlockedCount}
            </span>
            <span className="font-heading text-[22px] font-bold text-rq-on-surface-variant">&nbsp;/ {total}</span>
          </p>
          <p className="text-[13px] font-medium text-rq-on-surface-variant">Badges earned</p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-pill bg-rq-menu-orange/15"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-pill bg-rq-menu-orange transition-[width] duration-700" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-rq-on-surface">{encouragement}</p>
    </section>
  );
}
