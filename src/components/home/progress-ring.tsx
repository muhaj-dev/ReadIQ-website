import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// r ≈ 15.9155 in a 36×36 box → circumference ≈ 100, so dasharray is "percent, 100".
const RING_PATH = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

type Props = {
  percent: number;
  /** Tailwind stroke classes for the track and the filled arc. */
  trackClassName: string;
  arcClassName: string;
  /** Box size classes (e.g. "size-24"). */
  className?: string;
  children?: ReactNode;
};

/** Circular progress ring with centred content (achievements, quiz averages). */
export function ProgressRing({ percent, trackClassName, arcClassName, className, children }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn('relative flex shrink-0 items-center justify-center', className)}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 size-full" aria-hidden>
        <path d={RING_PATH} fill="none" strokeWidth={3} className={trackClassName} />
        <path
          d={RING_PATH}
          fill="none"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${clamped}, 100`}
          className={cn('transition-[stroke-dasharray] duration-700', arcClassName)}
        />
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
