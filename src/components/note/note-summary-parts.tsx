'use client';

import { useState } from 'react';

import type { KeyTopic, NoteStat, TopicTone } from '@/data/note-detail';
import { cn } from '@/lib/utils';

/** Green subject pill + neutral meta pills under the Note Details title. */
export function SubjectBadges({ subject, badges }: { subject: string; badges: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-pill bg-rq-note-green-well px-3 py-1 text-xs font-medium text-rq-note-green">
        {subject}
      </span>
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-pill bg-rq-surface-container-high px-3 py-1 text-xs font-medium text-rq-on-surface-variant"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

/** AI Summary with a Show more / less toggle when extra text exists. */
export function AiSummary({ summary, more }: { summary: string; more: string }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = more.trim().length > 0;
  return (
    <section>
      <h2 className="mb-2 font-sans text-sm font-semibold text-rq-on-surface">AI Summary</h2>
      <p className="text-base leading-relaxed text-rq-on-surface-variant">{expanded ? `${summary} ${more}` : summary}</p>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((now) => !now)}
          className="mt-1 py-1 text-sm font-semibold text-rq-secondary hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      ) : null}
    </section>
  );
}

const TONES: Record<TopicTone, string> = {
  green: 'bg-rq-topic-green-bg text-rq-topic-green-ink border-rq-topic-green-border',
  red: 'bg-rq-topic-red-bg text-rq-topic-red-ink border-rq-topic-red-border',
  amber: 'bg-rq-topic-amber-bg text-rq-topic-amber-ink border-rq-topic-amber-border',
  blue: 'bg-rq-topic-blue-bg text-rq-topic-blue-ink border-rq-topic-blue-border',
};

/** Key Topics chip cloud (the note's tags). */
export function KeyTopics({ topics }: { topics: KeyTopic[] }) {
  return (
    <section>
      <h2 className="mb-3 font-sans text-sm font-semibold text-rq-on-surface">Key Topics</h2>
      {topics.length === 0 ? (
        <p className="text-sm text-rq-outline">No topics tagged yet — add tags when you edit this note.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <span key={topic.label} className={cn('rounded-inner border px-4 py-2 text-xs font-medium', TONES[topic.tone])}>
              {topic.label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/** The three stat cards (AI References · Words · Added). */
export function NoteStatsRow({ stats }: { stats: NoteStat[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center rounded-inner border border-rq-outline-variant bg-rq-surface-lowest p-4 shadow-soft"
        >
          {/* Numbers render display-size; date values ("May 21") stay small, per the mock. */}
          <span
            className={cn(
              'leading-8 text-rq-on-surface',
              /^\d+$/.test(stat.value) ? 'font-heading text-2xl font-semibold' : 'text-sm font-bold',
            )}
          >
            {stat.value}
          </span>
          <span className="text-center text-xs font-medium text-rq-on-surface-variant">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
