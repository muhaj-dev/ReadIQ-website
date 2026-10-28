import { ADD_WAYS } from '@/components/landing/landing-data';
import { Section } from '@/components/landing/section';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

const STEPS: { icon: AppIconName; title: string; body: string }[] = [
  { icon: 'add', title: 'Add your notes', body: 'Bring in what you study, any way you like. It is saved to your Memory.' },
  { icon: 'auto-awesome', title: 'Ask anything', body: 'readIQ finds the matching notes first, then answers only from them.' },
  { icon: 'quiz', title: 'Practise & improve', body: 'Quiz yourself on a subject and watch weak topics turn into mastered ones.' },
];

/** "How it works": three steps, then the four ways to add a note. */
export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How it works"
      title="Your notes in. Trustworthy answers out."
      intro="No general-knowledge guessing. If the answer isn't in something you saved, readIQ tells you so."
      className="bg-rq-surface-low"
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-pill bg-rq-surface-container text-rq-secondary">
                <AppIcon name={step.icon} size={22} />
              </span>
              <span className="font-heading text-sm font-bold text-rq-outline">Step {i + 1}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-rq-on-surface">{step.title}</h3>
            <p className="mt-1.5 text-[15px] leading-6 text-rq-on-surface-variant">{step.body}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-16 text-center text-xl font-bold text-rq-on-surface lg:text-2xl">Four ways to add a note</h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADD_WAYS.map((way) => (
          <div
            key={way.title}
            className="flex flex-col items-center rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest p-6 text-center"
          >
            <span className={cn('flex size-14 items-center justify-center rounded-pill', way.well, way.tint)}>
              <AppIcon name={way.icon} size={26} />
            </span>
            <p className="mt-4 font-heading text-base font-bold text-rq-on-surface">{way.title}</p>
            <p className="mt-1 text-sm leading-6 text-rq-on-surface-variant">{way.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
