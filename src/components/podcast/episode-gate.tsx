'use client';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { EpisodeStatus } from '@/store/use-podcast-store';

type Props = {
  status: EpisodeStatus;
  error: string;
  onGenerate: () => void;
};

/** Pre-episode states: create invitation, writing spinner, and error with retry. */
export function EpisodeGate({ status, error, onGenerate }: Props) {
  if (status === 'loading') {
    return (
      <div className="mx-auto grid max-w-md gap-3 py-16" aria-label="Loading episode">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-20 w-full rounded-card" />
        <Skeleton className="ml-auto h-16 w-4/5 rounded-card" />
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <State icon="headphones" tone="busy" title="Writing your episode…">
        Maya and Leo are talking through your note. This uses only what you saved — no outside facts.
      </State>
    );
  }

  if (status === 'error') {
    return (
      <State icon="warning" tone="error" title="Couldn't make the episode" onAction={onGenerate} action="Try again">
        {error}
      </State>
    );
  }

  return (
    <State icon="headphones" tone="idle" title="Broadcast this note" onAction={onGenerate} action="Create episode">
      Two hosts talk through your note like a mini broadcast, so you can revise by listening. Written only from what
      you saved.
    </State>
  );
}

function State({
  icon,
  tone,
  title,
  children,
  action,
  onAction,
}: {
  icon: AppIconName;
  tone: 'idle' | 'busy' | 'error';
  title: string;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <span
        className={cn(
          'flex size-20 items-center justify-center rounded-pill',
          tone === 'error' ? 'bg-rq-flame/12 text-rq-flame' : 'bg-rq-secondary/10 text-rq-secondary',
          tone === 'busy' && 'animate-pulse',
        )}
      >
        <AppIcon name={icon} size={36} />
      </span>
      <h2 className="font-heading text-xl font-bold text-rq-on-surface">{title}</h2>
      <p className="text-sm leading-relaxed text-rq-on-surface-variant">{children}</p>
      {action && onAction ? (
        <Button onClick={onAction} className="mt-1 h-12 gap-2 rounded-card px-6 text-[15px] font-semibold">
          <AppIcon name="auto-awesome" size={18} filled />
          {action}
        </Button>
      ) : null}
    </div>
  );
}
