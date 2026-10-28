import { DeadlineMarkers } from '@/constants/theme';
import { buildMonthCells, type CalendarCell } from '@/data/deadlines';
import { cn } from '@/lib/utils';
import type { Deadline } from '@/types/deadline';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_DOTS = 3;

type Props = {
  year: number;
  monthIndex: number;
  /** Today's date — circled when it falls in the shown month. */
  today: Date;
  deadlines: Deadline[];
};

/** Day-of-month → the marker colours of that day's deadlines (in the shown month). */
function markersByDay(deadlines: Deadline[], year: number, monthIndex: number): Map<number, string[]> {
  const map = new Map<number, string[]>();
  for (const d of deadlines) {
    const due = new Date(d.dueDate);
    if (due.getFullYear() !== year || due.getMonth() !== monthIndex) continue;
    const colour = DeadlineMarkers[d.colorIndex] ?? DeadlineMarkers[0];
    map.set(due.getDate(), [...(map.get(due.getDate()) ?? []), colour]);
  }
  return map;
}

/** Chunk the flat cell list into rows of 7. */
function toWeeks(cells: CalendarCell[]): CalendarCell[][] {
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Month calendar: weekday header + date grid with today circled and deadline
 *  days dotted in each deadline's marker colour. */
export function CalendarGrid({ year, monthIndex, today, deadlines }: Props) {
  const weeks = toWeeks(buildMonthCells(year, monthIndex));
  const markers = markersByDay(deadlines, year, monthIndex);
  const isThisMonth = today.getFullYear() === year && today.getMonth() === monthIndex;
  const monthName = new Date(year, monthIndex, 1).toLocaleString('en-US', { month: 'long' });

  return (
    <div className="flex flex-col gap-2" role="grid" aria-label={`${monthName} ${year}`}>
      <div className="grid grid-cols-7 pb-1" role="row">
        {WEEKDAYS.map((day) => (
          <span key={day} role="columnheader" className="text-center text-xs font-medium text-rq-on-surface-variant">
            {day.toUpperCase()}
          </span>
        ))}
      </div>

      {weeks.map((week, w) => (
        <div key={w} className="grid grid-cols-7" role="row">
          {week.map((cell, i) => {
            const isToday = isThisMonth && cell.inMonth && cell.day === today.getDate();
            const dots = cell.inMonth ? (markers.get(cell.day) ?? []) : [];
            const count = dots.length ? `, ${dots.length} deadline${dots.length > 1 ? 's' : ''}` : '';
            return (
              <div
                key={i}
                role="gridcell"
                aria-label={cell.inMonth ? `${monthName} ${cell.day}${count}${isToday ? ', today' : ''}` : undefined}
                aria-hidden={cell.inMonth ? undefined : true}
                className="relative flex h-11 items-center justify-center"
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-pill text-sm font-semibold',
                    isToday && 'bg-rq-secondary-container font-bold text-rq-on-primary',
                    !isToday && cell.inMonth && 'text-rq-on-surface',
                    !cell.inMonth && 'text-rq-on-surface-variant/30',
                    !isToday && dots.length > 0 && 'bg-rq-surface-container/70',
                  )}
                >
                  {cell.day}
                </span>
                {dots.length > 0 ? (
                  <span className="absolute bottom-0 flex gap-0.5" aria-hidden>
                    {dots.slice(0, MAX_DOTS).map((colour, j) => (
                      <span key={j} className="size-1.5 rounded-pill" style={{ backgroundColor: colour }} />
                    ))}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
