type Props = {
  chips: string[];
  /** Tapping a chip drops its label into the input as a starting point. */
  onPick: (chip: string) => void;
};

/** Row of quick-prompt chips (Summarize · Explain · Quiz me · …) — scrolls on phones, wraps on desktop. */
export function SuggestionChips({ chips, onPick }: Props) {
  return (
    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onPick(chip)}
          className="shrink-0 rounded-inner border border-rq-outline-variant bg-rq-surface-lowest px-4 py-2 text-sm font-semibold text-rq-on-surface transition hover:border-rq-secondary/40 hover:bg-rq-surface-low"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
