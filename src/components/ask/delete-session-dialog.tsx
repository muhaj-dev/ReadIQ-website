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
import type { ChatSession } from '@/types/chat';

type Props = {
  /** The chat awaiting confirmation, or null when closed. */
  session: ChatSession | null;
  onCancel: () => void;
  onConfirm: (id: string) => void;
};

/** "Delete this chat?" confirmation — your notes are never touched. */
export function DeleteSessionDialog({ session, onCancel, onConfirm }: Props) {
  return (
    <AlertDialog open={!!session} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="rounded-card bg-rq-surface-lowest">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-rq-on-surface">Delete this chat?</AlertDialogTitle>
          <AlertDialogDescription className="text-rq-on-surface-variant">
            “{session?.title}” will be removed from your history. Your saved notes stay exactly as they are.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => session && onConfirm(session.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
