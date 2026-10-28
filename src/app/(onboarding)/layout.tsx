import Link from 'next/link';

import { ThemedLogo } from '@/components/landing/themed-logo';

/** Onboarding frame: full-screen on phones; a centred, card-like column on desktop. */
export default function OnboardingLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="min-h-dvh bg-rq-surface lg:flex lg:flex-col lg:items-center lg:justify-center lg:bg-rq-surface-low lg:px-6 lg:py-10">
      <Link href="/" aria-label="readIQ home" className="mb-6 hidden lg:block">
        <ThemedLogo width={96} />
      </Link>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-rq-surface lg:min-h-[720px] lg:overflow-hidden lg:rounded-[28px] lg:border lg:border-rq-outline-variant/30 lg:shadow-soft">
        {children}
      </div>
    </div>
  );
}
