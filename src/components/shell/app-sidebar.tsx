'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandLogo } from '@/components/shell/brand-logo';
import { isActive, SIDEBAR_ITEMS } from '@/components/shell/nav-items';
import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';
import { useNotesStore } from '@/store/use-notes-store';

/** Desktop navigation (lg and up): brand, primary "Add note", sections, settings. */
export function AppSidebar() {
  const pathname = usePathname();
  const noteCount = useNotesStore((s) => s.notes.length);

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
      <Link href="/home" className="px-2" aria-label="readIQ home">
        <BrandLogo width={112} />
      </Link>

      <Link
        href="/add"
        className="mt-8 flex h-11 items-center justify-center gap-2 rounded-btn bg-rq-fab font-heading text-sm font-bold text-rq-on-primary shadow-soft transition hover:opacity-90"
      >
        <AppIcon name="add" size={20} />
        Add note
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Main">
        {SIDEBAR_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex h-11 items-center gap-3 rounded-inner px-3 text-[15px] font-medium transition',
                active
                  ? 'bg-rq-surface-container text-rq-primary'
                  : 'text-rq-on-surface-variant hover:bg-rq-surface-low hover:text-rq-on-surface',
              )}
            >
              <AppIcon name={item.icon} size={20} filled={active && item.icon !== 'auto-awesome'} />
              <span className="flex-1">{item.label}</span>
              {item.href === '/memory' && noteCount > 0 ? (
                <span className="rounded-pill bg-rq-surface-lowest px-2 py-0.5 text-xs font-semibold text-rq-secondary">
                  {noteCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/settings"
        className={cn(
          'flex h-11 items-center gap-3 rounded-inner px-3 text-[15px] font-medium transition',
          pathname.startsWith('/settings')
            ? 'bg-rq-surface-container text-rq-primary'
            : 'text-rq-on-surface-variant hover:bg-rq-surface-low hover:text-rq-on-surface',
        )}
      >
        <AppIcon name="settings" size={20} />
        Settings
      </Link>
    </aside>
  );
}
