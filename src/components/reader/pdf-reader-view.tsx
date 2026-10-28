'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { IconAction, NoteHeader } from '@/components/note/note-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { NoteDetail } from '@/data/note-detail';
import { usePdfAnnotations } from '@/data/pdf-annotations';
import { readPdfBytes } from '@/lib/pdf-file';
import type { NoteAttachment } from '@/types/note';

import { CommentDialog } from './comment-dialog';
import { HighlightPalette } from './highlight-palette';
import { PdfDocument } from './pdf-document';
import { PdfZoomBar } from './pdf-zoom-bar';
import { loadPdfjs } from './pdfjs';
import { ReaderToolbar } from './reader-toolbar';

type Props = { note: NoteDetail; attachment: NoteAttachment };
type Status = 'loading' | 'ready' | 'error';

/** PDF Reader: the original PDF rendered in the browser (never uploaded) with highlights + comments. */
export function PdfReaderView({ note, attachment }: Props) {
  const router = useRouter();
  const ann = usePdfAnnotations(note);
  const [status, setStatus] = useState<Status>('loading');
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [zoom, setZoom] = useState(1);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    let task: ReturnType<Awaited<ReturnType<typeof loadPdfjs>>['getDocument']> | null = null;
    (async () => {
      const [pdfjs, data] = await Promise.all([loadPdfjs(), readPdfBytes(attachment)]);
      if (!alive) return;
      task = pdfjs.getDocument({ data });
      const doc = await task.promise;
      if (!alive) return;
      setPdf(doc);
      setStatus('ready');
    })().catch(() => {
      if (alive) setStatus('error');
    });
    return () => {
      alive = false;
      void task?.destroy(); // frees the worker-side document
    };
  }, [attachment, attempt]);

  const retry = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-5 lg:px-10 lg:pt-10">
      <NoteHeader
        title="PDF Reader"
        back={`/note/${note.id}`}
        actions={<IconAction icon="ios-share" label="Note options" href={`/note/${note.id}/options`} />}
      />

      {status === 'loading' ? (
        <div className="space-y-4" aria-label="Opening PDF">
          <p className="text-center text-sm text-rq-on-surface-variant">Opening PDF…</p>
          <Skeleton className="mx-auto aspect-[1/1.29] w-full max-w-2xl rounded-md" />
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-16 text-center">
          <h2 className="font-heading text-lg font-semibold text-rq-on-surface">Couldn&apos;t open this PDF</h2>
          <p className="text-sm text-rq-on-surface-variant">
            The file may no longer be stored in this browser. Re-upload it, or try again.
          </p>
          <Button onClick={retry} className="mt-2 h-10 rounded-pill px-6">
            Try again
          </Button>
        </div>
      ) : null}

      {status === 'ready' && pdf ? (
        <>
          <div className="mb-4">
            <PdfZoomBar zoom={zoom} pages={pdf.numPages} onZoom={setZoom} />
          </div>
          <PdfDocument
            pdf={pdf}
            zoom={zoom}
            annotations={ann.annotations}
            draft={ann.draft}
            mode={ann.mode}
            onHighlight={ann.addHighlight}
            onRequestComment={ann.requestComment}
            onOpenComment={ann.openComment}
            onEraseHighlight={ann.eraseHighlight}
          />
          <div className="sticky bottom-0 z-10 mx-auto max-w-md pt-2 pb-6">
            {ann.mode === 'highlight' ? (
              <HighlightPalette selected={ann.highlightColor} onSelect={ann.setHighlightColor} />
            ) : null}
            <ReaderToolbar
              mode={ann.mode}
              onSetMode={ann.setMode}
              onListen={() => router.push(`/note/${note.id}/listen`)}
            />
          </div>
        </>
      ) : null}

      <CommentDialog
        open={ann.draft != null || ann.opened != null}
        editing={ann.opened != null}
        quote={ann.draft?.quote ?? ann.opened?.quote ?? ''}
        initialBody={ann.opened?.body ?? ''}
        timestamp={ann.opened?.createdAt ?? null}
        onSave={ann.saveComment}
        onDelete={ann.deleteComment}
        onCancel={ann.cancelComment}
      />
    </div>
  );
}
