'use client';

import { EmptyHint } from '@/components/home/empty-hint';
import { WeakTopicChips } from '@/components/home/weak-topic-chips';
import { Page, PageHeader } from '@/components/shell/page';
import { summarizeWeakTopics } from '@/lib/quiz-stats';
import { useQuizStore } from '@/store/use-quiz-store';

/** All weak topics from recent quizzes — the "View all" target from the dashboard. */
export default function WeakTopicsPage() {
  const results = useQuizStore((s) => s.results);
  const topics = summarizeWeakTopics(results, Infinity);
  const failing = topics.filter((t) => t.weak).length;

  return (
    <Page width="narrow">
      <PageHeader title="Weak Topics" back="/home" />

      {topics.length > 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-[13px] leading-5 text-rq-on-surface-variant lg:text-sm">
            {failing > 0
              ? `${failing} ${failing === 1 ? 'topic' : 'topics'} to review from your latest quiz, plus earlier ones worth another look.`
              : 'Topics from your recent quizzes worth another look.'}
          </p>
          <WeakTopicChips topics={topics} />
        </div>
      ) : (
        <EmptyHint
          icon="quiz"
          title="No weak topics yet"
          subtitle="Take a quiz and we'll surface the topics worth reviewing here."
          cta="Start a quiz"
          href="/quiz"
        />
      )}
    </Page>
  );
}
