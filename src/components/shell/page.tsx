'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

const WIDTHS = {
  narrow: 'max-w-2xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
} as const;

type PageProps = {
  children: ReactNode;
  /** Content column width on large screens. */
  width?: keyof typeof WIDTHS;
  className?: string;
};

/** Standard in-app page column: 20px side gutters on phones, centred column on
 *  desktop, and bottom room for the mobile tab bar. */
export function Page({ children, width = 'default', className }: PageProps) {
  return (
    <div className={cn('mx-auto w-full px-5 pt-5 pb-28 lg:px-10 lg:pt-10 lg:pb-16', WIDTHS[width], className)}>
      {children}
    </div>
  );
}

type HeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Show a back button: a path to link to, or `true` for browser history back. */
  back?: string | true;
  /** Right-side actions (buttons, menus). */
  actions?: ReactNode;
  className?: string;
};

/** Page title row (the mobile app's screen headers): optional back, title, actions. */
export function PageHeader({ title, subtitle, back, actions, className }: HeaderProps) {
  return (
    <header className={cn('mb-6 flex items-center gap-3', className)}>
      {back ? <BackButton to={back} /> : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-2xl font-extrabold tracking-tight text-rq-on-surface lg:text-3xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-0.5 text-sm text-rq-on-surface-variant">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** Round back button — a link when given a path, history-back otherwise. */
export function BackButton({ to, className }: { to: string | true; className?: string }) {
  const router = useRouter();
  const classes = cn(
    'flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-primary transition hover:bg-rq-surface-variant',
    className,
  );
  if (typeof to === 'string') {
    return (
      <Link href={to} aria-label="Back" className={classes}>
        <AppIcon name="chevron-left" size={22} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label="Back" onClick={() => router.back()} className={classes}>
      <AppIcon name="chevron-left" size={22} />
    </button>
  );
}

type EmptyProps = {
  icon: Parameters<typeof AppIcon>[0]['name'];
  title: string;
  body?: string;
  action?: ReactNode;
  className?: string;
};

/** Friendly empty state (AGENTS.md: design every one). */
export function EmptyState({ icon, title, body, action, className }: EmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-card border border-dashed border-rq-outline-variant/60 bg-rq-surface-lowest px-6 py-10 text-center',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-pill bg-rq-surface-container text-rq-secondary">
        <AppIcon name={icon} size={28} />
      </div>
      <h2 className="mt-4 font-heading text-lg font-bold text-rq-on-surface">{title}</h2>
      {body ? <p className="mt-1 max-w-sm text-sm text-rq-on-surface-variant">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
