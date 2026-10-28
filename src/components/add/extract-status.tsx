import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

type Props = {
  state: 'reading' | 'summarizing' | 'error';
  fileName: string;
  /** Friendly error line (shown when state === 'error'). */
  message?: string;
  /** Override the "reading" copy (Scan → "Reading your photo…", Record → "Transcribing…"). */
  readingTitle?: string;
  readingHint?: string;
  /** Override the error heading + skip-button label per context. */
  errorTitle?: string;
  skipLabel?: string;
  onRetry: () => void;
  onSkip: () => void;
};

const SUMMARIZING = { title: 'Summarizing…', hint: 'Writing a quick summary with your study assistant.' };
const READING = { title: 'Reading your document…', hint: 'Pulling the text out through your study assistant.' };

/** Centred status while media is read/summarized by the AI: spinner or a graceful error. */
export function ExtractStatus({ state, fileName, message, readingTitle, readingHint, errorTitle, skipLabel, onRetry, onSkip }: Props) {
  const busy =
    state === 'summarizing' ? SUMMARIZING : { title: readingTitle ?? READING.title, hint: readingHint ?? READING.hint };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-md flex-col items-center text-center" role="status" aria-live="polite">
        {state !== 'error' ? (
          <>
            <span className="size-12 animate-spin rounded-pill border-4 border-rq-primary/20 border-t-rq-primary" />
            <h2 className="mt-6 font-heading text-xl font-bold text-rq-on-surface">{busy.title}</h2>
            <p className="mt-1.5 max-w-full truncate text-[15px] text-rq-on-surface-variant">{fileName}</p>
            <p className="mt-1 text-sm text-rq-outline">{busy.hint}</p>
          </>
        ) : (
          <>
            <span className="flex size-16 items-center justify-center rounded-pill bg-rq-error-container/60 text-rq-error">
              <AppIcon name="warning" size={30} />
            </span>
            <h2 className="mt-5 font-heading text-xl font-bold text-rq-on-surface">
              {errorTitle ?? "Couldn't read that document"}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-rq-on-surface-variant">
              {message ?? 'Something went wrong reading the file.'}
            </p>
            <Button onClick={onRetry} className="mt-7 h-12 w-full rounded-btn text-base font-semibold">
              Try again
            </Button>
            <Button variant="ghost" onClick={onSkip} className="mt-2 h-11 w-full text-[15px] font-semibold text-rq-primary">
              {skipLabel ?? 'Add without text'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
