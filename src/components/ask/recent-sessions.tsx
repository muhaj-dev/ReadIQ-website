'use client';

import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import { timeAgo } from '@/lib/relative-time';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/use-chat-store';

/** How many recent chats the desktop side list shows. */
const LIMIT = 12;

/** xl-only side list of recent Ask sessions — one click to reopen a conversation. */
export function RecentSessions() {
  const sessions = useChatStore((s) => s.sessions);
  const activeId = useChatStore((s) => s.activeSessionId);
  const sending = useChatStore((s) => s.sending);
  const openSession = useChatStore((s) => s.openSession);
  const newChat = useChatStore((s) => s.newChat);

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-l border-rq-outline-variant/30 bg-rq-surface-low/40 xl:flex">
      <div className="flex h-16 items-center justify-between border-b border-rq-outline-variant/30 px-5">
        <h2 className="font-heading text-sm font-bold tracking-wide text-rq-on-surface-variant uppercase">Recent chats</h2>
        <button
          type="button"
          onClick={newChat}
          disabled={sending}
          className="flex items-center gap-1 rounded-pill px-2.5 py-1.5 text-xs font-semibold text-rq-secondary transition hover:bg-rq-surface-container disabled:opacity-50"
        >
          <AppIcon name="add" size={14} />
          New
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {sessions.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-rq-on-surface-variant">
            Your conversations will appear here.
          </p>
        ) : (
          <ul className="flex flex-col gap-1">
            {sessions.slice(0, LIMIT).map((session) => (
              <li key={session.id}>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => openSession(session.id)}
                  aria-current={session.id === activeId ? 'true' : undefined}
                  className={cn(
                    'w-full rounded-inner px-3 py-2.5 text-left transition disabled:opacity-60',
                    session.id === activeId ? 'bg-rq-secondary-fixed/50' : 'hover:bg-rq-surface-container',
                  )}
                >
                  <p className="truncate text-sm font-semibold text-rq-on-surface">{session.title}</p>
                  <p className="mt-0.5 text-[11px] text-rq-outline">{timeAgo(session.updatedAt)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link
        href="/ask-history"
        className="m-3 flex h-11 items-center justify-center gap-2 rounded-btn border border-rq-outline-variant text-sm font-semibold text-rq-on-surface-variant transition hover:bg-rq-surface-container"
      >
        <AppIcon name="schedule" size={18} />
        All chat history
      </Link>
    </aside>
  );
}
