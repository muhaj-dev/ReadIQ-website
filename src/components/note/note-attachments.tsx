'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { AppIcon } from '@/components/ui/app-icon';
import { getBlob, useFileUrl } from '@/lib/blob-store';
import type { NoteAttachment } from '@/types/note';

import { ImageLightbox } from './image-lightbox';

/** Save a stored attachment to the student's device. */
async function download(item: NoteAttachment) {
  try {
    const url = URL.createObjectURL(await getBlob(item.uri));
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name || 'attachment';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  } catch {
    toast.error("That file isn't stored in this browser anymore.");
  }
}

/** Read-only Attachments section on Note Details: images open in a lightbox, files download. */
export function NoteAttachments({ attachments }: { attachments: NoteAttachment[] }) {
  const [viewing, setViewing] = useState<{ src: string; alt: string } | null>(null);
  if (attachments.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-sans text-sm font-semibold text-rq-on-surface">Attachments</h2>
      <ul className="grid gap-2">
        {attachments.map((item) => (
          <AttachmentRow
            key={item.id}
            item={item}
            onView={(src) => setViewing({ src, alt: item.name })}
          />
        ))}
      </ul>
      <ImageLightbox src={viewing?.src ?? null} alt={viewing?.alt ?? ''} onClose={() => setViewing(null)} />
    </section>
  );
}

function AttachmentRow({ item, onView }: { item: NoteAttachment; onView: (src: string) => void }) {
  const isImage = item.kind === 'image';
  const url = useFileUrl(isImage ? item.uri : null);

  return (
    <li className="flex items-center gap-3 rounded-inner border border-rq-outline-variant/40 bg-rq-surface-lowest p-3 shadow-soft">
      {isImage && url ? (
        <button type="button" onClick={() => onView(url)} aria-label={`View ${item.name}`} className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
          <img src={url} alt="" className="size-11 rounded-lg object-cover" />
        </button>
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rq-surface-low text-rq-on-surface-variant">
          <AppIcon name={isImage ? 'image' : 'description'} size={20} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-rq-on-surface">{item.name}</p>
        <p className="text-xs text-rq-outline">{item.meta}</p>
      </div>
      {isImage && url ? (
        <button
          type="button"
          onClick={() => onView(url)}
          className="rounded-pill px-3 py-1.5 text-xs font-semibold text-rq-secondary hover:bg-rq-surface-low"
        >
          View
        </button>
      ) : null}
      <button
        type="button"
        aria-label={`Download ${item.name}`}
        title="Download"
        onClick={() => void download(item)}
        className="flex size-9 items-center justify-center rounded-pill text-rq-on-surface-variant hover:bg-rq-surface-low"
      >
        <AppIcon name="download" size={18} />
      </button>
    </li>
  );
}
