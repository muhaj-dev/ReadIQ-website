'use client';

import { useRouter } from 'next/navigation';

import { ExtractStatus } from '@/components/add/extract-status';
import { UploadDropzone } from '@/components/add/upload-dropzone';
import { useDocumentUpload } from '@/components/add/use-document-upload';
import { NoteForm } from '@/components/note-form/note-form';
import { Page, PageHeader } from '@/components/shell/page';
import { emptyNoteDraft } from '@/data/note-detail';
import { plainTextToHtml } from '@/lib/rich-text';
import { useNotesStore } from '@/store/use-notes-store';

/** Strip the extension so "week4-notes.pdf" titles the note "week4-notes". */
const baseName = (name: string) => name.replace(/\.[^.]+$/, '');

/** Add — Upload. Pick or drop a PDF (read by Gemini) or .docx (unpacked locally),
 *  summarize the text, then confirm title/subject/tags and save. */
export default function UploadPage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const upload = useDocumentUpload();
  const { status, attachments, content, aiSummary } = upload;

  if (status === 'picking') {
    return (
      <Page width="narrow">
        <PageHeader title="Upload Document" subtitle="PDF or Word — we pull the text out for you." back="/add" />
        <UploadDropzone onFiles={upload.accept} error={upload.error} />
      </Page>
    );
  }

  if (status !== 'ready') {
    return (
      <Page width="narrow">
        <PageHeader title="Upload Document" back="/add" />
        <ExtractStatus
          state={status}
          fileName={attachments.map((a) => a.name).join(', ') || 'Document'}
          message={upload.error}
          onRetry={upload.retry}
          onSkip={upload.skip}
        />
        {status === 'error' ? (
          <button
            type="button"
            onClick={upload.reset}
            className="mx-auto block text-sm font-medium text-rq-on-surface-variant underline-offset-2 hover:underline"
          >
            Choose a different file
          </button>
        ) : null}
      </Page>
    );
  }

  return (
    <Page width="wide">
      <NoteForm
        headerTitle="Add Document"
        back="/add"
        attachmentsFirst
        // With extracted text the editor stays hidden; when skipped, let the student type.
        hideContent={!!content.trim()}
        initial={{
          ...emptyNoteDraft,
          title: baseName(attachments[0]?.name ?? ''),
          content,
          contentHtml: plainTextToHtml(content),
          attachments,
        }}
        onSave={async (values) => {
          const note = await addNote({
            title: values.title,
            subject: values.subject,
            content: values.content,
            contentHtml: values.contentHtml,
            tags: values.tags,
            attachments: values.attachments,
            aiSummary,
            source: 'file',
          });
          router.replace(`/note/${note.id}`);
        }}
      />
    </Page>
  );
}
