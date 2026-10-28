import { AddNoteCta } from '@/components/ask/add-note-cta';
import { AiBubble } from '@/components/ask/ai-bubble';
import { BeyondNotesButton } from '@/components/ask/beyond-notes-button';
import { FromYourImageCard } from '@/components/ask/from-your-image-card';
import { FromYourNotesCard } from '@/components/ask/from-your-notes-card';
import { GenerateMoreButton } from '@/components/ask/generate-more-button';
import { ImageDecisionCard } from '@/components/ask/image-decision-card';
import { UserBubble } from '@/components/ask/user-bubble';
import { NO_NOTES_YET, NOT_IN_NOTES } from '@/lib/chat';
import { clockTime } from '@/lib/relative-time';
import { useChatStore } from '@/store/use-chat-store';
import type { ChatMessage } from '@/types/chat';

/** True for the honest "not in your notes" fallback replies (exact text — the beyond flag isn't persisted). */
function isFallbackReply(content: string): boolean {
  return content === NO_NOTES_YET || content.startsWith(NOT_IN_NOTES);
}

type Props = {
  message: ChatMessage;
  /** The next turn is the "beyond" answer this one spawned — hide its opt-in button. */
  nextIsBeyond: boolean;
};

/** One turn: the question, or readIQ's answer + its trust tags and follow-up actions. */
export function MessageRow({ message, nextIsBeyond }: Props) {
  const generateMore = useChatStore((s) => s.generateMore);
  const answerBeyond = useChatStore((s) => s.answerBeyond);
  const resolveImageDecision = useChatStore((s) => s.resolveImageDecision);
  const sending = useChatStore((s) => s.sending);

  if (message.role === 'user') {
    return (
      <UserBubble
        text={message.content}
        time={clockTime(message.createdAt)}
        attachments={message.attachments}
      />
    );
  }

  const settled = !message.streaming;
  const deciding = !!message.imageDecision;
  const fallback =
    settled && !message.error && !message.beyond && !deciding && isFallbackReply(message.content);
  // "Generate more" under every settled, note-backed answer until the notes are exhausted.
  const canGenerateMore = settled && message.grounded && !message.exhausted;
  // The opt-in outside answer under any settled reply that hasn't spawned one.
  const canAskBeyond =
    settled &&
    !message.error &&
    !message.beyond &&
    !message.beyondAsked &&
    !deciding &&
    !nextIsBeyond &&
    (message.grounded || fallback);

  return (
    <div className="flex flex-col gap-3">
      <AiBubble
        text={message.content}
        time={clockTime(message.createdAt)}
        streaming={message.streaming}
        error={message.error}
        beyond={message.beyond}
      />
      {settled && message.citations.length > 0 ? (
        <div className="flex flex-col gap-2">
          {message.citations.map((citation) => (
            <FromYourNotesCard
              key={citation.noteId}
              noteId={citation.noteId}
              noteTitle={citation.noteTitle}
            />
          ))}
        </div>
      ) : null}
      {settled && message.fromImage ? <FromYourImageCard /> : null}
      {deciding ? (
        <ImageDecisionCard
          topic={message.imageDecision!.topic}
          decided={message.decided}
          busy={sending}
          onSave={() => resolveImageDecision(message.id, 'saved')}
          onOnce={() => resolveImageDecision(message.id, 'once')}
        />
      ) : null}
      {canGenerateMore || fallback || canAskBeyond ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {canGenerateMore ? (
            <GenerateMoreButton
              busy={message.continuing}
              disabled={sending}
              onPress={() => generateMore(message.id)}
            />
          ) : null}
          {fallback ? <AddNoteCta /> : null}
          {canAskBeyond ? <BeyondNotesButton onPress={() => answerBeyond(message.id)} /> : null}
        </div>
      ) : null}
    </div>
  );
}
