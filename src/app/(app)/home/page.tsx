'use client';

import { AchievementCard } from '@/components/home/achievement-card';
import { DeadlineList } from '@/components/home/deadline-list';
import { EmptyHint } from '@/components/home/empty-hint';
import { HomeHeader } from '@/components/home/home-header';
import { PracticeCard } from '@/components/home/practice-card';
import { SectionHeader } from '@/components/home/section-header';
import { StatCards } from '@/components/home/stat-cards';
import { WeakTopicChips } from '@/components/home/weak-topic-chips';
import { Page } from '@/components/shell/page';
import { useDashboard } from '@/hooks/use-dashboard';

// Keep the dashboard calm — preview the first few, send the rest to their own page.
const WEAK_PREVIEW = 3;

/** HOME — the dashboard, wired to the real user, notes, quiz and deadline stores.
 *  Phones: one column. Desktop: progress on the left, what's next on the right. */
export default function HomePage() {
  const { user, achievements, stats, deadlines, weakTopics } = useDashboard();
  const weakPreview = weakTopics.slice(0, WEAK_PREVIEW);

  return (
    <Page width="wide">
      <HomeHeader name={user.name} streakDays={user.streakDays} />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-10 lg:gap-8">
          <section className="flex flex-col gap-3">
            {/* Non-tappable on the dashboard — Achievements opens from Profile/Settings. */}
            <AchievementCard {...achievements} />
            <StatCards stats={stats} />
          </section>

          <section className="flex flex-col gap-3">
            <SectionHeader title="Practice" />
            <PracticeCard />
          </section>
        </div>

        <div className="flex flex-col gap-10 lg:gap-8">
          <section className="flex flex-col gap-3">
            <SectionHeader
              title="Upcoming Deadlines"
              action={deadlines.length > 0 ? 'View all' : undefined}
              href="/deadlines"
            />
            {deadlines.length > 0 ? (
              <DeadlineList deadlines={deadlines} />
            ) : (
              <EmptyHint
                icon="schedule"
                title="No deadlines yet"
                subtitle="Add your exam and assignment dates to see them counted down here."
                cta="Add a deadline"
                href="/deadlines/add"
              />
            )}
          </section>

          <section className="flex flex-col gap-3">
            <SectionHeader
              title="Weak Topics"
              action={weakTopics.length > WEAK_PREVIEW ? 'View all' : undefined}
              href="/weak-topics"
            />
            {weakTopics.length > 0 ? (
              <WeakTopicChips topics={weakPreview} />
            ) : (
              <EmptyHint
                icon="quiz"
                title="No weak topics yet"
                subtitle="Take a quiz and we'll surface the topics worth reviewing."
                cta="Start a quiz"
                href="/quiz"
              />
            )}
          </section>
        </div>
      </div>
    </Page>
  );
}
