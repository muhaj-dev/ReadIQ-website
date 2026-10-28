import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

export type OptionStatus = 'idle' | 'correct' | 'wrong';

type Props = {
  letter: string;
  text: string;
  status: OptionStatus;
  /** Disabled once an answer is locked in. */
  disabled: boolean;
  onPress: () => void;
};

const STYLES: Record<OptionStatus, { card: string; well: string; text: string }> = {
  idle: {
    card: 'border border-transparent bg-rq-surface-lowest',
    well: 'bg-rq-surface-low text-rq-on-surface-variant',
    text: 'text-rq-on-surface',
  },
  correct: {
    card: 'border-2 border-rq-quiz-correct bg-rq-quiz-correct-bg',
    well: 'bg-rq-quiz-correct-well text-rq-quiz-correct-ink',
    text: 'text-rq-quiz-correct-text',
  },
  wrong: {
    card: 'border-2 border-rq-error bg-rq-error/8',
    well: 'bg-rq-error/16 text-rq-error',
    text: 'text-rq-error',
  },
};

const SUFFIX: Record<OptionStatus, string> = { idle: '', correct: ' (correct answer)', wrong: ' (your answer, wrong)' };

/** One MCQ answer card; correct turns green, wrong turns red. */
export function QuizOption({ letter, text, status, disabled, onPress }: Props) {
  const s = STYLES[status];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      aria-label={`${letter}. ${text}${SUFFIX[status]}`}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-card p-5 text-left shadow-soft transition',
        disabled
          ? 'cursor-default'
          : 'hover:-translate-y-0.5 hover:border-rq-secondary/40 focus-visible:outline-2 focus-visible:outline-rq-secondary',
        s.card,
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-4">
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-pill text-sm font-semibold', s.well)}>
          {letter}
        </span>
        <span className={cn('text-lg leading-6', s.text)}>{text}</span>
      </span>
      {status === 'correct' ? <AppIcon name="check" size={22} className="text-rq-quiz-check" /> : null}
      {status === 'wrong' ? <AppIcon name="close" size={22} className="text-rq-error" /> : null}
    </button>
  );
}
