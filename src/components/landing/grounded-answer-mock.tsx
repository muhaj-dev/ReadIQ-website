import { BrandLogo } from '@/components/shell/brand-logo';
import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

/** HTML/CSS mock of the Ask screen: a question, a grounded answer, and the
 *  signature "📌 From your notes" tag — then the honest fallback. Decorative. */
export function GroundedAnswerMock({ className }: { className?: string }) {
  return (
    <div
      aria-label="Example: readIQ answering a question from a saved note"
      role="img"
      className={cn(
        'w-full max-w-md rounded-[28px] border border-rq-outline-variant/40 bg-rq-surface-lowest p-4 shadow-soft sm:p-5',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-rq-outline-variant/30 pb-3">
        <BrandLogo variant="mark" width={28} />
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-rq-on-surface">Ask AI</p>
          <p className="text-xs text-rq-on-surface-variant">Answers only from your notes</p>
        </div>
        <span className="rounded-pill bg-rq-quiz-correct-bg px-2.5 py-1 text-[11px] font-semibold text-rq-quiz-correct-ink">
          3 notes in memory
        </span>
      </div>

      <div className="mt-4 flex justify-end">
        <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-rq-secondary-container px-4 py-2.5 text-sm leading-6 text-rq-on-primary">
          What happens in the Calvin cycle?
        </p>
      </div>

      <div className="mt-3 max-w-[92%] rounded-[18px] rounded-bl-md border border-rq-outline-variant/40 bg-rq-surface-low px-4 py-3 text-sm leading-6 text-rq-on-surface">
        <p>
          The Calvin cycle happens in the <strong className="font-semibold">stroma</strong>. It uses the ATP and NADPH
          made by the light-dependent reactions to fix CO₂ into glucose.
        </p>
      </div>

      <span className="mt-2 inline-flex items-center gap-1.5 rounded-pill bg-rq-surface-container px-3 py-1.5 text-xs font-semibold text-rq-secondary">
        <span aria-hidden>📌</span>
        From your notes
        <span className="text-rq-on-surface-variant">·</span>
        <span className="text-rq-primary">Photosynthesis Notes</span>
      </span>

      <div className="mt-4 flex justify-end">
        <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-rq-secondary-container px-4 py-2.5 text-sm leading-6 text-rq-on-primary">
          Who won the 1998 World Cup?
        </p>
      </div>
      <div className="mt-3 flex max-w-[92%] items-start gap-2 rounded-[18px] rounded-bl-md border border-dashed border-rq-outline-variant/70 px-4 py-3 text-sm leading-6 text-rq-on-surface-variant">
        <AppIcon name="shield" size={16} className="mt-1 text-rq-secondary" />
        <p>I don&apos;t have that in your notes yet — add a note and I&apos;ll answer from it.</p>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-pill border border-rq-outline-variant/50 bg-rq-surface-lowest py-1.5 pr-1.5 pl-4">
        <span className="flex-1 text-sm text-rq-outline">Ask a follow up…</span>
        <span className="flex size-9 items-center justify-center rounded-pill bg-rq-primary-container text-rq-on-primary">
          <AppIcon name="send" size={16} />
        </span>
      </div>
    </div>
  );
}
