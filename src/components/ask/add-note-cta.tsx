import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';

/** Nudge under an ungrounded reply — the honest "add a note" path. */
export function AddNoteCta() {
  return (
    <Link
      href="/add"
      className="flex items-center gap-2 self-start rounded-inner bg-rq-surface-container px-3 py-2 text-[13px] font-semibold text-rq-primary transition hover:bg-rq-surface-variant"
    >
      <AppIcon name="add" size={18} />
      Add a note
    </Link>
  );
}
