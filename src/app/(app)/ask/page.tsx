'use client';

import { AskConversation } from '@/components/ask/ask-conversation';
import { AskHeader } from '@/components/ask/ask-header';
import { AskInputBar } from '@/components/ask/ask-input-bar';
import { RecentSessions } from '@/components/ask/recent-sessions';
import { useAskComposer } from '@/hooks/use-ask-composer';
import { useChatStore } from '@/store/use-chat-store';

/** ASK ★ — the grounded chat. Answers come only from the student's saved notes (or
 *  an attached photo they OK), stream in live, and prove it with source tags.
 *  Full-bleed on phones (own header, composer pinned to the bottom); a centred
 *  conversation column inside the shell on desktop, with recent chats on xl. */
export default function AskPage() {
  const messages = useChatStore((s) => s.messages);
  const sending = useChatStore((s) => s.sending);
  const send = useChatStore((s) => s.send);
  const composer = useAskComposer(send);

  return (
    <div className="flex h-dvh overflow-hidden bg-rq-surface">
      <div className="flex min-w-0 flex-1 flex-col">
        <AskHeader />
        <AskConversation messages={messages} onPickChip={composer.setDraft} />
        <AskInputBar
          composer={composer}
          sending={sending}
          placeholder={messages.length ? 'Ask a follow up…' : 'Ask about your notes…'}
        />
      </div>
      <RecentSessions />
    </div>
  );
}
