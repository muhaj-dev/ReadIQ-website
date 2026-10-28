'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { DeleteSessionDialog } from '@/components/ask/delete-session-dialog';
import { SessionCard } from '@/components/ask/session-card';
import { EmptyState, Page, PageHeader } from '@/components/shell/page';
import { AppIcon } from '@/components/ui/app-icon';
import { useChatStore } from '@/store/use-chat-store';
import type { ChatSession } from '@/types/chat';

/** Chat history — saved Ask conversations, newest first; open one to continue, or start fresh. */
export default function AskHistoryPage() {
  const router = useRouter();
  const sessions = useChatStore((s) => s.sessions);
  const loaded = useChatStore((s) => s.loaded);
  const openSession = useChatStore((s) => s.openSession);
  const deleteSession = useChatStore((s) => s.deleteSession);
  const newChat = useChatStore((s) => s.newChat);
  const [pendingDelete, setPendingDelete] = useState<ChatSession | null>(null);

  const open = async (id: string) => {
    await openSession(id);
    router.push('/ask');
  };

  const startNew = () => {
    newChat();
    router.push('/ask');
  };

  const confirmDelete = (id: string) => {
    setPendingDelete(null);
    void deleteSession(id);
  };

  return (
    <Page width="narrow">
      <PageHeader
        title="Chat history"
        subtitle={sessions.length ? `${sessions.length} saved ${sessions.length === 1 ? 'chat' : 'chats'}` : undefined}
        back="/ask"
        actions={
          <button
            type="button"
            onClick={startNew}
            className="flex h-10 items-center gap-2 rounded-btn bg-rq-fab px-3.5 text-sm font-semibold text-rq-on-primary transition hover:opacity-90"
          >
            <AppIcon name="edit-note" size={18} />
            <span className="hidden sm:inline">New chat</span>
          </button>
        }
      />

      {!loaded ? null : sessions.length === 0 ? (
        <EmptyState
          icon="schedule"
          title="No saved chats yet"
          body="Your conversations with readIQ will appear here so you can revisit them anytime."
          action={
            <Link
              href="/ask"
              className="flex h-11 items-center gap-2 rounded-btn bg-rq-fab px-5 text-sm font-semibold text-rq-on-primary transition hover:opacity-90"
            >
              <AppIcon name="auto-awesome" size={18} />
              Ask a question
            </Link>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((session) => (
            <li key={session.id}>
              <SessionCard
                session={session}
                onOpen={() => open(session.id)}
                onDelete={() => setPendingDelete(session)}
              />
            </li>
          ))}
        </ul>
      )}

      <DeleteSessionDialog
        session={pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </Page>
  );
}
