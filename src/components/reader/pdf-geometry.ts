// Selection ↔ page geometry for the PDF Reader (ported from the mobile app's
// pdf-reader-doc.ts). Rects are fractions (0–1) of the page box so annotations
// re-project at any zoom.

import type { PdfSelection } from '@/data/pdf-annotations';
import type { PdfRect } from '@/types/note';

type Line = { top: number; bottom: number; left: number; right: number };

/** Merge per-glyph client rects into one rect per text line. */
function mergeByLine(rects: DOMRect[]): Line[] {
  const lines: Line[] = [];
  for (const r of rects) {
    const hit = lines.find((l) => Math.abs(l.top - r.top) < r.height * 0.6);
    if (!hit) lines.push({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    else {
      hit.top = Math.min(hit.top, r.top);
      hit.bottom = Math.max(hit.bottom, r.bottom);
      hit.left = Math.min(hit.left, r.left);
      hit.right = Math.max(hit.right, r.right);
    }
  }
  return lines;
}

/** The live selection as normalized rects on the page it starts in, or null. */
export function selectionOnPage(container: HTMLElement): PdfSelection | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  const start = range.startContainer;
  const startEl = start.nodeType === Node.TEXT_NODE ? start.parentElement : (start as Element);
  const wrap = startEl?.closest<HTMLElement>('[data-page]');
  if (!wrap || !container.contains(wrap)) return null;

  const box = wrap.getBoundingClientRect();
  const keep = Array.from(range.getClientRects()).filter((r) => {
    if (r.width < 1 || r.height < 1) return false;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return cx >= box.left && cx <= box.right && cy >= box.top && cy <= box.bottom;
  });
  if (keep.length === 0) return null;

  const rects: PdfRect[] = mergeByLine(keep).map((l) => ({
    x: (l.left - box.left) / box.width,
    y: (l.top - box.top) / box.height,
    w: (l.right - l.left) / box.width,
    h: (l.bottom - l.top) / box.height,
  }));
  return { page: Number(wrap.getAttribute('data-page')), rects, quote: sel.toString().trim() };
}

/** Is the client point inside any of an annotation's rects on its page? */
export function hitsRects(wrap: HTMLElement, rects: PdfRect[], clientX: number, clientY: number): boolean {
  const box = wrap.getBoundingClientRect();
  const x = (clientX - box.left) / box.width;
  const y = (clientY - box.top) / box.height;
  const pad = 0.006;
  return rects.some((r) => x >= r.x - pad && x <= r.x + r.w + pad && y >= r.y - pad && y <= r.y + r.h + pad);
}
