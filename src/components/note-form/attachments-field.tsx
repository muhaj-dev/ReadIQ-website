'use client';

import { useState } from 'react';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { filesToAttachments, pickFileAttachments, pickImageAttachments } from '@/lib/files';
import { cn } from '@/lib/utils';
import type { NoteAttachment } from '@/types/note';

import { AttachmentCard } from './attachment-card';

type Props = {
  attachments: NoteAttachment[];
  onAdd: (added: NoteAttachment[]) => void;
  onRemove: (id: string) => void;
};

/** Attachments section: removable cards, Add image / Add file, and drag-and-drop. */
export function AttachmentsField({ attachments, onAdd, onRemove }: Props) {
  const [dragging, setDragging] = useState(false);

  const add = async (pick: () => Promise<NoteAttachment[]>) => {
    const picked = await pick();
    if (picked.length) onAdd(picked);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onAdd(await filesToAttachments(e.dataTransfer.files));
  };

  return (
    <div
      className={cn('flex flex-col gap-2 rounded-inner transition', dragging && 'ring-2 ring-rq-secondary-container')}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      {attachments.map((item) => (
        <AttachmentCard key={item.id} attachment={item} onRemove={() => onRemove(item.id)} />
      ))}

      <div className="flex gap-2">
        <AddButton icon="image" label="Add image" onClick={() => add(pickImageAttachments)} />
        <AddButton icon="file-upload" label="Add file" onClick={() => add(pickFileAttachments)} />
      </div>
      <p className="text-center text-xs text-rq-outline max-lg:hidden">or drop files here</p>
    </div>
  );
}

function AddButton({ icon, label, onClick }: { icon: AppIconName; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-inner border border-rq-outline-variant/50 bg-rq-surface-lowest py-3 text-sm font-semibold text-rq-primary transition hover:bg-rq-surface-low"
    >
      <AppIcon name={icon} size={18} />
      {label}
    </button>
  );
}
