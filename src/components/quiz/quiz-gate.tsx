import type { ReactNode } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';
import type { QuizStatus } from '@/store/use-quiz-store';

type Props = {
  status: QuizStatus;
  error: string;
  /** The subject the quiz is being built from — named in the loading copy. */
  sourceLabel: string;
  onRetry: () => void;
  /** Leave the quiz (the "empty"/"exhausted" states' way out). */
  onExit: () => void;
};

/** Pre-quiz states: building spinner, thin-subject empty, exhausted, and error. */
export function QuizGate({ status, error, sourceLabel, onRetry, onExit }: Props) {
  if (status === 'generating' || status === 'idle' || status === 'ready') {
    return (
      <GateLayout
        well="bg-rq-primary/10 text-rq-primary"
        icon={<span className="size-6 animate-spin rounded-pill border-2 border-current border-t-transparent" />}
        title="Building your quiz…"
        body={`Writing questions from your ${sourceLabel} notes. Every question comes only from what you saved — no outside facts.`}
        live
      />
    );
  }

  if (status === 'empty') {
    return (
      <GateLayout
        well="bg-rq-surface-container text-rq-on-surface-variant"
        icon={<AppIcon name="quiz" size={28} />}
        title="Not enough to quiz yet"
        body={`Your ${sourceLabel} notes are a little too short to build grounded questions from. Add more, then come back for a quiz.`}
        action={<SecondaryButton label="Back to subjects" onPress={onExit} />}
      />
    );
  }

  if (status === 'exhausted') {
    return (
      <GateLayout
        well="bg-rq-primary/10 text-rq-primary"
        icon={<AppIcon name="check-circle" size={28} />}
        title="You’ve covered it all"
        body={`No new questions left — you’ve been quizzed on everything in your ${sourceLabel} notes. Add more notes for fresh questions.`}
        action={<SecondaryButton label="Back to subjects" onPress={onExit} />}
      />
    );
  }

  return (
    <GateLayout
      well="bg-rq-error/12 text-rq-error"
      icon={<AppIcon name="warning" size={28} />}
      title="Couldn’t build the quiz"
      body={error}
      action={
        <button
          type="button"
          onClick={onRetry}
          className="flex h-12 items-center justify-center gap-2 rounded-card bg-rq-primary px-6 text-[15px] font-semibold text-rq-on-primary transition hover:opacity-90"
        >
          <AppIcon name="auto-awesome" size={18} filled />
          Try again
        </button>
      }
    />
  );
}

type LayoutProps = {
  well: string;
  icon: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
  live?: boolean;
};

function GateLayout({ well, icon, title, body, action, live }: LayoutProps) {
  return (
    <div
      role={live ? 'status' : undefined}
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-8 text-center"
    >
      <div className={cn('flex size-16 items-center justify-center rounded-pill', well)}>{icon}</div>
      <h2 className="font-heading text-xl font-bold text-rq-on-surface">{title}</h2>
      <p className="max-w-sm text-sm leading-[21px] text-rq-on-surface-variant">{body}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex h-12 items-center justify-center rounded-card border border-rq-surface-variant bg-rq-surface-lowest px-6 text-[15px] font-semibold text-rq-on-surface transition hover:bg-rq-surface-low"
    >
      {label}
    </button>
  );
}
