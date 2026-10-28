import { AppIcon } from '@/components/ui/app-icon';
import { EditorTextColors } from '@/constants/theme';
import { cn } from '@/lib/utils';

type Props = {
  /** The active font colour, so the current swatch reads selected. */
  activeColor?: string;
  onSelect: (color: string) => void;
  /** Clears the font colour back to the default ink. */
  onClear: () => void;
};

/** Font-colour swatches, revealed under the toolbar when the text-colour tool is on. */
export function EditorColorRow({ activeColor, onSelect, onClear }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-rq-outline-variant/40 px-2 py-2">
      {EditorTextColors.map((color) => {
        const active = color.toLowerCase() === activeColor?.toLowerCase();
        return (
          <button
            key={color}
            type="button"
            aria-label={`Text colour ${color}`}
            aria-pressed={active}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(color)}
            className={cn(
              'flex size-8 items-center justify-center rounded-pill text-rq-on-primary',
              active ? 'border-2 border-rq-on-surface' : 'border border-rq-outline-variant/50',
            )}
            // Swatch colour is data (the picked ink), not theme.
            style={{ backgroundColor: color }}
          >
            {active ? <AppIcon name="check" size={16} /> : null}
          </button>
        );
      })}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClear}
        className="h-8 rounded-pill border border-rq-outline-variant/50 px-3 text-xs font-semibold text-rq-on-surface-variant transition hover:bg-rq-surface-low"
      >
        Clear
      </button>
    </div>
  );
}
