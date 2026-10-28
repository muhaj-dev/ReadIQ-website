'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { timeAgo } from '@/lib/relative-time';

import { CommentAvatar } from './comment-avatar';

type Props = {
  open: boolean;
  /** The passage the comment is anchored to. */
  quote: string;
  /** Existing body when editing; empty for a new comment. */
  initialBody: string;
  /** Editing an existing comment (shows Delete) vs. writing a new one. */
  editing: boolean;
  timestamp?: string | null;
  onSave: (body: string) => void;
  onDelete: () => void;
  onCancel: () => void;
};

/** Comment card for the readers: pinned passage + composer; existing ones edit or delete. */
export function CommentDialog({ open, quote, initialBody, editing, timestamp, onSave, onDelete, onCancel }: Props) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onCancel())}>
      <DialogContent showCloseButton={false} className="gap-0 rounded-[20px] p-0 sm:max-w-md">
        {/* Keyed so the composer resets each time a different comment opens. */}
        {open ? (
          <CommentBody
            key={`${quote}|${initialBody}|${editing}`}
            quote={quote}
            initialBody={initialBody}
            editing={editing}
            timestamp={timestamp}
            onSave={onSave}
            onDelete={onDelete}
            onCancel={onCancel}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CommentBody({ quote, initialBody, editing, timestamp, onSave, onDelete, onCancel }: Omit<Props, 'open'>) {
  const [body, setBody] = useState(initialBody);
  const canSave = body.trim().length > 0;
  const when = editing ? timeAgo(timestamp) || 'edited' : 'Now';

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-4">
        <CommentAvatar size={34} />
        <div className="min-w-0 flex-1">
          <DialogTitle className="text-sm font-semibold text-rq-on-surface">You</DialogTitle>
          <p className="text-xs font-medium text-rq-outline">{when}</p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          className="flex size-8 items-center justify-center rounded-pill text-rq-on-surface-variant hover:bg-rq-surface-low"
        >
          <AppIcon name="close" size={18} />
        </button>
      </div>

      {quote ? (
        <blockquote className="mx-4 mt-3 line-clamp-3 rounded-xl border-l-[3px] border-rq-secondary bg-rq-secondary-fixed/40 px-3 py-2.5 text-sm text-rq-on-surface-variant italic">
          {quote}
        </blockquote>
      ) : null}

      <form
        className="flex items-end gap-2 px-4 pt-3 pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSave) onSave(body);
        }}
      >
        <textarea
          autoFocus
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && canSave) {
              e.preventDefault();
              onSave(body);
            }
          }}
          rows={2}
          placeholder={editing ? 'Edit your comment…' : 'Add a comment…'}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-[14px] border border-rq-outline-variant/50 bg-rq-surface-low px-3 py-2.5 text-[15px] text-rq-on-surface outline-none placeholder:text-rq-outline focus:border-rq-secondary"
        />
        <button
          type="submit"
          aria-label="Save comment"
          disabled={!canSave}
          className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-secondary text-rq-on-primary transition disabled:bg-rq-outline-variant/40"
        >
          <AppIcon name="send" size={18} />
        </button>
      </form>

      {editing ? (
        <button
          type="button"
          onClick={onDelete}
          className="mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl bg-rq-error-container/50 py-2.5 text-[15px] font-semibold text-rq-error transition hover:bg-rq-error-container/70"
        >
          <AppIcon name="delete" size={16} />
          Delete comment
        </button>
      ) : null}
    </div>
  );
}
