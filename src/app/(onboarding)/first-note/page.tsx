'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { FirstNoteFields } from '@/components/onboarding/first-note-fields';
import { OnboardButton } from '@/components/onboarding/onboard-button';
import { ProgressHeader } from '@/components/onboarding/progress-header';
import { SavedNoteCard } from '@/components/onboarding/saved-note-card';
import { useNotesStore } from '@/store/use-notes-store';
import { useOnboardingStore } from '@/store/use-onboarding-store';

/** Onboarding 3/3 — the first note, saved to memory, then hands off to its details page. */
export default function FirstNotePage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const completeOnboarding = useOnboardingStore((s) => s.complete);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const hasNote = note.trim().length > 0;

  const finish = async () => {
    if (saving) return;
    // Reaching the end of onboarding means we never show it again.
    void completeOnboarding();
    if (!hasNote) {
      router.replace('/home');
      return;
    }
    setSaving(true);
    try {
      const saved = await addNote({ title: title.trim() || undefined, content: note.trim(), source: 'paste' });
      // Show the saved note's details; its back chevron falls through to Memory.
      router.replace(`/note/${saved.id}`);
    } catch {
      setSaving(false);
      toast.error("Couldn't save your note. Please try again.");
    }
  };

  const skip = () => {
    void completeOnboarding();
    router.replace('/home');
  };

  return (
    <>
      <ProgressHeader step={3} onBack={() => router.push('/about')} />

      <div className="animate-in px-5 pb-5 duration-500 fade-in slide-in-from-bottom-3 lg:px-8">
        <h1 className="mb-2 font-heading text-[26px] leading-8 font-bold text-rq-on-surface">Add your first note</h1>
        <p className="text-lg leading-7 text-rq-on-surface-variant">
          Give it a name and paste what you&apos;re studying. You can upload files, scan photos, and record classes
          from the app once you&apos;re in.
        </p>
      </div>

      <div className="flex flex-1 animate-in flex-col px-5 pt-2 duration-500 fade-in slide-in-from-bottom-3 lg:px-8">
        <FirstNoteFields title={title} onTitleChange={setTitle} note={note} onNoteChange={setNote} />
      </div>

      {hasNote ? (
        <div className="pt-4">
          <SavedNoteCard text={note} title={title} />
        </div>
      ) : null}

      <div className="px-5 pt-5 pb-2 lg:px-8 lg:pb-4">
        <OnboardButton tone="primary" className="w-full" disabled={!hasNote || saving} onClick={finish}>
          {saving ? 'Saving…' : 'Save to memory'}
        </OnboardButton>
        <button
          type="button"
          onClick={skip}
          className="flex w-full items-center justify-center py-4 text-sm font-semibold text-rq-on-surface-variant hover:text-rq-primary"
        >
          Skip for now
        </button>
      </div>
    </>
  );
}
