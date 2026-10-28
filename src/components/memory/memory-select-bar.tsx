'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

type Props = {
  /** How many notes are ticked — drives the label and the disabled state. */
  count: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onShare: () => void;
  /** Called after the student confirms the delete dialog. */
  onDelete: () => Promise<void>;
};

/** Floating select-mode bar: live count + Select all / Share / Delete (with a confirm dialog).
 *  Sits above the mobile tab bar; centred in the content column on desktop. */
export function MemorySelectBar({ count, allSelected, onSelectAll, onShare, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const disabled = count === 0;

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 bottom-20 z-30 flex justify-center px-5 lg:bottom-8 lg:left-64">
        <div className="flex w-full max-w-md items-center gap-2 rounded-pill border border-rq-outline-variant/30 bg-rq-surface-lowest p-2 pl-5 shadow-soft">
          <span className="flex-1 text-sm font-semibold text-rq-on-surface-variant">
            {count === 0 ? 'Select notes' : `${count} selected`}
          </span>
          <Button variant="ghost" onClick={onSelectAll} className="h-10 rounded-pill px-3 text-rq-primary">
            {allSelected ? 'Clear' : 'Select all'}
          </Button>
          <button
            type="button"
            aria-label="Share selected notes"
            disabled={disabled}
            onClick={onShare}
            className="flex size-11 items-center justify-center rounded-pill bg-rq-primary/10 text-rq-primary transition hover:bg-rq-primary/15 disabled:opacity-40"
          >
            <AppIcon name="ios-share" size={20} />
          </button>
          <button
            type="button"
            aria-label="Delete selected notes"
            disabled={disabled}
            onClick={() => setConfirming(true)}
            className="flex size-11 items-center justify-center rounded-pill bg-rq-error/10 text-rq-error transition hover:bg-rq-error/15 disabled:opacity-40"
          >
            <AppIcon name="delete" size={20} />
          </button>
        </div>
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{count === 1 ? 'Delete note?' : `Delete ${count} notes?`}</AlertDialogTitle>
            <AlertDialogDescription>
              This removes them from your memory and can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-rq-error text-rq-on-primary hover:bg-rq-error/90 dark:text-rq-surface"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
