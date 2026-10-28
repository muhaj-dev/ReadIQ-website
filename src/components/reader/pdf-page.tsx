'use client';

import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

import type { PdfCommentDraft } from '@/data/pdf-annotations';
import type { PdfCommentAnn, PdfHighlight, PdfRect } from '@/types/note';

import { loadPdfjs } from './pdfjs';

type Props = {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  /** CSS width the page renders at (fit-width × zoom). */
  width: number;
  /** Height/width ratio used until this page's own size is known. */
  fallbackRatio: number;
  highlights: PdfHighlight[];
  comments: PdfCommentAnn[];
  draft: PdfCommentDraft | null;
};

/** Absolutely place a normalized rect — percentages re-project at any zoom for free. */
const rectStyle = (r: PdfRect) => ({
  left: `${r.x * 100}%`,
  top: `${r.y * 100}%`,
  width: `${r.w * 100}%`,
  height: `${r.h * 100}%`,
});

/** One PDF page: canvas paint + selectable text layer + annotation overlay. Renders lazily. */
export function PdfPage({ pdf, pageNumber, width, fallbackRatio, highlights, comments, draft }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(fallbackRatio);
  const [near, setNear] = useState(pageNumber <= 2);

  // Start rendering once the page scrolls near the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setNear(true);
    }, { rootMargin: '1200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => {
    if (!near || width <= 0) return;
    let cancelled = false;
    let task: RenderTask | null = null;
    (async () => {
      const pdfjs = await loadPdfjs();
      const page = await pdf.getPage(pageNumber);
      const base = page.getViewport({ scale: 1 });
      if (cancelled) return;
      setRatio(base.height / base.width);
      const scale = width / base.width;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const text = textRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !text || !wrap) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      task = page.render({ canvas, viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined });
      await task.promise;
      if (cancelled) return;

      // Selection layer is best-effort — the page still reads without it.
      try {
        wrap.style.setProperty('--total-scale-factor', String(scale));
        text.replaceChildren();
        const layer = new pdfjs.TextLayer({ textContentSource: await page.getTextContent(), container: text, viewport });
        await layer.render();
      } catch {
        /* no text layer (scanned PDF) */
      }
    })().catch(() => {
      /* render cancelled by a zoom change, or a damaged page */
    });
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, pageNumber, width, near]);

  const pageHighlights = highlights.filter((h) => h.page === pageNumber);
  const pageComments = comments.filter((c) => c.page === pageNumber);
  const pageDraft = draft?.page === pageNumber ? draft : null;

  return (
    <div
      ref={wrapRef}
      data-page={pageNumber}
      className="rq-pdf-page relative mx-auto mb-4 overflow-hidden rounded-md bg-white shadow-soft"
      style={{ width, height: Math.floor(width * ratio) }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
      {/* Blend the whole layer (it is its own stacking context) so ink shows through. */}
      <div className="pointer-events-none absolute inset-0 z-[1] mix-blend-multiply">
        {pageHighlights.flatMap((h) =>
          h.rects.map((r, i) => (
            <div
              key={`${h.id}-${i}`}
              className="absolute rounded-[2px]"
              style={{ ...rectStyle(r), background: h.color }}
            />
          )),
        )}
        {[...pageComments, ...(pageDraft ? [pageDraft] : [])].map((c) => (
          <div key={c.id}>
            {c.rects.map((r, i) => (
              <div
                key={i}
                className="absolute rounded-t-[2px] border-b-2 border-rq-secondary bg-rq-secondary/15"
                style={rectStyle(r)}
              />
            ))}
            {c.rects[0] ? (
              <span
                className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-rq-secondary ring-2 ring-white"
                style={{ left: `${(c.rects[0].x + c.rects[0].w) * 100}%`, top: `${c.rects[0].y * 100}%` }}
              />
            ) : null}
          </div>
        ))}
      </div>
      <div ref={textRef} className="textLayer" />
    </div>
  );
}
