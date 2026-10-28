'use client';

import { type FormEvent, type ReactNode, useState } from 'react';

import { GlassCard } from '@/components/profile/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import type { ProfileForm } from '@/hooks/use-profile';
import { cn } from '@/lib/utils';
import { isEmail } from '@/lib/validation';
import type { ProfileInput } from '@/types/user';

type Props = {
  initial: ProfileForm;
  onSave: (fields: ProfileInput) => Promise<void>;
  onCancel: () => void;
};

const INPUT =
  'h-12 w-full rounded-inner border bg-rq-surface-lowest px-4 text-base text-rq-on-surface outline-none placeholder:text-rq-outline focus:ring-2 focus:ring-rq-on-primary-soft';

/** Inline "Edit profile" form on the indigo panel — name / email / course / goal, then Save. */
export function ProfileEditForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial.name);
  const [email, setEmail] = useState(initial.email);
  const [studyingFor, setStudyingFor] = useState(initial.studyingFor);
  const [goal, setGoal] = useState(initial.goal);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const nameBad = !name.trim();
    // Email is optional, but if given it must look like one.
    const emailBad = email.trim() !== '' && !isEmail(email);
    setNameError(nameBad);
    setEmailError(emailBad);
    if (nameBad || emailBad) return;
    setSaving(true);
    await onSave({ name, email, studyingFor, goal });
    onCancel();
  };

  return (
    <GlassCard className="animate-in rounded-card p-5 fade-in-0 slide-in-from-top-2">
      <form onSubmit={save} className="flex flex-col gap-4" noValidate>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-rq-on-primary">Edit profile</h2>
          <button
            type="button"
            aria-label="Close edit profile"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-pill bg-rq-on-primary/12 text-rq-on-primary hover:bg-rq-on-primary/20"
          >
            <AppIcon name="close" size={16} />
          </button>
        </div>

        <Field label="Name" error={nameError ? 'Please enter your name.' : undefined}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={nameError}
            className={cn(INPUT, nameError ? 'border-rq-error' : 'border-transparent')}
          />
        </Field>
        <Field label="Email" error={emailError ? 'That doesn’t look like an email.' : undefined}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@university.edu"
            autoComplete="email"
            aria-invalid={emailError}
            className={cn(INPUT, emailError ? 'border-rq-error' : 'border-transparent')}
          />
        </Field>
        <Field label="Studying for">
          <input
            value={studyingFor}
            onChange={(e) => setStudyingFor(e.target.value)}
            placeholder="e.g. Computer Science"
            className={cn(INPUT, 'border-transparent')}
          />
        </Field>
        <Field label="Goal">
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Pass my finals"
            className={cn(INPUT, 'border-transparent')}
          />
        </Field>

        <button
          type="submit"
          disabled={saving}
          className="mt-1 flex h-12 items-center justify-center gap-2 rounded-inner bg-rq-on-primary text-[15px] font-semibold text-rq-profile-top transition hover:opacity-90 disabled:opacity-70"
        >
          <AppIcon name="check-circle" size={18} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </GlassCard>
  );
}

/** Small soft label above each field, plus an optional inline error. */
function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-[0.02em] text-rq-on-primary-soft">{label}</span>
      {children}
      {/* The indigo panel is the same in both themes, so the error reads in white + icon. */}
      {error ? (
        <span className="flex items-center gap-1 text-xs font-semibold text-rq-on-primary">
          <AppIcon name="warning" size={13} />
          {error}
        </span>
      ) : null}
    </label>
  );
}
