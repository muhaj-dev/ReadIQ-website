import Link from 'next/link';
import type { ReactNode } from 'react';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Brand } from '@/constants/theme';
import { cn } from '@/lib/utils';

/** The brand blue → purple gradient (theme-independent brand art). */
export const BRAND_GRADIENT = `linear-gradient(135deg, ${Brand.gradientStart}, ${Brand.gradientEnd})`;

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A landing-page section: centred eyebrow + heading + intro, then content. */
export function Section({ id, eyebrow, title, intro, children, className }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-20 px-5 py-16 lg:py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.14em] text-rq-secondary uppercase">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-rq-on-surface lg:text-4xl">
            {title}
          </h2>
          {intro ? <p className="mt-3 text-base leading-7 text-rq-on-surface-variant lg:text-lg">{intro}</p> : null}
        </div>
        <div className="mt-10 lg:mt-14">{children}</div>
      </div>
    </section>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light';
  icon?: AppIconName;
  className?: string;
};

/** Large call-to-action link (44px+ touch target). */
export function CtaLink({ href, children, variant = 'primary', icon, className }: CtaProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-btn px-6 font-heading text-[15px] font-bold transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
        variant === 'primary' && 'bg-rq-fab text-rq-on-primary shadow-soft hover:opacity-90',
        variant === 'secondary' &&
          'border border-rq-outline-variant/60 bg-rq-surface-lowest text-rq-primary hover:bg-rq-surface-low',
        variant === 'light' && 'bg-rq-on-primary text-rq-profile-top shadow-soft hover:opacity-90',
        className,
      )}
    >
      {children}
      {icon ? <AppIcon name={icon} size={18} /> : null}
    </Link>
  );
}
