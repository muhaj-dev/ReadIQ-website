'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

import { LabeledInput } from '@/components/onboarding/labeled-input';
import { OnboardButton } from '@/components/onboarding/onboard-button';
import { ProgressHeader } from '@/components/onboarding/progress-header';
import { AppIcon } from '@/components/ui/app-icon';
import { isEmail } from '@/lib/validation';
import { useUserStore } from '@/store/use-user-store';

type FieldKey = 'name' | 'email' | 'studying' | 'goal';

type Field = {
  key: FieldKey;
  label: string;
  placeholder: string;
  required: boolean;
  type?: 'text' | 'email';
  autoComplete?: string;
};

const FIELDS: Field[] = [
  { key: 'name', label: 'Your name', placeholder: 'e.g. David Johnson', required: true, autoComplete: 'name' },
  { key: 'email', label: 'Email', placeholder: 'e.g. you@university.edu', required: true, type: 'email', autoComplete: 'email' },
  { key: 'studying', label: 'What are you studying?', placeholder: 'e.g. Computer Science', required: true },
  { key: 'goal', label: 'Your goal', placeholder: 'e.g. Pass my finals', required: false },
];

/** Onboarding 2/3 — name, email, course, and goal, saved to the user store. */
export default function AboutPage() {
  const router = useRouter();
  const setProfile = useUserStore((s) => s.setProfile);
  const [form, setForm] = useState<Record<FieldKey, string>>({ name: '', email: '', studying: '', goal: '' });

  // Name, a valid email, and course required — we greet by name and personalize around the course.
  const canContinue = form.name.trim().length > 0 && isEmail(form.email) && form.studying.trim().length > 0;
  const emailError =
    form.email.trim().length > 0 && !isEmail(form.email) ? 'Enter a valid email, like you@university.edu' : undefined;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canContinue) return;
    void setProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      studyingFor: form.studying.trim(),
      goal: form.goal.trim(),
    });
    router.push('/first-note');
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
      <ProgressHeader step={2} />

      <div className="px-5 pb-4 lg:px-8">
        <h1 className="mb-2 font-heading text-[26px] leading-8 font-bold text-rq-on-surface">Tell us about you</h1>
        <p className="text-base text-rq-on-surface-variant">We&apos;ll personalize your experience.</p>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-5 py-6 lg:px-8">
        {FIELDS.map((field) => (
          <LabeledInput
            key={field.key}
            id={`about-${field.key}`}
            label={field.label}
            placeholder={field.placeholder}
            value={form[field.key]}
            required={field.required}
            type={field.type}
            autoComplete={field.autoComplete}
            error={field.key === 'email' ? emailError : undefined}
            onChange={(text) => setForm((prev) => ({ ...prev, [field.key]: text }))}
          />
        ))}

        <div className="mt-auto flex items-center justify-center gap-2 pt-4 text-rq-on-surface-variant">
          <AppIcon name="lock" size={16} />
          <p className="text-center text-xs font-medium">
            Saved only on your device.
            <br />
            We respect your privacy.
          </p>
        </div>
      </div>

      {/* Footer actions — 16px gap keeps Back and Continue clearly apart. */}
      <div className="flex gap-4 px-5 pt-4 pb-5 lg:px-8 lg:pb-8">
        <OnboardButton variant="outline" className="flex-1" onClick={() => router.push('/welcome')}>
          Back
        </OnboardButton>
        <OnboardButton type="submit" disabled={!canContinue} className="flex-[2]">
          Continue
        </OnboardButton>
      </div>
    </form>
  );
}
