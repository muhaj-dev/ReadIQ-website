import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import type { DashboardDeadline, DeadlineUrgency } from '@/data/dashboard';
import { cn } from '@/lib/utils';

// Urgency drives the icon well, icon colour, and badge.
const TONE: Record<DeadlineUrgency, { well: string; badge: string }> = {
  today: {
    well: 'bg-rq-error-container/30 text-rq-error',
    badge: 'bg-rq-error-container/30 text-rq-error font-bold',
  },
  soon: {
    well: 'bg-rq-surface-container text-rq-primary',
    badge: 'bg-rq-surface-container text-rq-primary font-bold',
  },
  later: {
    well: 'bg-rq-surface-container text-rq-primary',
    badge: 'bg-rq-surface-variant text-rq-on-surface-variant font-medium',
  },
};

/** The "Upcoming Deadlines" card — one row per deadline with urgency badge. */
export function DeadlineList({ deadlines }: { deadlines: DashboardDeadline[] }) {
  return (
    <ul className="overflow-hidden rounded-card border border-rq-surface-low bg-rq-surface-lowest shadow-soft">
      {deadlines.map((deadline) => {
        const tone = TONE[deadline.urgency];
        return (
          <li key={deadline.id} className="border-b border-rq-outline-variant/20 last:border-b-0">
            <Link
              href="/deadlines"
              className="flex items-center justify-between gap-3 p-4 transition hover:bg-rq-surface-low"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', tone.well)}>
                  <AppIcon name={deadline.icon} size={20} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-rq-on-surface">{deadline.title}</p>
                  <p className="mt-0.5 text-xs text-rq-on-surface-variant">{deadline.when}</p>
                </div>
              </div>
              <span className={cn('shrink-0 rounded px-2 py-1 text-xs', tone.badge)}>{deadline.badge}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
