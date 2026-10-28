import { GroundedAnswerMock } from '@/components/landing/grounded-answer-mock';
import { CtaLink } from '@/components/landing/section';
import { AppIcon } from '@/components/ui/app-icon';

const PROOF = ['Free to use', 'No account needed', 'Notes stay in your browser'];

/** Landing hero: promise + CTAs on the left, the grounded-answer mock on the right. */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Soft indigo glow behind the mock — decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-rq-secondary-container/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-pill bg-rq-surface-container px-3 py-1.5 text-xs font-semibold text-rq-secondary">
            <AppIcon name="auto-awesome" size={14} />
            Your AI study partner
          </p>
          <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-extrabold tracking-tight text-rq-on-surface sm:text-5xl lg:text-6xl">
            The study partner that only answers from{' '}
            <span className="text-rq-secondary">your notes</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-rq-on-surface-variant lg:mx-0">
            Paste, upload, scan or record your class material. readIQ remembers it, answers your questions with a
            📌 tag naming the exact note, quizzes you, and keeps your deadlines calm.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <CtaLink href="/home" icon="chevron-right">
              Start studying free
            </CtaLink>
            <CtaLink href="#how-it-works" variant="secondary">
              See how it works
            </CtaLink>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-rq-on-surface-variant lg:justify-start">
            {PROOF.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <AppIcon name="check-circle" size={16} className="text-rq-quiz-check" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <GroundedAnswerMock />
        </div>
      </div>
    </section>
  );
}
