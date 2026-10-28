'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isActive, showsBottomBar, TAB_ITEMS } from '@/components/shell/nav-items';
import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

/** Mobile bottom nav (below lg) — the mobile app's tab bar: active tab in an indigo
 *  pill, raised center Add button. Only on the tab screens, like the app. */
export function BottomTabBar() {
  const pathname = usePathname();
  if (!showsBottomBar(pathname)) return null;

  const tabs = TAB_ITEMS.map((item) => {
    const active = isActive(pathname, item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex min-w-16 flex-col items-center justify-center rounded-inner px-3 py-1.5',
          active ? 'bg-rq-fab text-rq-on-primary' : 'text-rq-on-surface-variant',
        )}
      >
        <AppIcon name={item.icon} size={22} filled={active && item.icon !== 'auto-awesome'} />
        <span className="mt-1 text-xs font-medium">{item.label}</span>
      </Link>
    );
  });

  tabs.splice(
    2,
    0,
    <Link
      key="add"
      href="/add"
      aria-label="Add note"
      className="-mt-6 flex size-[60px] items-center justify-center rounded-pill bg-rq-fab text-rq-on-primary shadow-[0_8px_16px_-4px_color-mix(in_oklab,var(--rq-fab)_45%,transparent)]"
    >
      <AppIcon name="add" size={32} />
    </Link>,
  );

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around rounded-t-inner border-t border-rq-outline-variant/20 bg-rq-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_12px_rgb(0_0_0/0.05)] lg:hidden"
    >
      {tabs}
    </nav>
  );
}
