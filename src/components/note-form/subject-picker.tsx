'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useSubjectsStore } from '@/store/use-subjects-store';

type Props = {
  value: string;
  onChange: (subject: string) => void;
};

/** Subject select row (green dot + chevron) opening a list with "Add subject or course". */
export function SubjectPicker({ value, onChange }: Props) {
  const subjects = useSubjectsStore((s) => s.subjects);
  const addSubject = useSubjectsStore((s) => s.addSubject);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const pick = (subject: string) => {
    onChange(subject);
    setOpen(false);
  };

  const create = async () => {
    const name = await addSubject(draft);
    setDraft('');
    if (name) pick(name);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-12 w-full items-center gap-3 rounded-inner border border-rq-outline-variant/60 bg-rq-surface-lowest px-4 text-left text-base text-rq-on-surface transition hover:bg-rq-surface-low"
          />
        }
      >
        <span className="size-2.5 shrink-0 rounded-pill bg-rq-note-green" />
        <span className="flex-1 truncate">{value || 'Choose a subject'}</span>
        <AppIcon name="expand-more" size={20} className="text-rq-on-surface-variant" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-(--anchor-width) min-w-64 gap-1 p-1.5">
        <div className="max-h-64 overflow-y-auto">
          {subjects.map((subject) => {
            const selected = subject === value;
            return (
              <button
                key={subject}
                type="button"
                onClick={() => pick(subject)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition hover:bg-rq-surface-low',
                  selected ? 'font-semibold text-rq-secondary' : 'text-rq-on-surface',
                )}
              >
                {subject}
                {selected ? <AppIcon name="check" size={16} /> : null}
              </button>
            );
          })}
        </div>

        <form
          className="mt-1 flex items-center gap-2 border-t border-rq-outline-variant/40 px-1 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation(); // portal events bubble to the outer note <form>
            void create();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add subject or course"
            aria-label="New subject or course"
            className="h-9 min-w-0 flex-1 rounded-md bg-rq-surface-low px-3 text-sm text-rq-on-surface outline-none placeholder:text-rq-outline"
          />
          <button
            type="submit"
            aria-label="Add subject"
            disabled={!draft.trim()}
            className="flex size-9 items-center justify-center rounded-md bg-rq-primary-container text-rq-on-primary transition disabled:opacity-40"
          >
            <AppIcon name="add" size={18} />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
