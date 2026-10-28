'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  tags: string[];
  onAdd: (tag: string) => void;
  /** Optional: show a remove ✕ on each chip. */
  onRemove?: (tag: string) => void;
};

/** Edit Note's tag chips + the inline "＋ Add tag" affordance (see the mock). */
export function TagChipRow({ tags, onAdd, onRemove }: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const tag = draft.trim();
    if (tag) onAdd(tag);
    setDraft('');
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-pill bg-rq-primary-container/10 py-1.5 pr-2 pl-4 text-sm font-medium text-rq-primary-container dark:text-rq-primary"
        >
          {tag}
          {onRemove ? (
            <button
              type="button"
              aria-label={`Remove tag ${tag}`}
              onClick={() => onRemove(tag)}
              className="flex size-5 items-center justify-center rounded-pill opacity-60 transition hover:bg-rq-primary-container/15 hover:opacity-100"
            >
              <AppIcon name="close" size={13} />
            </button>
          ) : (
            <span className="w-2" />
          )}
        </span>
      ))}

      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
            if (e.key === 'Escape') {
              setDraft('');
              setAdding(false);
            }
          }}
          onBlur={submit}
          placeholder="New tag"
          className="h-8 min-w-26 rounded-pill border border-rq-secondary-container bg-rq-surface-lowest px-4 text-sm font-medium text-rq-on-surface outline-none placeholder:text-rq-outline-variant"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="ml-1 flex items-center gap-1 py-1.5 text-sm font-medium text-rq-primary-container transition hover:opacity-80 dark:text-rq-primary"
        >
          <AppIcon name="add" size={16} />
          Add tag
        </button>
      )}
    </div>
  );
}
