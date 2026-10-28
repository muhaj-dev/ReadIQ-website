'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { QuizHeader } from '@/components/quiz/quiz-header';
import { QuizIntro } from '@/components/quiz/quiz-intro';
import { ResultActions } from '@/components/quiz/result-actions';
import { ResultReview } from '@/components/quiz/result-review';
import { ResultSummary } from '@/components/quiz/result-summary';
import { ResultTopics } from '@/components/quiz/result-topics';
import { SourceChip } from '@/components/quiz/source-chip';
import { Page } from '@/components/shell/page';
import { useQuizStore } from '@/store/use-quiz-store';

function parseTopics(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

/** QUIZ RESULT — score summary, weak topics, missed-question review, retry or go home. */
export default function QuizResultPage() {
  const router = useRouter();
  const params = useSearchParams();

  const correct = Number(params.get('correct') ?? 0) || 0;
  const total = Number(params.get('total') ?? 0) || 0;
  const sourceId = params.get('sourceId');
  const sourceLabel = params.get('sourceLabel');
  const topics = parseTopics(params.get('topics'));
  const review = useQuizStore((s) => s.review);
  // Only show the review when it belongs to the quiz we're showing results for.
  const missed = review && review.sourceLabel === sourceLabel ? review.missed : [];

  const home = () => router.push('/home');
  // A retry is a fresh attempt: same subject/length, new questions (fresh=1 regenerates).
  const retry = () => {
    if (!sourceId) return home();
    const query = new URLSearchParams({ sourceId, count: params.get('count') ?? '', fresh: '1' });
    router.replace(`/quiz/active?${query}`);
  };

  return (
    <Page width="default">
      <QuizHeader title="Results" onClose={home} />

      <div className="flex flex-col gap-7">
        <QuizIntro title="Quiz complete!" subtitle="Here’s how you did on your notes." />

        <div className="grid gap-7 lg:grid-cols-[320px_1fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <ResultSummary correct={correct} total={total} />
            {sourceLabel ? <SourceChip label={sourceLabel} /> : null}
          </div>
          <div className="flex flex-col gap-7">
            <ResultTopics topics={topics} />
            <ResultActions onRetry={retry} onHome={home} />
          </div>
        </div>

        <ResultReview missed={missed} />
      </div>
    </Page>
  );
}
