import { Features } from '@/components/landing/features';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Pillars } from '@/components/landing/pillars';
import { Screenshots } from '@/components/landing/screenshots';
import { FinalCta, SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';
import { Trust } from '@/components/landing/trust';

/** Public landing page (server component; the theme toggle is the only client island). */
export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-rq-surface">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Pillars />
        <Features />
        <Screenshots />
        <Trust />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
