import { DeadlineMarkers } from '@/constants/theme';
import { cn } from '@/lib/utils';

type Props = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const NAMES = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'];

/** Colour swatch row; the selected swatch gets a surface gap + indigo ring. */
export function ColorRow({ selectedIndex, onSelect }: Props) {
  return (
    <div role="radiogroup" aria-label="Marker colour" className="flex items-center justify-between gap-2 px-2 sm:justify-start sm:gap-4">
      {DeadlineMarkers.map((marker, index) => {
        const selected = index === selectedIndex;
        return (
          <button
            key={marker}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={NAMES[index] ?? `Colour ${index + 1}`}
            onClick={() => onSelect(index)}
            className={cn(
              'flex size-11 items-center justify-center rounded-pill border-2 transition',
              selected ? 'border-rq-primary-container' : 'border-transparent hover:scale-105',
            )}
          >
            <span
              className={cn('size-8 rounded-pill', selected && 'border-4 border-rq-surface')}
              style={{ backgroundColor: marker }}
            />
          </button>
        );
      })}
    </div>
  );
}
