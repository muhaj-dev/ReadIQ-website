'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AddFab } from '@/components/deadlines/add-fab';
import { CalendarGrid } from '@/components/deadlines/calendar-grid';
import { MonthSwitcher } from '@/components/deadlines/month-switcher';
import { UpcomingList } from '@/components/deadlines/upcoming-list';
import { EmptyState, Page, PageHeader } from '@/components/shell/page';
import { AppIcon } from '@/components/ui/app-icon';
import { useDeadlinesStore } from '@/store/use-deadlines-store';

const ADD_CLASSES =
  'flex h-11 items-center gap-2 rounded-btn bg-rq-fab px-5 text-sm font-bold text-rq-on-primary shadow-soft transition hover:opacity-90';

/** DEADLINES — month calendar (deadline days dotted, any month) + upcoming list. */
export default function DeadlinesPage() {
  const deadlines = useDeadlinesStore((s) => s.deadlines);
  const loaded = useDeadlinesStore((s) => s.loaded);
  const toggleReminder = useDeadlinesStore((s) => s.toggleReminder);
  const removeDeadline = useDeadlinesStore((s) => s.removeDeadline);

  const [today] = useState(() => new Date());
  // The month on screen, as a first-of-month date.
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const shift = (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  const isCurrent = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const label = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Page width="wide">
      <PageHeader
        title="Deadlines"
        back="/home"
        actions={
          <Link href="/deadlines/add" className={`${ADD_CLASSES} hidden lg:flex`}>
            <AppIcon name="add" size={18} />
            Add deadline
          </Link>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start lg:gap-8">
        <section
          aria-label="Calendar"
          className="flex flex-col gap-4 lg:sticky lg:top-10 lg:rounded-card lg:bg-rq-surface-lowest lg:p-5 lg:shadow-soft"
        >
          <MonthSwitcher
            label={label}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            onToday={isCurrent ? undefined : () => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
          />
          <CalendarGrid year={month.getFullYear()} monthIndex={month.getMonth()} today={today} deadlines={deadlines} />
        </section>

        {!loaded ? null : deadlines.length > 0 ? (
          <UpcomingList deadlines={deadlines} onToggleReminder={toggleReminder} onDelete={removeDeadline} />
        ) : (
          <EmptyState
            icon="schedule"
            title="No deadlines saved"
            body="Add your first exam date — we’ll count it down here."
            action={
              <Link href="/deadlines/add" className={ADD_CLASSES}>
                <AppIcon name="add" size={18} />
                Add your first deadline
              </Link>
            }
          />
        )}
      </div>

      <AddFab />
    </Page>
  );
}
