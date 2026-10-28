'use client';

import { AppIcon } from '@/components/ui/app-icon';
import { EditorHighlightInk, ReaderHighlights } from '@/constants/theme';
import { cn } from '@/lib/utils';

type Props = {
  selected: string;
  onSelect: (color: string) => void;
};

/** Highlighter colour row, shown above the toolbar while the pen tool is active. */
export function HighlightPalette({ selected, onSelect }: Props) {
  return (
    <div className="mx-auto mb-3 flex w-fit items-center gap-3 rounded-pill border border-rq-outline-variant/20 bg-rq-surface-lowest px-4 py-2.5 shadow-soft">
      {ReaderHighlights.map((color) => {
        const active = color === selected;
        return (
          <button
            key={color}
            type="button"
            aria-label={`Highlighter colour ${color}`}
            aria-pressed={active}
            onClick={() => onSelect(color)}
            className={cn(
              'flex size-8 items-center justify-center rounded-pill transition hover:scale-110',
              active ? 'border-2 border-rq-on-surface' : 'border border-rq-outline-variant/50',
            )}
            style={{ backgroundColor: color, color: EditorHighlightInk }}
          >
            {active ? <AppIcon name="check" size={16} /> : null}
          </button>
        );
      })}
    </div>
  );
}
