'use client';

import { useLayoutEffect, useRef } from 'react';

import { AskHero } from '@/components/ask/ask-hero';
import { MessageRow } from '@/components/ask/message-row';
import { SuggestionChips } from '@/components/ask/suggestion-chips';
import { suggestionChips } from '@/data/ask-chat';
import type { ChatMessage } from '@/types/chat';

type Props = {
  messages: ChatMessage[];
  /** Tapping a suggestion chip seeds the input box. */
  onPickChip: (chip: string) => void;
};

/** How close to the bottom (px) still counts as "following" the conversation. */
const STICK_THRESHOLD = 96;

/** Scrollable chat area: the calm hero + chips when empty, the thread otherwise.
 *  Sticks to the bottom while answers stream — unless the student scrolls up to read. */
export function AskConversation({ messages, onPickChip }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const countRef = useRef(messages.length);
  const empty = messages.length === 0;

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < STICK_THRESHOLD;
  };

  // A new turn (sent question, opened session) always snaps back to the bottom;
  // streamed tokens follow only while the student is already there.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (messages.length !== countRef.current) stickRef.current = true;
    countRef.current = messages.length;
    if (stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
    >
      {empty ? (
        <div className="mx-auto flex min-h-full w-full max-w-[760px] flex-col justify-center px-5 py-8">
          <AskHero />
          <div className="mt-8">
            <SuggestionChips chips={suggestionChips} onPick={onPickChip} />
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 px-5 pt-4 pb-6 lg:pt-8">
          {messages.map((message, i) => (
            <MessageRow
              key={message.id}
              message={message}
              nextIsBeyond={messages[i + 1]?.beyond ?? false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
