'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  value: string;
  onChange: (text: string) => void;
  /** Section heading — "Extracted Text" or "Transcript". */
  heading?: string;
  /** Muted hint shown when there's no text yet. */
  placeholder?: string;
};

/** "Extracted Text" section: heading + Edit toggle + the text card (textarea while editing). */
export function ExtractedTextCard({ value, onChange, heading = 'Extracted Text', placeholder }: Props) {
  // Nothing read → open straight in edit mode so the student can type.
  const [editing, setEditing] = useState(!value.trim());

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-rq-primary">{heading}</h2>
        <button
          type="button"
          onClick={() => setEditing((now) => !now)}
          className="flex h-11 items-center gap-1 px-1 text-sm font-semibold text-rq-secondary transition hover:opacity-80"
        >
          {editing ? 'Done' : 'Edit'}
          <AppIcon name={editing ? 'check-circle' : 'edit'} size={16} />
        </button>
      </div>

      <div
        className={cn(
          'rounded-inner border bg-rq-surface-lowest p-5 shadow-soft',
          editing ? 'border-rq-secondary-container' : 'border-rq-outline-variant',
        )}
      >
        {editing ? (
          <textarea
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={heading}
            className="min-h-64 w-full resize-y bg-transparent text-base leading-relaxed text-rq-on-surface outline-none placeholder:text-rq-outline-variant"
          />
        ) : value ? (
          <p className="max-h-[60vh] overflow-y-auto text-base leading-relaxed whitespace-pre-wrap text-rq-on-surface">
            {value}
          </p>
        ) : (
          <p className="text-base text-rq-outline-variant">{placeholder}</p>
        )}
      </div>
    </section>
  );
}
