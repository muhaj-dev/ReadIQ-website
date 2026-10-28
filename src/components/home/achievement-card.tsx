import Link from 'next/link';

import { ProgressRing } from '@/components/home/progress-ring';
import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  unlockedCount: number;
  total: number;
  encouragement: string;
  /** When set, the card links to the full Achievements list. */
  href?: string;
  className?: string;
};

/** The indigo "Achievements" hero card: a ring showing earned/total badges. */
export function AchievementCard({ unlockedCount, total, encouragement, href, className }: Props) {
  const percent = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

  const body = (
    <>
      <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-pill bg-rq-on-primary/5" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-32 rounded-pill bg-rq-on-primary/10" />

      <div className="relative flex items-center gap-4">
        <ProgressRing
          percent={percent}
          className="size-24"
          trackClassName="stroke-rq-on-primary/20"
          arcClassName="stroke-rq-on-primary"
        >
          <span className="font-heading text-xl font-bold">{percent}%</span>
        </ProgressRing>

        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[17px] leading-6 font-semibold">Achievements</p>
          <p className="flex items-center gap-2 text-xs font-medium text-rq-on-primary/90">
            <AppIcon name="trophy" size={14} className="text-rq-on-primary/70" />
            {unlockedCount} of {total} earned
          </p>
          <p className="mt-1 text-xs font-medium text-rq-on-primary/70">{encouragement}</p>
        </div>

        {href ? <AppIcon name="chevron-right" size={22} className="text-rq-on-primary/70" /> : null}
      </div>
    </>
  );

  const classes = cn(
    'relative block overflow-hidden rounded-card bg-rq-primary-container p-6 text-rq-on-primary shadow-soft',
    href && 'transition hover:opacity-95',
    className,
  );

  return href ? (
    <Link href={href} className={classes} aria-label={`Achievements: ${unlockedCount} of ${total} earned`}>
      {body}
    </Link>
  ) : (
    <section className={classes} aria-label={`Achievements: ${unlockedCount} of ${total} earned`}>
      {body}
    </section>
  );
}
