'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { QuizGate } from '@/components/quiz/quiz-gate';
import { QuizHeader } from '@/components/quiz/quiz-header';
import { QuizRunner } from '@/components/quiz/quiz-runner';
import { EmptyState, Page } from '@/components/shell/page';
import { groupBySubject, parseQuizCount } from '@/lib/quiz-sources';
import { useNotesStore } from '@/store/use-notes-store';
import { type AttemptInput, useQuizStore } from '@/store/use-quiz-store';

/** QUIZ — generates a grounded quiz from the subject's notes, then runs it one question per screen. */
export default function QuizActivePage() {
  const router = useRouter();
  const params = useSearchParams();
  const sourceId = params.get('sourceId') ?? undefined;
  const quizCount = parseQuizCount(params.get('count') ?? undefined);
  const isFresh = params.get('fresh') === '1';

  const notes = useNotesStore((s) => s.notes);
  const notesLoaded = useNotesStore((s) => s.loaded);
  const source = useMemo(() => groupBySubject(notes).find((s) => s.id === sourceId), [notes, sourceId]);

  const current = useQuizStore((s) => s.current);
  const status = useQuizStore((s) => s.status);
  const error = useQuizStore((s) => s.error);
  const generate = useQuizStore((s) => s.generate);
  const recordResult = useQuizStore((s) => s.recordResult);

  // Build (or replay the cached) quiz on open; generate() guards against duplicate work.
  useEffect(() => {
    if (source) generate(source, { count: quizCount, fresh: isFresh });
  }, [source, generate, quizCount, isFresh]);

  const exit = () => router.push('/quiz');

  const onFinish = async (attempt: AttemptInput) => {
    await recordResult(attempt);
    const query = new URLSearchParams({
      sourceId: attempt.sourceId,
      sourceLabel: attempt.sourceLabel,
      count: String(quizCount),
      correct: String(attempt.correct),
      total: String(attempt.total),
      topics: JSON.stringify(attempt.weakTopics),
    });
    router.replace(`/quiz/result?${query}`);
  };

  if (!notesLoaded) return null;

  if (!source) {
    return (
      <Page width="narrow">
        <QuizHeader onClose={exit} />
        <EmptyState
          icon="quiz"
          title="Subject not found"
          body="This subject has no saved notes any more. Pick another one to quiz yourself on."
          action={
            <Link href="/quiz" className="text-sm font-bold text-rq-primary hover:underline">
              Back to subjects
            </Link>
          }
        />
      </Page>
    );
  }

  // Only run a quiz that belongs to this subject (the store may still hold the last one).
  const ready = status === 'ready' && !!current && current.sourceId === source.id && current.questions.length > 0;

  return (
    <Page width="narrow" className="pb-6 lg:pb-16">
      <QuizHeader onClose={exit} />
      {ready ? (
        <QuizRunner key={current.createdAt} quiz={current} onFinish={onFinish} />
      ) : (
        <QuizGate
          status={status}
          error={error}
          sourceLabel={source.label}
          onRetry={() => generate(source, { count: quizCount, fresh: isFresh })}
          onExit={exit}
        />
      )}
    </Page>
  );
}
