'use client';

import { useState } from 'react';

import { noteOptions } from '@/data/note-options';
import type { Note } from '@/types/note';

import { DeleteNoteDialog, ExportDialog, MoveFolderDialog } from './note-option-dialogs';
import { OptionRow } from './option-row';
import { useNoteOptionActions } from './use-note-option-actions';

type Open = 'export' | 'move' | 'delete' | null;

/** The Note Options menu card, with every row wired to a real action. */
export function NoteOptionsCard({ note }: { note: Note }) {
  const actions = useNoteOptionActions(note);
  const [open, setOpen] = useState<Open>(null);
  const subject = note.subject ?? 'General';
  const close = () => setOpen(null);

  const handlers: Record<string, () => void> = {
    share: () => void actions.share(),
    export: () => setOpen('export'),
    duplicate: () => void actions.duplicate(),
    move: () => setOpen('move'),
    summary: () => void actions.regenerateSummary(),
    delete: () => setOpen('delete'),
  };

  return (
    <>
      <div className="overflow-hidden rounded-card border border-rq-outline-variant/25 bg-rq-surface-lowest shadow-soft">
        {noteOptions.map((option, index) => (
          <OptionRow
            key={option.key}
            option={option}
            divider={index < noteOptions.length - 1}
            subtitle={option.key === 'move' ? `In ${subject}` : undefined}
            busy={option.key === 'summary' && actions.summarizing}
            toggled={actions.favorite}
            onToggle={actions.setFavorite}
            onClick={handlers[option.key]}
          />
        ))}
      </div>

      <ExportDialog open={open === 'export'} onClose={close} onExport={(f) => void actions.exportAs(f)} />
      <MoveFolderDialog open={open === 'move'} onClose={close} current={subject} onMove={(s) => void actions.moveTo(s)} />
      <DeleteNoteDialog open={open === 'delete'} onClose={close} title={note.title} onDelete={() => void actions.remove()} />
    </>
  );
}
