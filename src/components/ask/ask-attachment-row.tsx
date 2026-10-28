import { AttachmentThumb } from '@/components/ask/attachment-thumb';
import { AppIcon } from '@/components/ui/app-icon';
import type { ChatAttachment } from '@/types/chat';

type Props = {
  attachments: ChatAttachment[];
  onRemove: (id: string) => void;
};

/** Attached-image thumbnails above the composer, each with an × to drop it. */
export function AskAttachmentRow({ attachments, onRemove }: Props) {
  if (attachments.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2 px-1 pt-1.5">
      {attachments.map((a) => (
        <div key={a.id} className="relative">
          <AttachmentThumb uri={a.uri} className="size-[60px] rounded-inner border border-rq-outline-variant" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onRemove(a.id)}
            className="absolute -top-1.5 -right-1.5 flex size-[22px] items-center justify-center rounded-pill bg-rq-on-surface/75 text-rq-surface-lowest transition hover:bg-rq-on-surface"
          >
            <AppIcon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
