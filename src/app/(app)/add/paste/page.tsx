'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { NoteForm } from '@/components/note-form/note-form';
import { Page } from '@/components/shell/page';
import { emptyNoteDraft } from '@/data/note-detail';
import { isRichContentEmpty } from '@/lib/rich-text';
import { useNotesStore } from '@/store/use-notes-store';

/** Add — Paste. The note editor with an empty draft; saving persists to Memory and opens the note. */
export default function PastePage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const [error, setError] = useState<string>();

  return (
    <Page width="wide">
      <NoteForm
        headerTitle="Add Note"
        back="/add"
        initial={emptyNoteDraft}
        onSave={async (values) => {
          // Only save when there's real text, an inline image, or an attachment.
          if (isRichContentEmpty(values.contentHtml) && !values.attachments.length) {
            setError('Paste or type some notes first — they are what the app answers from.');
            return;
          }
          setError(undefined);
          const note = await addNote({
            title: values.title,
            subject: values.subject,
            content: values.content,
            contentHtml: values.contentHtml,
            tags: values.tags,
            attachments: values.attachments,
            source: 'paste',
          });
          router.replace(`/note/${note.id}`);
        }}
        footer={error ? <p role="alert" className="text-sm text-rq-error">{error}</p> : undefined}
      />
    </Page>
  );
}
