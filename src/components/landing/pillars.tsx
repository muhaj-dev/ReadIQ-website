import { PILLARS } from '@/components/landing/landing-data';
import { BRAND_GRADIENT, Section } from '@/components/landing/section';
import { AppIcon } from '@/components/ui/app-icon';

/** The four product pillars: Memory · Attention · Action · Learning. */
export function Pillars() {
  return (
    <Section
      eyebrow="Built on four pillars"
      title="A calm study partner, not another tab of stress"
      intro="Everything in readIQ answers one question instantly: what do I do next?"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => (
          <article
            key={pillar.name}
            className="rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest p-6 shadow-soft"
          >
            <span
              className="flex size-12 items-center justify-center rounded-inner text-rq-on-primary"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              <AppIcon name={pillar.icon} size={24} />
            </span>
            <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-rq-secondary uppercase">{pillar.name}</p>
            <h3 className="mt-1 text-lg font-bold text-rq-on-surface">{pillar.title}</h3>
            <p className="mt-2 text-[15px] leading-6 text-rq-on-surface-variant">{pillar.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
