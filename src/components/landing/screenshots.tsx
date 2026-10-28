import Image from 'next/image';

import { SHOTS } from '@/components/landing/landing-data';
import { Section } from '@/components/landing/section';
import { cn } from '@/lib/utils';

/** Screenshot showcase: wide app composites inside framed cards, lazy-loaded. */
export function Screenshots() {
  return (
    <Section
      id="screenshots"
      eyebrow="A look inside"
      title="Designed to lower exam anxiety"
      intro="One accent colour, lots of white space, and a confident light and dark mode for late-night revision."
    >
      <div className="grid items-start gap-6 lg:grid-cols-2">
        {SHOTS.map((shot) => (
          <figure
            key={shot.src}
            className={cn(
              'overflow-hidden rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest shadow-soft',
              shot.wide && 'lg:col-span-2',
            )}
          >
            <div className="bg-rq-surface-container p-3 sm:p-4">
              <Image
                src={shot.src}
                alt={`readIQ screens: ${shot.title}`}
                width={shot.width}
                height={shot.height}
                loading="lazy"
                sizes={shot.wide ? '(min-width: 1152px) 1120px, 100vw' : '(min-width: 1024px) 560px, 100vw'}
                className="h-auto w-full rounded-inner"
              />
            </div>
            <figcaption className="px-5 py-4">
              <p className="font-heading text-base font-bold text-rq-on-surface">{shot.title}</p>
              <p className="mt-0.5 text-sm text-rq-on-surface-variant">{shot.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
