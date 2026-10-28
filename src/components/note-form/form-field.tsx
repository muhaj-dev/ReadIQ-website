import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  label: string;
  /** Associates the label with an input (click-to-focus). */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

/** A labelled form section (the Edit Note mock's "Title", "Subject", "Tags" …). */
export function FormField({ label, htmlFor, children, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="ml-1 text-sm font-medium text-rq-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Shared input look for the note form (white field, soft outline, indigo focus). */
export const fieldInputClass =
  'h-12 w-full rounded-inner border border-rq-outline-variant/60 bg-rq-surface-lowest px-4 text-base text-rq-on-surface outline-none transition placeholder:text-rq-outline focus:border-rq-secondary-container focus:ring-3 focus:ring-rq-secondary-container/20';
