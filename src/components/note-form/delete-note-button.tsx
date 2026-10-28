'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

/** Edit Note's red "Delete Note" button, with a confirm dialog. */
export function DeleteNoteButton({ onConfirm }: { onConfirm: () => void | Promise<void> }) {
  const [busy, setBusy] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className="w-full rounded-inner bg-rq-surface-lowest py-3.5 text-base font-semibold text-rq-error shadow-soft ring-1 ring-rq-outline-variant/30 transition hover:bg-rq-error-container/40"
          />
        }
      >
        Delete Note
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-rq-on-surface">Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            It will be removed from your Memory, and the app won&apos;t answer from it anymore. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-10 px-4">Keep note</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={busy}
            className="h-10 px-4"
            onClick={async () => {
              setBusy(true);
              try {
                await onConfirm();
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
