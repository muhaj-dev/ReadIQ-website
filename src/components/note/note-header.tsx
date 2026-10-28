'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import { BackButton } from '@/components/shell/page';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  /** Where back goes (a path), or `true` for browser history. */
  back: string | true;
  /** Right-side content: an <IconAction> or anything else. */
  actions?: ReactNode;
  className?: string;
};

/** Note-page top bar (the mobile NoteHeader): back, centred indigo title, actions. */
export function NoteHeader({ title, back, actions, className }: Props) {
  return (
    <header className={cn('mb-4 flex items-center gap-2', className)}>
      <BackButton to={back} />
      <h1 className="min-w-0 flex-1 truncate text-center text-sm font-bold text-rq-primary lg:text-base">{title}</h1>
      <div className="flex min-w-10 shrink-0 items-center justify-end gap-2">{actions}</div>
    </header>
  );
}

type IconActionProps = {
  icon: AppIconName;
  label: string;
  href?: string;
  onClick?: () => void;
};

/** Round icon button/link used in note headers (edit pencil, options). */
export function IconAction({ icon, label, href, onClick }: IconActionProps) {
  const classes =
    'flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-primary transition hover:bg-rq-surface-variant';
  if (href) {
    return (
      <Link href={href} aria-label={label} title={label} className={classes}>
        <AppIcon name={icon} size={20} />
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={classes}>
      <AppIcon name={icon} size={20} />
    </button>
  );
}
