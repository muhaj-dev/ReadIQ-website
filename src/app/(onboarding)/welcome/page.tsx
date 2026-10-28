'use client';

import { useRouter } from 'next/navigation';

import { AlreadyOnboarded } from '@/components/onboarding/already-onboarded';
import { OnboardButton } from '@/components/onboarding/onboard-button';
import { ProgressHeader } from '@/components/onboarding/progress-header';
import { ValuePropRow } from '@/components/onboarding/value-prop-row';
import { BrandLogo } from '@/components/shell/brand-logo';
import type { AppIconName } from '@/components/ui/app-icon';

const VALUE_PROPS: { icon: AppIconName; title: string; description: string }[] = [
  { icon: 'save', title: 'Remembers your notes', description: 'Everything you add is saved and organized.' },
  { icon: 'lightbulb', title: 'Answers from your notes', description: "I only answer from what you've saved." },
  { icon: 'psychology', title: 'Quizzes you', description: 'Practice, improve and ace your exams.' },
];

/** Onboarding 1/3 — the value promise. */
export default function WelcomePage() {
  const router = useRouter();

  return (
    <>
      <ProgressHeader step={1} />
      <AlreadyOnboarded />

      <div className="flex flex-1 flex-col px-5 lg:px-8">
        <h1 className="mb-2 font-heading text-[26px] leading-8 font-bold text-rq-on-surface">Welcome 👋</h1>
        <p className="text-base text-rq-on-surface-variant">Let&apos;s study smarter together.</p>

        <div className="flex flex-1 animate-in items-center justify-center py-8 duration-700 fade-in zoom-in-95">
          <BrandLogo variant="mark" width={118} priority />
        </div>

        <div className="flex flex-col gap-6 pb-8">
          {VALUE_PROPS.map((prop) => (
            <ValuePropRow key={prop.title} {...prop} />
          ))}
        </div>
      </div>

      <div className="border-t border-rq-outline-variant/30 px-5 pt-5 pb-5 lg:px-8 lg:pb-8">
        <OnboardButton className="w-full" onClick={() => router.push('/about')}>
          Get Started
        </OnboardButton>
      </div>
    </>
  );
}
