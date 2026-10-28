import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  /** Shown only when the student has moved away from the current month. */
  onToday?: () => void;
};

const NAV =
  'flex size-10 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container hover:text-rq-on-surface';

/** "‹ May 2026 ›" month navigation row, with a jump back to today. */
export function MonthSwitcher({ label, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center justify-between pt-2">
      <button type="button" aria-label="Previous month" onClick={onPrev} className={NAV}>
        <AppIcon name="chevron-left" size={24} />
      </button>

      <div className="flex items-center gap-2">
        <h2 className="font-heading text-lg font-bold text-rq-on-surface" aria-live="polite">
          {label}
        </h2>
        {onToday ? (
          <button
            type="button"
            onClick={onToday}
            className="rounded-pill bg-rq-surface-container px-2.5 py-1 text-xs font-semibold text-rq-primary transition hover:bg-rq-surface-variant"
          >
            Today
          </button>
        ) : null}
      </div>

      <button type="button" aria-label="Next month" onClick={onNext} className={NAV}>
        <AppIcon name="chevron-right" size={24} />
      </button>
    </div>
  );
}
