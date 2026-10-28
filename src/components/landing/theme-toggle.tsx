'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { AppIcon } from '@/components/ui/app-icon';

const subscribe = () => () => {};

/** Light / dark switch for the public pages (in-app theme lives in Settings). */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The resolved theme is only known on the client — render a neutral icon until then.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-11 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container hover:text-rq-primary"
    >
      <AppIcon name={mounted ? (dark ? 'sun' : 'moon') : 'settings-brightness'} size={20} />
    </button>
  );
}
