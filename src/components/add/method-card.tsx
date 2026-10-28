import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import { tokenVar } from '@/constants/theme';
import type { AddMethod } from '@/data/add-methods';

/** One of the four chooser cards: tinted icon circle + title + description. */
export function MethodCard({ method }: { method: AddMethod }) {
  return (
    <Link
      href={method.href}
      className="group flex flex-col items-center rounded-card bg-rq-surface-lowest p-6 text-center shadow-soft ring-1 ring-rq-outline-variant/20 transition hover:-translate-y-0.5 hover:ring-rq-secondary-container/50 lg:p-8"
    >
      <span
        className="mb-4 flex size-16 items-center justify-center rounded-pill transition group-hover:scale-105 lg:size-18"
        // Each method has its own tint token (data-driven), resolved to its CSS variable.
        style={{ backgroundColor: tokenVar(method.well), color: tokenVar(method.tint) }}
      >
        <AppIcon name={method.icon} size={32} />
      </span>
      <span className="mb-1 font-heading text-base font-bold text-rq-on-surface lg:text-lg">{method.title}</span>
      <span className="text-sm leading-snug text-rq-on-surface-variant">{method.description}</span>
    </Link>
  );
}
