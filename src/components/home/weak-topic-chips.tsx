import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import type { WeakTopic } from '@/data/dashboard';
import { cn } from '@/lib/utils';

/** Weak-topic chips: red warning chips for failing topics, neutral for shaky.
 *  Each chip opens the Quiz home so the student can practise it. */
export function WeakTopicChips({ topics, href = '/quiz' }: { topics: WeakTopic[]; href?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <Link
          key={topic.label}
          href={href}
          className={cn(
            'flex items-center gap-1 rounded-pill border px-4 py-2 text-xs font-semibold transition hover:opacity-80',
            topic.weak
              ? 'border-rq-error/10 bg-rq-error-container/40 text-rq-error'
              : 'border-rq-outline-variant/30 bg-rq-surface-container text-rq-on-surface-variant',
          )}
        >
          {topic.weak ? <AppIcon name="warning" size={14} /> : null}
          {topic.label}
        </Link>
      ))}
    </div>
  );
}
