import type { RecorderStatus } from '@/hooks/use-lecture-recorder';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<RecorderStatus, string> = {
  starting: 'Starting…',
  denied: '',
  unsupported: '',
  recording: 'Recording…',
  paused: 'Paused',
  stopped: 'Saving…',
};

export const formatClock = (seconds: number) =>
  [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

/** Big HH:MM:SS readout with the pulsing red "Recording…" status below. */
export function RecordTimer({ seconds, status }: { seconds: number; status: RecorderStatus }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-heading text-5xl font-extrabold text-rq-primary tabular-nums lg:text-6xl" aria-live="off">
        {formatClock(seconds)}
      </p>
      <p className="flex items-center gap-2 text-sm font-medium text-rq-on-surface-variant" aria-live="polite">
        <span
          className={cn(
            'size-2 rounded-pill',
            status === 'recording' ? 'animate-pulse bg-rq-error' : 'bg-rq-outline',
          )}
        />
        {STATUS_LABEL[status]}
      </p>
    </div>
  );
}
