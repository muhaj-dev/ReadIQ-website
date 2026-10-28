'use client';

import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import { useChatStore } from '@/store/use-chat-store';

const ICON_BTN =
  'flex size-11 items-center justify-center rounded-pill text-rq-on-surface transition hover:bg-rq-surface-container disabled:pointer-events-none disabled:opacity-35';

/** Ask AI top bar: back (phones), title, and new-chat + history actions. */
export function AskHeader() {
  const newChat = useChatStore((s) => s.newChat);
  const hasMessages = useChatStore((s) => s.messages.length > 0);
  const sending = useChatStore((s) => s.sending);

  return (
    <header className="flex h-14 shrink-0 items-center px-2 pt-[env(safe-area-inset-top)] lg:h-16 lg:border-b lg:border-rq-outline-variant/30 lg:px-6">
      <Link href="/home" aria-label="Back to home" className={`${ICON_BTN} lg:hidden`}>
        <AppIcon name="chevron-left" size={26} />
      </Link>
      <h1 className="flex-1 text-center font-heading text-lg font-bold text-rq-on-surface lg:text-left lg:text-xl">
        Ask AI
      </h1>
      {/* New chat clears the thread (the old one stays in history); disabled when already empty. */}
      <button
        type="button"
        aria-label="New chat"
        title="New chat"
        disabled={!hasMessages || sending}
        onClick={newChat}
        className={ICON_BTN}
      >
        <AppIcon name="edit-note" size={24} />
      </button>
      <Link href="/ask-history" aria-label="Chat history" title="Chat history" className={`${ICON_BTN} xl:hidden`}>
        <AppIcon name="schedule" size={23} />
      </Link>
    </header>
  );
}
