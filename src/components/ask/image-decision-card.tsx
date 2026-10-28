import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  topic: string;
  /** Set once the student chooses — retires the buttons for a status line. */
  decided?: 'saved' | 'once';
  /** An answer is streaming — disable the buttons. */
  busy: boolean;
  onSave: () => void;
  onOnce: () => void;
};

/** Under an out-of-notes image answer: keep the photo in memory, or answer once. */
export function ImageDecisionCard({ topic, decided, busy, onSave, onOnce }: Props) {
  if (decided === 'saved') {
    return (
      <div className="flex items-center gap-2 self-start rounded-inner bg-rq-quiz-correct-well/50 px-3 py-2 text-[13px] font-semibold text-rq-quiz-check">
        <AppIcon name="check-circle" size={16} />
        Saved to your memory{topic ? ` · ${topic}` : ''}
      </div>
    );
  }
  if (decided === 'once') {
    return (
      <div className="flex items-center gap-2 self-start rounded-inner bg-rq-surface-container px-3 py-2 text-[13px] font-semibold text-rq-on-surface-variant">
        <AppIcon name="flash-on" size={15} />
        Answered once — image not saved
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 self-start">
      <button
        type="button"
        disabled={busy}
        onClick={onSave}
        aria-label="Save image to memory and answer"
        className="flex items-center gap-2 rounded-pill bg-rq-secondary px-4 py-2.5 text-sm font-semibold text-rq-on-primary transition hover:opacity-90 disabled:opacity-50"
      >
        <AppIcon name="psychology" size={18} />
        Save to memory
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onOnce}
        aria-label="Just answer once without saving"
        className="rounded-pill border border-rq-outline-variant px-4 py-2.5 text-sm font-semibold text-rq-on-surface-variant transition hover:bg-rq-surface-low disabled:opacity-50"
      >
        Just once
      </button>
    </div>
  );
}
