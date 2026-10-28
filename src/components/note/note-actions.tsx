'use client';

import Link from 'next/link';

import { ListenButton } from '@/components/podcast/listen-button';
import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  noteId: string;
  /** Show the "PDF Reader" button (the note has a PDF attachment). */
  hasPdf: boolean;
};

/** Note Details calls to action: Open Note (gradient), PDF Reader, and Broadcast. */
export function NoteActions({ noteId, hasPdf }: Props) {
  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <Link
          href={`/note/${noteId}/reader`}
          className="flex h-14 flex-1 items-center justify-center rounded-card bg-linear-to-br from-rq-secondary to-rq-primary-container font-heading text-xl font-semibold text-rq-on-primary shadow-soft transition hover:brightness-110"
        >
          Open Note
        </Link>
        {hasPdf ? (
          <Link
            href={`/note/${noteId}/pdf`}
            className="flex h-14 items-center justify-center gap-2 rounded-card border border-rq-secondary/40 bg-rq-surface-lowest px-4 text-[15px] font-semibold text-rq-secondary transition hover:bg-rq-surface-low"
          >
            <AppIcon name="picture-as-pdf" size={22} />
            PDF Reader
          </Link>
        ) : null}
      </div>
      <ListenButton href={`/note/${noteId}/listen`} />
    </div>
  );
}
