'use client';

import { useRef, useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

/** Subject-tag chips plus the "Add tag..." input row (see the scan-result mock). */
export function TagEditor({ tags, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState('');

  const submit = () => {
    const tag = draft.trim().replace(/^#\s*/, '');
    if (!tag) return;
    onAdd(tag);
    setDraft('');
  };

  return (
    <div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            title="Remove tag"
            onClick={() => onRemove(tag)}
            className="group flex items-center gap-1 rounded-pill bg-rq-surface-variant px-3 py-1 text-xs font-medium text-rq-on-surface-variant"
          >
            <AppIcon name="psychology" size={14} />
            # {tag}
            <AppIcon name="close" size={12} className="opacity-50 group-hover:opacity-100" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Add a tag"
          onClick={() => inputRef.current?.focus()}
          className="flex items-center justify-center rounded-pill bg-rq-surface-variant px-3 py-1 text-rq-on-surface-variant"
        >
          <AppIcon name="add" size={14} />
        </button>
      </div>
      {tags.length ? (
        <p className="mt-2 ml-1 text-xs text-rq-outline">The first tag becomes the note&apos;s subject.</p>
      ) : null}

      <form
        className="mt-4 flex items-center gap-2 rounded-inner border border-rq-outline-variant bg-rq-surface-lowest p-2 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <AppIcon name="tag" size={22} className="mx-2 shrink-0 text-rq-on-surface-variant" />
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add tag..."
          aria-label="New tag"
          className="h-10 min-w-0 flex-1 bg-transparent text-base text-rq-on-surface outline-none placeholder:text-rq-on-surface-variant/50"
        />
        <button
          type="submit"
          aria-label="Add tag"
          className="flex size-10 shrink-0 items-center justify-center rounded-btn bg-rq-primary-container text-rq-on-primary"
        >
          <AppIcon name="add" size={22} />
        </button>
      </form>
    </div>
  );
}
