'use client';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

import type { AnnotationMode } from '@/data/note-annotations';
import type { PdfCommentDraft, PdfSelection } from '@/data/pdf-annotations';
import type { PdfAnnotations } from '@/types/note';

import { hitsRects, selectionOnPage } from './pdf-geometry';
import { PdfPage } from './pdf-page';
import './reader.css';

type Props = {
  pdf: PDFDocumentProxy;
  /** 1 = fit the column width. */
  zoom: number;
  annotations: PdfAnnotations;
  draft: PdfCommentDraft | null;
  mode: AnnotationMode;
  onHighlight: (sel: PdfSelection) => void;
  onRequestComment: (sel: PdfSelection) => void;
  onOpenComment: (id: string) => void;
  onEraseHighlight: (id: string) => void;
};

/** Every page of the PDF, sized to the column × zoom, with selection → annotation handling. */
export function PdfDocument({
  pdf,
  zoom,
  annotations,
  draft,
  mode,
  onHighlight,
  onRequestComment,
  onOpenComment,
  onEraseHighlight,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const downRef = useRef<{ x: number; y: number } | null>(null);
  const [fitWidth, setFitWidth] = useState(0);
  const [ratio, setRatio] = useState(1.294);

  // Fit-width tracks the column (window resize, sidebar, rotation).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFitWidth(Math.max(240, Math.min(el.clientWidth, 1000))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // First page's aspect sizes the placeholders before each page measures itself.
  useEffect(() => {
    let alive = true;
    pdf.getPage(1).then((p) => {
      const v = p.getViewport({ scale: 1 });
      if (alive) setRatio(v.height / v.width);
    }, () => {});
    return () => {
      alive = false;
    };
  }, [pdf]);

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    window.setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const sel = selectionOnPage(root);
      if (sel && sel.quote) {
        if (mode === 'view') return; // plain reading: leave the selection for copying
        window.getSelection()?.removeAllRanges();
        if (mode === 'highlight') onHighlight(sel);
        else onRequestComment(sel);
        return;
      }
      const down = downRef.current;
      if (down && (Math.abs(clientX - down.x) > 10 || Math.abs(clientY - down.y) > 10)) return;
      const wrapOf = (page: number) => root.querySelector<HTMLElement>(`[data-page="${page}"]`);
      const hit = <T extends { page: number; rects: PdfSelection['rects'] }>(list: T[]) =>
        [...list].reverse().find((a) => {
          const wrap = wrapOf(a.page);
          return wrap ? hitsRects(wrap, a.rects, clientX, clientY) : false;
        });
      const comment = hit(annotations.comments);
      if (comment) {
        onOpenComment(comment.id);
        return;
      }
      if (mode === 'highlight') {
        const h = hit(annotations.highlights);
        if (h) onEraseHighlight(h.id);
      }
    }, 10);
  };

  const width = Math.round(fitWidth * zoom);

  return (
    <div
      ref={rootRef}
      className="w-full overflow-x-auto"
      onPointerDown={(e) => {
        downRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={onPointerUp}
    >
      {fitWidth > 0
        ? Array.from({ length: pdf.numPages }, (_, i) => (
            <PdfPage
              key={i + 1}
              pdf={pdf}
              pageNumber={i + 1}
              width={width}
              fallbackRatio={ratio}
              highlights={annotations.highlights}
              comments={annotations.comments}
              draft={draft}
            />
          ))
        : null}
    </div>
  );
}
