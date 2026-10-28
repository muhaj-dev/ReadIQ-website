'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDateLabel, toDateValue } from '@/lib/deadline-view';

type Props = {
  /** Local "YYYY-MM-DD". */
  dateValue: string;
  /** 24h "HH:MM". */
  timeValue: string;
  onDateChange: (ymd: string) => void;
  onTimeChange: (hhmm: string) => void;
};

const BOX =
  'flex h-12 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg bg-rq-surface-lowest px-4 text-base text-rq-on-surface shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition focus-within:outline-2 focus-within:outline-rq-secondary-container hover:bg-rq-surface-low';

function parseYmd(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Due Date row: a date box that opens a calendar popover + a native time input. */
export function DateTimeRow({ dateValue, timeValue, onDateChange, onTimeChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = parseYmd(dateValue);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="flex gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={BOX} aria-label={`Due date: ${formatDateLabel(dateValue)}`}>
          <span className="truncate">{formatDateLabel(dateValue)}</span>
          <AppIcon name="calendar-month" size={20} className="text-rq-outline" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            disabled={{ before: today }}
            onSelect={(date) => {
              if (!date) return;
              onDateChange(toDateValue(date));
              setOpen(false);
            }}
            className="[--cell-size:--spacing(9)]"
          />
        </PopoverContent>
      </Popover>

      <label className={BOX}>
        <span className="sr-only">Due time</span>
        <input
          type="time"
          value={timeValue}
          onChange={(e) => {
            if (e.target.value) onTimeChange(e.target.value);
          }}
          onClick={(e) => {
            try {
              e.currentTarget.showPicker();
            } catch {
              // Unsupported or not allowed — typing still works.
            }
          }}
          className="min-w-0 flex-1 bg-transparent outline-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
        <AppIcon name="schedule" size={20} className="text-rq-outline" />
      </label>
    </div>
  );
}
