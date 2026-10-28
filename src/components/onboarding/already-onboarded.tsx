'use client';

import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import { useOnboardingStore } from '@/store/use-onboarding-store';
import { useUserStore } from '@/store/use-user-store';

/** Shown on Welcome when onboarding is already done: a way straight back into the app. */
export function AlreadyOnboarded() {
  const loaded = useOnboardingStore((s) => s.loaded);
  const completed = useOnboardingStore((s) => s.completed);
  const name = useUserStore((s) => s.profile.name);
  if (!loaded || !completed) return null;

  return (
    <div className="mx-5 mb-4 flex animate-in items-center gap-3 rounded-card border border-rq-outline-variant/30 bg-rq-surface-container p-4 fade-in lg:mx-8">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-lowest text-rq-secondary">
        <AppIcon name="check-circle" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-rq-on-surface">
          {name ? `Welcome back, ${name.split(' ')[0]}` : "You're already set up"}
        </p>
        <p className="text-xs text-rq-on-surface-variant">Your notes are waiting — or run through setup again.</p>
      </div>
      <Link
        href="/home"
        className="inline-flex h-10 shrink-0 items-center rounded-btn bg-rq-fab px-4 text-sm font-semibold text-rq-on-primary hover:opacity-90"
      >
        Go to app
      </Link>
    </div>
  );
}
