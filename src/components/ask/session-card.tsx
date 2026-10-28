import { AppIcon } from '@/components/ui/app-icon';
import { timeAgo } from '@/lib/relative-time';
import type { ChatSession } from '@/types/chat';

type Props = {
  session: ChatSession;
  onOpen: () => void;
  onDelete: () => void;
};

/** One chat-history row: title, first-question preview, last-active time, delete. */
export function SessionCard({ session, onOpen, onDelete }: Props) {
  const turns = Math.floor(session.messageCount / 2) || 1;

  return (
    <div className="group relative flex items-center gap-3 rounded-card border border-rq-outline-variant bg-rq-surface-lowest p-4 transition hover:border-rq-secondary/40 hover:shadow-soft">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rq-surface-container text-rq-secondary">
        <AppIcon name="auto-awesome" size={20} filled />
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open chat: ${session.title}`}
        className="min-w-0 flex-1 text-left after:absolute after:inset-0 after:rounded-card"
      >
        <p className="truncate text-[15px] leading-5 font-semibold text-rq-on-surface">{session.title}</p>
        {session.preview ? (
          <p className="mt-0.5 truncate text-[13px] leading-[18px] text-rq-on-surface-variant">{session.preview}</p>
        ) : null}
        <p className="mt-1 text-[11px] leading-[14px] font-medium text-rq-outline">
          {timeAgo(session.updatedAt)} · {turns} {turns === 1 ? 'question' : 'questions'}
        </p>
      </button>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete chat: ${session.title}`}
        className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-pill text-rq-outline transition hover:bg-rq-error-container/50 hover:text-rq-error"
      >
        <AppIcon name="delete" size={20} />
      </button>
    </div>
  );
}
