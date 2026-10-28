import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  noteId: string;
  noteTitle: string;
};

/** 📌 The signature trust tag: proves the answer came from a saved note; opens it. */
export function FromYourNotesCard({ noteId, noteTitle }: Props) {
  return (
    <Link
      href={`/note/${encodeURIComponent(noteId)}`}
      aria-label={`From your notes: ${noteTitle}. Opens the note.`}
      className="group flex max-w-[85%] items-center gap-3 self-start rounded-inner border border-rq-secondary/20 bg-rq-secondary-fixed/30 p-3 transition hover:border-rq-secondary/40 hover:bg-rq-secondary-fixed/50 sm:max-w-[70%]"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rq-surface-lowest/50 text-rq-secondary">
        <AppIcon name="auto-awesome" size={20} filled />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] leading-3 font-bold tracking-[0.08em] text-rq-secondary">FROM YOUR NOTES</p>
        <p className="mt-1 truncate text-[13px] leading-4 font-semibold text-rq-on-surface">{noteTitle}</p>
      </div>
      <AppIcon
        name="chevron-right"
        size={16}
        className="ml-auto text-rq-outline opacity-0 transition group-hover:opacity-100"
      />
    </Link>
  );
}
