import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';

/** Floating "+" button (bottom-right, phones/tablets) → Add Deadline. Desktop uses
 *  the header button instead. */
export function AddFab() {
  return (
    <Link
      href="/deadlines/add"
      aria-label="Add deadline"
      className="fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-30 flex size-14 items-center justify-center rounded-pill bg-rq-secondary-container text-rq-on-primary shadow-[0_8px_16px_-4px_color-mix(in_oklab,var(--rq-secondary-container)_50%,transparent)] transition hover:opacity-90 lg:hidden"
    >
      <AppIcon name="add" size={26} />
    </Link>
  );
}
