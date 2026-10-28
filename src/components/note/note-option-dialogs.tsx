'use client';

import { useEffect, useState } from 'react';

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
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useSubjectsStore } from '@/store/use-subjects-store';

import type { ExportFormat } from './use-note-option-actions';

type DialogProps = { open: boolean; onClose: () => void };

const FORMATS: { key: ExportFormat; icon: AppIconName; title: string; sub: string }[] = [
  { key: 'pdf', icon: 'picture-as-pdf', title: 'PDF', sub: 'Opens the print dialog — choose “Save as PDF”' },
  { key: 'txt', icon: 'description', title: 'Plain text', sub: 'A .txt file of the note' },
  { key: 'md', icon: 'code', title: 'Markdown', sub: 'A .md file with title, topics and summary' },
];

/** Pick an export format. */
export function ExportDialog({ open, onClose, onExport }: DialogProps & { onExport: (f: ExportFormat) => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="bg-rq-surface-lowest sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-rq-on-surface">Export note</DialogTitle>
          <DialogDescription>Download a copy to keep or share.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                onExport(f.key);
                onClose();
              }}
              className="flex items-center gap-3 rounded-inner bg-rq-surface-low p-3 text-left transition hover:bg-rq-surface-container"
            >
              <span className="flex size-10 items-center justify-center rounded-pill bg-rq-secondary/10 text-rq-secondary">
                <AppIcon name={f.icon} size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-rq-on-surface">{f.title}</span>
                <span className="block text-xs text-rq-on-surface-variant">{f.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** "Move to Folder" = change the note's subject (the app's folders are subjects). */
export function MoveFolderDialog({
  open,
  onClose,
  current,
  onMove,
}: DialogProps & { current: string; onMove: (subject: string) => void }) {
  const subjects = useSubjectsStore((s) => s.subjects);
  const init = useSubjectsStore((s) => s.init);
  const addSubject = useSubjectsStore((s) => s.addSubject);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    void init();
  }, [init]);

  const pick = (subject: string) => {
    onMove(subject);
    setDraft('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <DialogContent className="bg-rq-surface-lowest sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-rq-on-surface">Move to folder</DialogTitle>
          <DialogDescription>Folders are your subjects — quizzes group notes the same way.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-72 gap-1 overflow-y-auto">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              className={cn(
                'flex items-center gap-3 rounded-inner px-3 py-2.5 text-left text-[15px] transition hover:bg-rq-surface-low',
                s === current ? 'bg-rq-secondary/10 font-semibold text-rq-secondary' : 'text-rq-on-surface',
              )}
            >
              <AppIcon name="folder" size={18} />
              <span className="flex-1 truncate">{s}</span>
              {s === current ? <AppIcon name="check" size={18} /> : null}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const name = await addSubject(draft);
            if (name) pick(name);
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="New folder…"
            className="h-10 min-w-0 flex-1 rounded-btn border border-rq-outline-variant/60 bg-rq-surface-low px-3 text-sm text-rq-on-surface outline-none placeholder:text-rq-outline focus:border-rq-secondary"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="h-10 rounded-btn bg-rq-secondary px-4 text-sm font-semibold text-rq-on-primary disabled:opacity-50"
          >
            Add
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Confirm before permanently deleting the note. */
export function DeleteNoteDialog({ open, onClose, title, onDelete }: DialogProps & { title: string; onDelete: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <AlertDialogContent className="bg-rq-surface-lowest">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            “{title}” will be removed from Memory, along with its highlights, comments and episode. This can&apos;t be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep note</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
