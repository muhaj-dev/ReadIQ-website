'use client';

import { useParams } from 'next/navigation';

import { ContentPreview } from '@/components/note/content-preview';
import { NoteActions } from '@/components/note/note-actions';
import { NoteAttachments } from '@/components/note/note-attachments';
import { IconAction, NoteHeader } from '@/components/note/note-header';
import { NoteMissing } from '@/components/note/note-missing';
import { AiSummary, KeyTopics, NoteStatsRow, SubjectBadges } from '@/components/note/note-summary-parts';
import { Page } from '@/components/shell/page';
import { useNoteDetail } from '@/data/note-detail';
import { firstPdf } from '@/lib/pdf-file';

/** Note Details — reads the note live from the Memory store so edits show immediately.
 *  Phones: one column. Desktop: details on the left, content preview on the right. */
export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const note = useNoteDetail(id ?? '');

  if (!note) return <NoteMissing title="Note Details" />;

  return (
    <Page width="wide">
      <NoteHeader
        title="Note Details"
        back="/memory"
        actions={
          <>
            <IconAction icon="edit" label="Edit note" href={`/note/${note.id}/edit`} />
            <IconAction icon="settings" label="Note options" href={`/note/${note.id}/options`} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
        <div className="grid content-start gap-6">
          <div>
            <h2 className="mb-2 font-heading text-[26px] leading-8 font-bold text-rq-on-surface lg:text-3xl">
              {note.title}
            </h2>
            <SubjectBadges subject={note.subject} badges={note.badges} />
          </div>
          <AiSummary summary={note.aiSummary} more={note.aiSummaryMore} />
          <KeyTopics topics={note.keyTopics} />
          <NoteStatsRow stats={note.stats} />
          <div className="hidden lg:block">
            <NoteActions noteId={note.id} hasPdf={firstPdf(note.attachments) != null} />
          </div>
        </div>

        <div className="grid content-start gap-6 lg:sticky lg:top-10 lg:self-start">
          <ContentPreview
            heading={note.preview.heading}
            excerpt={note.preview.excerpt}
            image={note.preview.image}
            href={`/note/${note.id}/reader`}
          />
          <NoteAttachments attachments={note.attachments} />
        </div>
      </div>

      {/* Phones: the CTAs sit at the end, like the mobile app's pinned footer. */}
      <div className="mt-8 lg:hidden">
        <NoteActions noteId={note.id} hasPdf={firstPdf(note.attachments) != null} />
      </div>
    </Page>
  );
}
