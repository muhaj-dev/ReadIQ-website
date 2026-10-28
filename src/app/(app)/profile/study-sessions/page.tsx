'use client';

import { EmptyHint } from '@/components/home/empty-hint';
import { StatCards } from '@/components/home/stat-cards';
import { SessionActivityRow } from '@/components/profile/session-activity-row';
import { Page, PageHeader } from '@/components/shell/page';
import type { DashboardStat } from '@/data/dashboard';
import { buildStudyActivity } from '@/lib/profile-stats';
import { useChatStore } from '@/store/use-chat-store';
import { useQuizStore } from '@/store/use-quiz-store';

/** STUDY SESSIONS — a newest-first timeline of Ask chats + finished quizzes. */
export default function StudySessionsPage() {
  const sessions = useChatStore((s) => s.sessions);
  const results = useQuizStore((s) => s.results);

  const activity = buildStudyActivity(sessions, results);
  const stats: DashboardStat[] = [
    { value: String(activity.length), label: 'Sessions', tone: 'primary' },
    { value: String(sessions.length), label: 'Ask Chats', tone: 'secondary' },
    { value: String(results.length), label: 'Quizzes', tone: 'deep' },
  ];

  return (
    <Page width="wide">
      <PageHeader title="Study Sessions" back="/profile" />

      {activity.length === 0 ? (
        <div className="mx-auto max-w-xl">
          <EmptyHint
            icon="history-edu"
            title="No study sessions yet"
            subtitle="Ask a question or take a quiz and your study activity will show up here."
            cta="Ask a question"
            href="/ask"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <StatCards stats={stats} className="lg:max-w-2xl" />
          <ul className="grid gap-3 lg:grid-cols-2">
            {activity.map((item) => (
              <li key={item.id}>
                <SessionActivityRow activity={item} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Page>
  );
}
