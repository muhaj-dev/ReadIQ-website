import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  /** Concept topics behind the questions the student got wrong. */
  topics: string[];
};

/** "Topics to review" — chips for missed topics, or a win line on a clean sweep. */
export function ResultTopics({ topics }: Props) {
  if (topics.length === 0) {
    return (
      <div className="flex items-center gap-2 px-1 text-rq-quiz-check">
        <AppIcon name="check-circle" size={20} />
        <p className="text-sm font-semibold">You aced it — nothing to review!</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-bold tracking-wider text-rq-on-surface uppercase">Topics to review</h3>
      <ul className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="flex items-center gap-1.5 rounded-pill border border-rq-topic-amber-border bg-rq-topic-amber-bg px-4 py-2 text-xs font-semibold text-rq-topic-amber-ink"
          >
            <AppIcon name="warning" size={14} />
            {topic}
          </li>
        ))}
      </ul>
    </section>
  );
}
