import { AttachmentThumb } from '@/components/ask/attachment-thumb';
import type { ChatAttachment } from '@/types/chat';

type Props = {
  text: string;
  time: string;
  /** Images the student attached to this question — shown above the text. */
  attachments?: ChatAttachment[];
};

/** Right-aligned indigo bubble for the student's question (with any attached images). */
export function UserBubble({ text, time, attachments }: Props) {
  const hasImages = !!attachments?.length;

  return (
    <div className="flex flex-col items-end">
      <div className="max-w-[85%] rounded-card rounded-tr-[4px] bg-rq-secondary-container p-4 text-rq-on-primary shadow-[0_2px_6px_rgb(0_0_0/0.06)] sm:max-w-[75%]">
        {hasImages ? (
          <div className={text ? 'mb-3 flex flex-wrap gap-2' : 'flex flex-wrap gap-2'}>
            {attachments.map((a) => (
              <AttachmentThumb
                key={a.id}
                uri={a.uri}
                className="size-[132px] rounded-inner border border-rq-on-primary/25"
              />
            ))}
          </div>
        ) : null}
        {text ? <p className="text-[15px] leading-[23px] break-words whitespace-pre-wrap">{text}</p> : null}
        <p className="mt-2 text-right text-[10px] leading-[14px] text-rq-on-primary/80">{time}</p>
      </div>
    </div>
  );
}
