import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import type { MemoryNote, NoteTint } from '@/data/memory-notes';
import { cn } from '@/lib/utils';

// Tint drives the icon tile — Drive-style file colours from the memory mock.
const TINT: Record<NoteTint, string> = {
  indigo: 'bg-rq-secondary-fixed text-rq-primary dark:bg-rq-primary-container dark:text-rq-on-primary-container',
  neutral: 'bg-rq-surface-container-high text-rq-on-surface-variant',
  green: 'bg-rq-note-green-well text-rq-note-green',
  amber: 'bg-rq-note-amber-well text-rq-note-amber',
  red: 'bg-rq-note-red-well text-rq-note-red',
};

type Props = {
  note: MemoryNote;
  /** Select mode: the card toggles selection instead of opening the note. */
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
};

/** One saved note card: icon tile, title, meta, memory badge; checkbox in select mode. */
export function NoteCard({ note, selectable = false, selected = false, onToggle }: Props) {
  const classes = cn(
    'group flex h-full w-full items-center gap-3 rounded-inner border p-4 text-left shadow-soft transition',
    selected
      ? 'border-rq-fab bg-rq-fab/5'
      : 'border-rq-outline-variant/10 bg-rq-surface-lowest hover:-translate-y-0.5 hover:border-rq-outline-variant/40',
  );

  const body = (
    <>
      {selectable ? (
        <span
          aria-hidden
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-md border-[1.5px]',
            selected ? 'border-rq-fab bg-rq-fab text-rq-on-primary' : 'border-rq-outline-variant/70',
          )}
        >
          {selected ? <AppIcon name="check" size={15} /> : null}
        </span>
      ) : null}

      <span className={cn('flex size-12 shrink-0 items-center justify-center self-start rounded-lg', TINT[note.tint])}>
        <AppIcon name={note.icon} size={24} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="truncate font-heading text-lg leading-6 font-semibold text-rq-on-surface group-hover:text-rq-primary">
            {note.title}
          </span>
          <span className="mt-1 shrink-0 text-xs font-medium text-rq-outline">{note.when}</span>
        </span>
        <span className="mt-0.5 block text-xs font-medium text-rq-on-surface-variant">
          {note.subject} · {note.meta}
        </span>
        {/* Proof of memory: the note is saved and ready for grounded answers. */}
        <span className="mt-3 inline-block rounded-lg bg-rq-surface-variant/40 px-2.5 py-1 text-xs font-semibold text-rq-secondary">
          {note.aiUsedCount > 0 ? `AI used ${note.aiUsedCount} times` : 'In memory'}
        </span>
      </span>
    </>
  );

  if (selectable) {
    return (
      <button type="button" role="checkbox" aria-checked={selected} onClick={onToggle} className={classes}>
        {body}
      </button>
    );
  }
  return (
    <Link href={`/note/${note.id}`} className={classes}>
      {body}
    </Link>
  );
}
