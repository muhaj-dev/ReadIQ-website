'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
  /** Title of the deadline awaiting confirmation; null hides the dialog. */
  title: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/** "Delete deadline?" confirmation (the mobile app's long-press Alert). */
export function DeleteDeadlineDialog({ title, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={title !== null} onOpenChange={(open) => (open ? undefined : onCancel())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete deadline</AlertDialogTitle>
          <AlertDialogDescription>Remove “{title ?? 'this deadline'}”? This can’t be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
