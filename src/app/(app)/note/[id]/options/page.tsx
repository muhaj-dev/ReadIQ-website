'use client';

import { useParams } from 'next/navigation';

import { NoteHeader } from '@/components/note/note-header';
import { NoteMissing } from '@/components/note/note-missing';
import { NoteOptionsCard } from '@/components/note/note-options-card';
import { Page } from '@/components/shell/page';
import { useNotesStore } from '@/store/use-notes-store';

/** Note Options — share, export, duplicate, move, favourite, AI summary, delete. */
export default function NoteOptionsPage() {
  const { id } = useParams<{ id: string }>();
  const note = useNotesStore((s) => s.notes.find((n) => n.id === id));

  if (!note) return <NoteMissing title="Note Options" />;

  return (
    <Page width="narrow">
      <NoteHeader title="Note Options" back={`/note/${note.id}`} />
      <p className="mb-4 truncate text-sm text-rq-on-surface-variant">
        <span className="font-semibold text-rq-on-surface">{note.title}</span>
      </p>
      <NoteOptionsCard key={note.id} note={note} />
    </Page>
  );
}
