import Link from 'next/link';

import { NAV_LINKS } from '@/components/landing/landing-data';
import { ThemeToggle } from '@/components/landing/theme-toggle';
import { ThemedLogo } from '@/components/landing/themed-logo';

/** Sticky, translucent landing header: logo · section anchors · theme · Open the app. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rq-outline-variant/30 bg-rq-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link href="/" aria-label="readIQ home" className="shrink-0">
          <ThemedLogo priority />
        </Link>

        <nav aria-label="Sections" className="ml-6 hidden flex-1 items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-inner px-3 py-2 text-sm font-medium text-rq-on-surface-variant transition hover:bg-rq-surface-low hover:text-rq-on-surface"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/home"
            className="inline-flex h-10 items-center rounded-btn bg-rq-fab px-4 font-heading text-sm font-bold text-rq-on-primary shadow-soft transition hover:opacity-90"
          >
            Open the app
          </Link>
        </div>
      </div>
    </header>
  );
}
