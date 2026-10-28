import { FEATURES } from '@/components/landing/landing-data';
import { Section } from '@/components/landing/section';
import { AppIcon } from '@/components/ui/app-icon';

/** Feature grid: grounded Ask, auto-quiz, deadlines, podcast, PDF reader, progress. */
export function Features() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title="Everything you need to revise, nothing you don't"
      intro="Every feature works from the notes you saved — so what you practise is what you'll be examined on."
      className="bg-rq-surface-low"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="flex gap-4 rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest p-6"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-inner bg-rq-surface-container text-rq-secondary">
              <AppIcon name={feature.icon} size={22} />
            </span>
            <div>
              <h3 className="text-base font-bold text-rq-on-surface">{feature.title}</h3>
              <p className="mt-1.5 text-[15px] leading-6 text-rq-on-surface-variant">{feature.body}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
