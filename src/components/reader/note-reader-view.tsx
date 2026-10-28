'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { IconAction, NoteHeader } from '@/components/note/note-header';
import { useNoteAnnotations } from '@/data/note-annotations';
import type { NoteDetail } from '@/data/note-detail';

import { CommentDialog } from './comment-dialog';
import { HighlightPalette } from './highlight-palette';
import { ReaderArticle, type ReaderArticleHandle } from './reader-article';
import { ReaderHistoryBar } from './reader-history-bar';
import { ReaderToolbar } from './reader-toolbar';
import { TextSizeControl, useReaderFontScale } from './text-size-control';

type Props = { note: NoteDetail };

/** Annotatable Note Reader: the note's HTML with highlight + comment tools, undo/redo, text size. */
export function NoteReaderView({ note }: Props) {
  const router = useRouter();
  const articleRef = useRef<ReaderArticleHandle>(null);
  const ann = useNoteAnnotations(note);
  const font = useReaderFontScale();
  const [sizeOpen, setSizeOpen] = useState(false);

  // Cancelling a new comment unwraps its anchor; the unwrap re-persists clean HTML.
  const cancelDraft = () => {
    const cid = ann.discardDraft();
    if (cid) articleRef.current?.removeMark(cid);
  };
  const deleteOpened = () => {
    const id = ann.openedComment?.id;
    if (!id) return;
    ann.removeComment(id);
    articleRef.current?.removeMark(id);
  };
  // Undo/redo return the HTML snapshot to restore; push it into the article DOM.
  const undo = () => {
    const html = ann.undo();
    if (html != null) articleRef.current?.setHtml(html);
  };
  const redo = () => {
    const html = ann.redo();
    if (html != null) articleRef.current?.setHtml(html);
  };

  const hint =
    ann.mode === 'highlight'
      ? 'Select text to highlight it. Click a highlight to remove it.'
      : ann.mode === 'comment'
        ? 'Select text to pin a comment to it.'
        : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-5 lg:px-10 lg:pt-10">
      <NoteHeader
        title="Note Reader"
        back={`/note/${note.id}`}
        actions={
          <>
            <ReaderHistoryBar canUndo={ann.canUndo} canRedo={ann.canRedo} onUndo={undo} onRedo={redo} />
            <IconAction icon="ios-share" label="Note options" href={`/note/${note.id}/options`} />
          </>
        }
      />

      <article className="rounded-card bg-rq-surface-lowest px-5 py-6 shadow-soft sm:px-8 sm:py-8">
        <h2 className="mb-5 font-heading text-[26px] leading-tight font-extrabold text-rq-on-surface">{note.title}</h2>
        <ReaderArticle
          ref={articleRef}
          initialHtml={ann.initialHtml}
          mode={ann.mode}
          highlightColor={ann.highlightColor}
          fontScale={font.scale}
          onChangeHtml={ann.onChangeHtml}
          onRequestComment={ann.onRequestComment}
          onOpenComment={ann.onOpenComment}
        />
        {ann.comments.length > 0 ? (
          <p className="mt-6 text-xs font-medium text-rq-outline">
            {ann.comments.length} comment{ann.comments.length === 1 ? '' : 's'} — click an underlined passage to read it.
          </p>
        ) : null}
      </article>

      <div className="sticky bottom-0 z-10 mx-auto max-w-md pt-4 pb-6">
        {hint ? <p className="mb-2 text-center text-xs font-medium text-rq-on-surface-variant">{hint}</p> : null}
        {sizeOpen ? <TextSizeControl value={font.scale} onChange={font.setScale} /> : null}
        {ann.mode === 'highlight' && !sizeOpen ? (
          <HighlightPalette selected={ann.highlightColor} onSelect={ann.setHighlightColor} />
        ) : null}
        <ReaderToolbar
          mode={ann.mode}
          onSetMode={(m) => {
            setSizeOpen(false);
            ann.setMode(m);
          }}
          onTextSize={() => setSizeOpen((open) => !open)}
          textSizeOpen={sizeOpen}
          onListen={() => router.push(`/note/${note.id}/listen`)}
        />
      </div>

      <CommentDialog
        open={ann.draft != null || ann.openedComment != null}
        editing={ann.openedComment != null}
        quote={ann.draft?.quote ?? ann.openedComment?.quote ?? ''}
        initialBody={ann.openedComment?.body ?? ''}
        timestamp={ann.openedComment?.createdAt ?? null}
        onSave={(body) =>
          ann.draft ? ann.saveDraft(body) : ann.openedComment && ann.saveEdit(ann.openedComment.id, body)
        }
        onDelete={deleteOpened}
        onCancel={ann.draft ? cancelDraft : ann.closeOpen}
      />
    </div>
  );
}
