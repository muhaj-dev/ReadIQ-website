import { AnswerBody } from '@/components/ask/answer-body';
import { TypingDots } from '@/components/ask/typing-dots';
import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  /** The answer text — grows token by token while `streaming`. */
  text: string;
  /** Wall-clock label, shown once the answer settles. */
  time: string;
  /** Tokens are still arriving. */
  streaming?: boolean;
  /** This bubble holds a friendly runtime-error message, not an answer. */
  error?: boolean;
  /** Answer from outside the notes — the distinct "Beyond your notes" styling. */
  beyond?: boolean;
};

/** Left-aligned card holding readIQ's answer; "beyond" answers use a distinct blue well. */
export function AiBubble({ text, time, streaming, error, beyond }: Props) {
  const waiting = streaming && text.length === 0;

  return (
    <div className="flex flex-col items-start">
      {beyond ? (
        <p className="mb-1 ml-1 flex items-center gap-1 text-xs font-bold text-rq-topic-blue-ink">
          <AppIcon name="language" size={13} />
          Beyond your notes · general knowledge
        </p>
      ) : (
        <p className="mb-1 ml-1 text-xs font-bold text-rq-primary">readIQ</p>
      )}
      <div
        className={cn(
          'flex max-w-[92%] flex-col gap-3 rounded-card rounded-tl-[4px] border p-4 shadow-[0_2px_6px_rgb(0_0_0/0.05)] sm:max-w-[90%]',
          beyond
            ? 'border-rq-topic-blue-border bg-rq-topic-blue-bg'
            : error
              ? 'border-rq-error/30 bg-rq-surface-lowest'
              : 'border-rq-outline-variant bg-rq-surface-lowest',
        )}
        aria-live={streaming ? 'polite' : undefined}
      >
        {waiting ? (
          <TypingDots />
        ) : (
          <>
            {error ? (
              <p className="flex items-center gap-1.5 text-xs font-semibold text-rq-error">
                <AppIcon name="warning" size={16} />
                Couldn&apos;t answer
              </p>
            ) : null}
            <AnswerBody text={text} />
          </>
        )}
        {!streaming && time ? (
          <p className="text-right text-[10px] leading-[14px] text-rq-outline">{time}</p>
        ) : null}
      </div>
    </div>
  );
}
