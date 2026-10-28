'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { fieldInputClass } from './form-field';

type Props = {
  open: boolean;
  /** The link under the cursor, if any (prefills the field + enables Remove). */
  initialUrl?: string;
  onSubmit: (url: string) => void;
  onRemove: () => void;
  onClose: () => void;
};

/** Add `https://` when the student typed a bare domain. */
function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return '';
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

/** Small dialog for adding / editing / removing a link in the rich editor. */
export function LinkDialog({ open, initialUrl, onSubmit, onRemove, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent className="sm:max-w-md">
        {/* Remount the form per open so the field resets to the current link. */}
        {open ? (
          <LinkForm initialUrl={initialUrl} onSubmit={onSubmit} onRemove={onRemove} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function LinkForm({ initialUrl, onSubmit, onRemove, onClose }: Omit<Props, 'open'>) {
  const [url, setUrl] = useState(initialUrl ?? '');

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation(); // portal events bubble to the outer note <form>
        const next = normalizeUrl(url);
        if (next) onSubmit(next);
      }}
    >
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-rq-on-surface">
          {initialUrl ? 'Edit link' : 'Add link'}
        </DialogTitle>
      </DialogHeader>
      <input
        autoFocus
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        aria-label="Link URL"
        inputMode="url"
        className={fieldInputClass}
      />
      <DialogFooter>
        {initialUrl ? (
          <Button type="button" variant="destructive" onClick={onRemove} className="h-10 px-4 sm:mr-auto">
            Remove link
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={onClose} className="h-10 px-4">
          Cancel
        </Button>
        <Button type="submit" disabled={!url.trim()} className="h-10 px-4">
          Save link
        </Button>
      </DialogFooter>
    </form>
  );
}
