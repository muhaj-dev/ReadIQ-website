'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { QuizCountSheet } from '@/components/quiz/quiz-count-sheet';
import { QuizIntro } from '@/components/quiz/quiz-intro';
import { QuizSourceCard } from '@/components/quiz/quiz-source-card';
import { EmptyState, Page, PageHeader } from '@/components/shell/page';
import { AppIcon } from '@/components/ui/app-icon';
import { DEFAULT_QUIZ_COUNT, groupBySubject } from '@/lib/quiz-sources';
import { useNotesStore } from '@/store/use-notes-store';
import type { QuizCount } from '@/types/quiz';

/** QUIZ HOME — pick a subject; quizzes are generated from your notes for it. */
export default function QuizHomePage() {
  const router = useRouter();
  const notes = useNotesStore((s) => s.notes);
  const loaded = useNotesStore((s) => s.loaded);
  const subjects = useMemo(() => groupBySubject(notes), [notes]);

  // The subject waiting on a question-count choice (null → picker hidden).
  const [pendingId, setPendingId] = useState<string | null>(null);

  const startWithCount = (count: QuizCount) => {
    const sourceId = pendingId;
    setPendingId(null);
    if (sourceId) {
      const params = new URLSearchParams({ sourceId, count: String(count) });
      router.push(`/quiz/active?${params}`);
    }
  };

  return (
    <Page width="wide">
      <PageHeader title="Quiz" back="/home" />

      <div className="flex flex-col gap-8">
        <QuizIntro
          title="Quiz yourself"
          subtitle="Pick a subject — we’ll build the questions from your notes for it."
        />

        {!loaded ? null : subjects.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((source) => (
              <QuizSourceCard key={source.id} source={source} onPress={() => setPendingId(source.id)} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="quiz"
            title="No notes to quiz yet"
            body="Add a note first, then we’ll turn your subjects into practice questions."
            action={
              <Link
                href="/add"
                className="flex h-11 items-center gap-2 rounded-btn bg-rq-fab px-5 text-sm font-bold text-rq-on-primary shadow-soft transition hover:opacity-90"
              >
                <AppIcon name="add" size={18} />
                Add a note
              </Link>
            }
          />
        )}
      </div>

      <QuizCountSheet
        visible={pendingId !== null}
        selected={DEFAULT_QUIZ_COUNT}
        onSelect={startWithCount}
        onCancel={() => setPendingId(null)}
      />
    </Page>
  );
}
