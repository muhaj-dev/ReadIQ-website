'use client';

import { useParams } from 'next/navigation';

import { NoteMissing } from '@/components/note/note-missing';
import { NoteReaderView } from '@/components/reader/note-reader-view';
import { useNoteDetail } from '@/data/note-detail';

/** Note Reader — read + annotate the note: highlights, margin comments, undo/redo, text size. */
export default function NoteReaderPage() {
  const { id } = useParams<{ id: string }>();
  const note = useNoteDetail(id ?? '');

  if (!note) return <NoteMissing title="Note Reader" />;

  // Keyed by id so moving between notes remounts the reader with fresh annotations.
  return <NoteReaderView key={note.id} note={note} />;
}
