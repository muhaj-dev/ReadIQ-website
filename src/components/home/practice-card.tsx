import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';

/** The "Take a quick quiz" call-to-action banner. */
export function PracticeCard({ href = '/quiz' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 rounded-card bg-rq-secondary-container p-4 text-rq-on-primary shadow-soft transition hover:opacity-95"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-rq-on-primary/20">
          <AppIcon name="quiz" size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">Take a quick quiz</p>
          <p className="mt-px text-xs text-rq-on-primary/80">Practice weak topics to boost mastery</p>
        </div>
      </div>
      <AppIcon name="chevron-right" size={24} />
    </Link>
  );
}
