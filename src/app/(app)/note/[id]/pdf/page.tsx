'use client';

import { useParams } from 'next/navigation';

import { NoteMissing } from '@/components/note/note-missing';
import { PdfReaderView } from '@/components/reader/pdf-reader-view';
import { useNoteDetail } from '@/data/note-detail';
import { firstPdf } from '@/lib/pdf-file';

/** PDF Reader — the note's original PDF, exactly, with highlights and comments. */
export default function PdfReaderPage() {
  const { id } = useParams<{ id: string }>();
  const note = useNoteDetail(id ?? '');
  const pdf = note ? firstPdf(note.attachments) : null;

  if (!note || !pdf) return <NoteMissing title="PDF Reader" />;

  return <PdfReaderView key={note.id} note={note} attachment={pdf} />;
}
