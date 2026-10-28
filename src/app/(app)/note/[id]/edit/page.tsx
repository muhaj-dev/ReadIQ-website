'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { DeleteNoteButton } from '@/components/note-form/delete-note-button';
import { NoteForm } from '@/components/note-form/note-form';
import { EmptyState, Page, PageHeader } from '@/components/shell/page';
import { Button } from '@/components/ui/button';
import { useNoteDetail } from '@/data/note-detail';
import { useNotesStore } from '@/store/use-notes-store';

/** Edit Note — the shared editor pre-filled from the saved note, with a Delete footer. */
export default function EditNotePage() {
  const router = useRouter();
  const { id = '' } = useParams<{ id: string }>();
  const note = useNoteDetail(id);
  const loaded = useNotesStore((s) => s.loaded);
  const updateNote = useNotesStore((s) => s.updateNote);
  const removeNote = useNotesStore((s) => s.removeNote);

  // Notes load from IndexedDB on start — wait before deciding the note is missing.
  if (!loaded) return null;

  if (!note) {
    return (
      <Page width="narrow">
        <PageHeader title="Edit Note" back="/memory" />
        <EmptyState
          icon="description"
          title="Note not found"
          body="This note may have been deleted. Your other notes are safe in Memory."
          action={<Button render={<Link href="/memory" />} nativeButton={false} className="h-11 rounded-btn px-6">Back to Memory</Button>}
        />
      </Page>
    );
  }

  return (
    <Page width="wide">
      <NoteForm
        // Remount if a different note is opened in place.
        key={note.id}
        headerTitle="Edit Note"
        back={`/note/${note.id}`}
        initial={{
          title: note.title,
          subject: note.subject,
          tags: note.tags,
          content: note.content,
          contentHtml: note.contentHtml ?? '',
          attachments: note.attachments,
        }}
        onSave={async (values) => {
          await updateNote(note.id, {
            title: values.title,
            subject: values.subject,
            content: values.content,
            contentHtml: values.contentHtml,
            tags: values.tags,
            attachments: values.attachments,
          });
          router.replace(`/note/${note.id}`);
        }}
        footer={
          <DeleteNoteButton
            onConfirm={async () => {
              await removeNote(note.id);
              router.replace('/memory');
            }}
          />
        }
      />
    </Page>
  );
}
