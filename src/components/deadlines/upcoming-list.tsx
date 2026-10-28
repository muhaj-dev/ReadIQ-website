'use client';

import { useState } from 'react';

import { DeleteDeadlineDialog } from '@/components/deadlines/delete-deadline-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { DeadlineMarkers } from '@/constants/theme';
import type { DeadlineUrgency } from '@/data/deadlines';
import { toUpcoming } from '@/lib/deadline-view';
import { cn } from '@/lib/utils';
import type { Deadline } from '@/types/deadline';

type Props = {
  deadlines: Deadline[];
  /** Toggle a deadline's reminder on/off (the bell). */
  onToggleReminder: (id: string) => void;
  /** Delete a deadline (after the student confirms). */
  onDelete: (id: string) => void;
};

// Mock: "Due today" red, "1 day left" orange, "3 days left" indigo.
const STATUS_TONE: Record<DeadlineUrgency, string> = {
  today: 'text-rq-error',
  soon: 'text-rq-due-soon',
  later: 'text-rq-primary',
};

const ICON_BTN = 'flex size-10 items-center justify-center rounded-pill transition';

/** "Upcoming" section: one card per deadline with its colour marker, a coloured
 *  countdown, a reminder bell toggle, and a delete action (with confirm). */
export function UpcomingList({ deadlines, onToggleReminder, onDelete }: Props) {
  const [pending, setPending] = useState<Deadline | null>(null);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-bold text-rq-on-surface">Upcoming</h2>

      <ul className="flex flex-col gap-3">
        {deadlines.map((deadline) => {
          const view = toUpcoming(deadline);
          const meta = [deadline.type, deadline.subject].filter(Boolean).join(' · ');
          return (
            <li
              key={deadline.id}
              className="flex items-center gap-3 rounded-inner bg-rq-surface-lowest py-4 pr-2 pl-4 shadow-soft"
            >
              <span
                aria-hidden
                className="h-10 w-1 shrink-0 rounded-pill"
                style={{ backgroundColor: DeadlineMarkers[deadline.colorIndex] ?? DeadlineMarkers[0] }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate text-sm font-semibold text-rq-on-surface">{view.title}</p>
                <p className="text-xs font-medium text-rq-on-surface-variant">{view.when}</p>
                {meta ? <p className="truncate text-xs text-rq-outline">{meta}</p> : null}
              </div>

              <span className={cn('shrink-0 text-right text-sm font-semibold', STATUS_TONE[view.urgency])}>
                {view.status}
              </span>

              <div className="flex shrink-0 items-center">
                <button
                  type="button"
                  aria-label={view.reminderOn ? `Turn reminder off for ${view.title}` : `Turn reminder on for ${view.title}`}
                  aria-pressed={view.reminderOn}
                  title={view.reminderOn ? `Reminder: ${deadline.reminderLabel}` : 'Reminder off'}
                  onClick={() => onToggleReminder(deadline.id)}
                  className={cn(
                    ICON_BTN,
                    view.reminderOn
                      ? 'bg-rq-primary/12 text-rq-primary hover:bg-rq-primary/20'
                      : 'text-rq-outline hover:bg-rq-surface-container',
                  )}
                >
                  <AppIcon name="notifications" size={20} filled={view.reminderOn} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${view.title}`}
                  onClick={() => setPending(deadline)}
                  className={cn(ICON_BTN, 'text-rq-outline hover:bg-rq-error/10 hover:text-rq-error')}
                >
                  <AppIcon name="delete" size={19} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <DeleteDeadlineDialog
        title={pending?.title ?? null}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) onDelete(pending.id);
          setPending(null);
        }}
      />
    </section>
  );
}
