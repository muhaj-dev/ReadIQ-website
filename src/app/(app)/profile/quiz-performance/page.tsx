'use client';

import { EmptyHint } from '@/components/home/empty-hint';
import { SectionHeader } from '@/components/home/section-header';
import { WeakTopicChips } from '@/components/home/weak-topic-chips';
import { QuizAttemptRow } from '@/components/profile/quiz-attempt-row';
import { QuizPerfHero } from '@/components/profile/quiz-perf-hero';
import { Page, PageHeader } from '@/components/shell/page';
import { quizPerformance } from '@/lib/profile-stats';
import { summarizeWeakTopics } from '@/lib/quiz-stats';
import { useQuizStore } from '@/store/use-quiz-store';

/** How many recent attempts the list shows. */
const RECENT_LIMIT = 8;

/** QUIZ PERFORMANCE — average score, stats, recent attempts + weak topics. */
export default function QuizPerformancePage() {
  const results = useQuizStore((s) => s.results);
  const perf = quizPerformance(results);
  const weakTopics = summarizeWeakTopics(results);

  return (
    <Page width="wide">
      <PageHeader title="Quiz Performance" back="/profile" />

      {perf.averagePercent === null ? (
        <div className="mx-auto max-w-xl">
          <EmptyHint
            icon="quiz"
            title="No quizzes yet"
            subtitle="Take a quiz from your notes and your scores will appear here."
            cta="Start a quiz"
            href="/quiz"
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:items-start lg:gap-8">
          <div className="flex flex-col gap-6 lg:sticky lg:top-10">
            <QuizPerfHero
              averagePercent={perf.averagePercent}
              bestPercent={perf.bestPercent}
              quizzesTaken={perf.quizzesTaken}
              questionsAnswered={perf.questionsAnswered}
              encouragement={perf.encouragement}
            />
            {weakTopics.length > 0 ? (
              <section className="flex flex-col gap-3">
                <SectionHeader title="Weak Topics" />
                <WeakTopicChips topics={weakTopics} />
              </section>
            ) : null}
          </div>

          <section className="flex flex-col gap-3">
            <SectionHeader title="Recent Quizzes" />
            <ul className="flex flex-col gap-3">
              {results.slice(0, RECENT_LIMIT).map((r) => (
                <li key={r.id}>
                  <QuizAttemptRow result={r} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Page>
  );
}
