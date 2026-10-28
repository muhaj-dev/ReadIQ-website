'use client';

import { AppIcon } from '@/components/ui/app-icon';
import { useFileUrl } from '@/lib/blob-store';
import type { NoteAttachment } from '@/types/note';

type Props = {
  attachment: NoteAttachment;
  onRemove?: () => void;
};

/** One attachment row: file tile / image thumb, name + meta, remove ✕. */
export function AttachmentCard({ attachment, onRemove }: Props) {
  const isImage = attachment.kind === 'image';
  const url = useFileUrl(isImage ? attachment.uri : null);

  return (
    <div className="flex items-center justify-between gap-3 rounded-inner border border-rq-outline-variant/40 bg-rq-surface-lowest p-3 shadow-soft">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {isImage && url ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL
          <img src={url} alt="" className="size-10 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-rq-surface-low text-rq-on-surface-variant">
            <AppIcon name={isImage ? 'image' : 'description'} size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-rq-on-surface">{attachment.name}</p>
          <p className="truncate text-xs text-rq-outline">{attachment.meta}</p>
        </div>
      </div>
      {onRemove ? (
        <button
          type="button"
          aria-label={`Remove ${attachment.name}`}
          onClick={onRemove}
          className="flex size-8 shrink-0 items-center justify-center rounded-pill text-rq-outline-variant transition hover:bg-rq-surface-container hover:text-rq-on-surface-variant"
        >
          <AppIcon name="close" size={20} />
        </button>
      ) : null}
    </div>
  );
}
