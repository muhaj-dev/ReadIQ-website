import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';

/** Secondary CTA on Note Details: broadcast the note as a two-host conversation. */
export function ListenButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Broadcast this note as a two-host conversation"
      className="flex h-14 w-full items-center gap-3 rounded-card border border-rq-secondary/35 bg-rq-secondary/10 px-4 transition hover:bg-rq-secondary/15"
    >
      <span className="flex size-9 items-center justify-center rounded-pill bg-rq-secondary text-rq-on-primary">
        <AppIcon name="headphones" size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold text-rq-secondary">Broadcast this note</span>
        <span className="block truncate text-xs text-rq-on-surface-variant">A two-host conversation from your notes</span>
      </span>
      <AppIcon name="chevron-right" size={22} className="text-rq-secondary" />
    </Link>
  );
}
