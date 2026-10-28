import Link from 'next/link';

import { NAV_LINKS } from '@/components/landing/landing-data';
import { BRAND_GRADIENT, CtaLink } from '@/components/landing/section';
import { ThemedLogo } from '@/components/landing/themed-logo';

/** Final call to action on the brand gradient. */
export function FinalCta() {
  return (
    <section className="px-5 pb-16 lg:pb-24">
      <div
        className="mx-auto max-w-6xl rounded-[28px] px-6 py-14 text-center shadow-soft sm:px-12 lg:py-20"
        style={{ backgroundImage: BRAND_GRADIENT }}
      >
        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-rq-on-primary lg:text-4xl">
          Revise from what you actually wrote down.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-rq-on-primary/85">
          Add your first note in under a minute. No sign-up, no credit card — just you and your notes.
        </p>
        <CtaLink href="/home" variant="light" icon="chevron-right" className="mt-8">
          Start studying free
        </CtaLink>
      </div>
    </section>
  );
}

/** Footer: brand, section links, app entry. */
export function SiteFooter() {
  return (
    <footer className="border-t border-rq-outline-variant/30 px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <ThemedLogo width={84} />
          <p className="mt-2 text-sm text-rq-on-surface-variant">The study partner that only answers from your notes.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-rq-on-surface-variant hover:text-rq-primary">
              {link.label}
            </a>
          ))}
          <Link href="/home" className="font-semibold text-rq-secondary hover:text-rq-primary">
            Open the app
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-rq-outline">
        © readIQ. Notes stay in your browser; AI by Groq and Google Gemini.
      </p>
    </footer>
  );
}
