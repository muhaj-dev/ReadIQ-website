import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import type { MissedQuestion } from '@/types/quiz';

type Props = {
  /** Questions the student got wrong — empty means nothing to review. */
  missed: MissedQuestion[];
};

function optionText(missed: MissedQuestion, key: string): string {
  return missed.question.options.find((o) => o.key === key)?.text ?? '';
}

/** Post-quiz review: correct option + a short grounded "why" + the source note for each miss. */
export function ResultReview({ missed }: Props) {
  if (missed.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-bold tracking-wider text-rq-on-surface uppercase">Review your misses</h3>
      <ul className="grid gap-3 lg:grid-cols-2">
        {missed.map((item) => {
          const { question, selectedKey } = item;
          return (
            <li
              key={question.id}
              className="flex flex-col gap-3 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-4 shadow-soft"
            >
              <p className="text-[15px] leading-[21px] font-semibold text-rq-on-surface">{question.prompt}</p>

              <p className="flex items-start gap-2 text-sm font-medium text-rq-on-surface-variant">
                <AppIcon name="close" size={18} className="mt-px text-rq-error" />
                <span className="flex-1">You chose: {optionText(item, selectedKey) || '—'}</span>
              </p>

              <p className="flex items-start gap-2 text-sm font-medium text-rq-quiz-check">
                <AppIcon name="check-circle" size={18} className="mt-px" />
                <span className="flex-1">
                  {question.answerKey}. {optionText(item, question.answerKey)}
                </span>
              </p>

              {question.explanation ? (
                <p className="rounded-inner bg-rq-secondary/8 p-3 text-[13px] leading-[19px] text-rq-on-surface-variant">
                  <span className="text-rq-secondary">Why · </span>
                  {question.explanation}
                </p>
              ) : null}

              {question.sourceNoteId ? (
                <Link
                  href={`/note/${question.sourceNoteId}`}
                  className="flex items-center gap-1.5 self-start rounded-pill bg-rq-secondary/10 px-3 py-1.5 text-xs font-semibold text-rq-secondary transition hover:bg-rq-secondary/15"
                >
                  <AppIcon name="auto-awesome" size={14} filled />
                  <span className="max-w-60 truncate">From your notes · {question.sourceNoteTitle || 'Open note'}</span>
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
