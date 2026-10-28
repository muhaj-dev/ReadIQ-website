'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

const SIZES = [
  { label: 'S', value: 0.88 },
  { label: 'M', value: 1 },
  { label: 'L', value: 1.15 },
  { label: 'XL', value: 1.3 },
] as const;

const KEY = 'reader_font_scale';

function readSaved(): number {
  try {
    const n = Number(window.localStorage.getItem(KEY));
    return SIZES.some((s) => s.value === n) ? n : 1;
  } catch {
    return 1;
  }
}

/** Reader text size, remembered per browser (a per-viewer convenience). */
export function useReaderFontScale() {
  const [scale, setScaleState] = useState<number>(() => (typeof window === 'undefined' ? 1 : readSaved()));
  const setScale = (value: number) => {
    setScaleState(value);
    try {
      window.localStorage.setItem(KEY, String(value));
    } catch {
      // Blocked storage — the size still applies for this visit.
    }
  };
  return { scale, setScale };
}

type Props = { value: number; onChange: (value: number) => void };

/** Segmented S / M / L / XL text-size picker shown above the reader toolbar. */
export function TextSizeControl({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Text size"
      className="mx-auto mb-3 flex w-fit items-center gap-1 rounded-pill border border-rq-outline-variant/20 bg-rq-surface-lowest p-1.5 shadow-soft"
    >
      {SIZES.map((size) => {
        const active = size.value === value;
        return (
          <button
            key={size.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(size.value)}
            className={cn(
              'h-9 min-w-11 rounded-pill px-3 font-heading font-bold transition',
              active ? 'bg-rq-secondary text-rq-on-primary' : 'text-rq-on-surface-variant hover:bg-rq-surface-low',
            )}
            style={{ fontSize: 13 * size.value }}
          >
            {size.label}
          </button>
        );
      })}
    </div>
  );
}
