'use client';

type Props = {
  zoom: number;
  pages: number;
  onZoom: (zoom: number) => void;
};

const MIN = 0.5;
const MAX = 3;
const STEP = 0.25;

/** Page count + zoom out / reset / in for the PDF Reader. */
export function PdfZoomBar({ zoom, pages, onZoom }: Props) {
  const clamp = (z: number) => Math.min(MAX, Math.max(MIN, Math.round(z * 100) / 100));
  const btn =
    'flex size-9 items-center justify-center rounded-pill font-heading text-lg font-bold text-rq-on-surface-variant transition hover:bg-rq-surface-low disabled:opacity-40';

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-rq-on-surface-variant">
        {pages} page{pages === 1 ? '' : 's'}
      </p>
      <div className="flex items-center gap-1 rounded-pill border border-rq-outline-variant/20 bg-rq-surface-lowest p-1 shadow-soft">
        <button type="button" aria-label="Zoom out" className={btn} disabled={zoom <= MIN} onClick={() => onZoom(clamp(zoom - STEP))}>
          −
        </button>
        <button
          type="button"
          aria-label="Fit to width"
          onClick={() => onZoom(1)}
          className="h-9 min-w-16 rounded-pill px-2 text-sm font-semibold text-rq-on-surface transition hover:bg-rq-surface-low"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button type="button" aria-label="Zoom in" className={btn} disabled={zoom >= MAX} onClick={() => onZoom(clamp(zoom + STEP))}>
          +
        </button>
      </div>
    </div>
  );
}
