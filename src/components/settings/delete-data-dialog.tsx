'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { clearAllData } from '@/lib/db';
import { storage, STORAGE_KEYS } from '@/lib/storage';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Confirm, then wipe everything readIQ saved in this browser and restart at the landing page. */
export function DeleteDataDialog({ open, onOpenChange }: Props) {
  const [deleting, setDeleting] = useState(false);

  const deleteEverything = async () => {
    setDeleting(true);
    try {
      await clearAllData();
      await Promise.all(STORAGE_KEYS.map((key) => storage.removeItem(key)));
      // Full reload so every in-memory store starts empty again.
      window.location.replace('/');
    } catch {
      setDeleting(false);
      toast.error('Couldn’t delete your data. Please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !deleting && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete all my data?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently erases every note, file, chat, quiz result, deadline, and your profile
            from this browser. It can’t be undone — export your data first if you want a copy.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <Button
            onClick={deleteEverything}
            disabled={deleting}
            className="bg-rq-error text-rq-on-primary hover:bg-rq-error/90 dark:text-rq-surface"
          >
            {deleting ? 'Deleting…' : 'Delete everything'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
