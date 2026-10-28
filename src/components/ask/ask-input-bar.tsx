'use client';

import { Loader2 } from 'lucide-react';
import { type KeyboardEvent, useLayoutEffect, useRef } from 'react';

import { AskAttachMenu } from '@/components/ask/ask-attach-menu';
import { AskAttachmentRow } from '@/components/ask/ask-attachment-row';
import { RecordingBar } from '@/components/ask/recording-bar';
import { WebcamDialog } from '@/components/ask/webcam-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import type { useAskComposer } from '@/hooks/use-ask-composer';

type Props = {
  composer: ReturnType<typeof useAskComposer>;
  /** An answer is streaming — typing is fine, sending waits. */
  sending: boolean;
  /** Placeholder copy (a follow-up once the chat has started). */
  placeholder: string;
};

/** Tallest the textarea grows before it scrolls. */
const MAX_INPUT_HEIGHT = 160;

/** ChatGPT/Claude-style composer: + attach · auto-growing text · mic/send, with dictation + images. */
export function AskInputBar({ composer, sending, placeholder }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { voice } = composer;
  const recording = voice.status === 'recording';
  const transcribing = voice.status === 'transcribing';
  const canSend = composer.canSend && !sending;

  // Grow with the text (Enter sends, Shift+Enter adds a line).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, [composer.draft, recording]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
    e.preventDefault();
    if (canSend) composer.submit();
  };

  return (
    <div className="shrink-0 bg-gradient-to-t from-rq-surface from-70% to-transparent pt-2 pb-[max(12px,env(safe-area-inset-bottom))] lg:pb-6">
      <div className="mx-auto w-full max-w-[760px] px-5">
        {composer.notice ? (
          <button
            type="button"
            onClick={composer.clearNotice}
            aria-label={`${composer.notice} Dismiss`}
            className="mb-2 flex max-w-full items-center gap-2 rounded-pill bg-rq-error-container/50 px-3 py-1.5 text-left text-xs font-medium text-rq-error"
          >
            <AppIcon name="warning" size={14} />
            <span className="min-w-0">{composer.notice}</span>
            <AppIcon name="close" size={12} className="opacity-70" />
          </button>
        ) : null}

        <AskAttachmentRow attachments={composer.attachments} onRemove={composer.removeAttachment} />

        {recording ? (
          <RecordingBar seconds={voice.seconds} onCancel={voice.cancel} onStop={voice.stop} />
        ) : (
          <div className="flex items-end gap-2 rounded-card border border-rq-outline-variant bg-rq-surface-lowest p-2 shadow-[0_2px_6px_rgb(0_0_0/0.05)] transition focus-within:border-rq-secondary/50 focus-within:shadow-soft">
            <AskAttachMenu
              disabled={transcribing}
              onLibrary={composer.addFromLibrary}
              onCamera={composer.addFromCamera}
            />

            <textarea
              ref={inputRef}
              rows={1}
              value={composer.draft}
              onChange={(e) => composer.setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={transcribing ? 'Transcribing…' : placeholder}
              disabled={transcribing}
              aria-label="Ask about your notes"
              className="min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-[15px] leading-5 text-rq-on-surface outline-none placeholder:text-rq-outline disabled:opacity-60"
            />

            {transcribing ? (
              <div className="flex size-10 items-center justify-center text-rq-secondary" role="status" aria-label="Transcribing">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : composer.canSend ? (
              <button
                type="button"
                aria-label="Send"
                disabled={!canSend}
                onClick={composer.submit}
                className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-fab text-rq-on-primary transition hover:opacity-90 disabled:opacity-50"
              >
                <AppIcon name="send" size={18} />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Dictate your question"
                title="Dictate"
                onClick={voice.start}
                className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-secondary transition hover:bg-rq-surface-variant"
              >
                <AppIcon name="mic" size={20} />
              </button>
            )}
          </div>
        )}
        <p className="mt-2 hidden text-center text-[11px] text-rq-outline lg:block">
          readIQ answers only from your saved notes · Enter to send, Shift + Enter for a new line
        </p>
      </div>

      <WebcamDialog
        open={composer.webcam.open}
        onClose={composer.webcam.close}
        onCapture={composer.webcam.onCapture}
        onFallback={composer.webcam.onFallback}
      />
    </div>
  );
}
