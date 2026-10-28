'use client';

import { AchievementRow } from '@/components/achievements/achievement-row';
import { AchievementSummary } from '@/components/achievements/achievement-summary';
import { Page, PageHeader } from '@/components/shell/page';
import { useAchievements } from '@/hooks/use-achievements';
import { encourageAchievements } from '@/lib/achievements';

/** ACHIEVEMENTS — all 12 badges with their earned / locked state. */
export default function AchievementsPage() {
  const { list, unlockedCount, total } = useAchievements();

  return (
    <Page width="default">
      <PageHeader title="Achievements" back="/profile" />

      <div className="flex flex-col gap-5">
        <AchievementSummary
          unlockedCount={unlockedCount}
          total={total}
          encouragement={encourageAchievements(unlockedCount, total)}
        />
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((achievement) => (
            <li key={achievement.id}>
              <AchievementRow achievement={achievement} />
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}
