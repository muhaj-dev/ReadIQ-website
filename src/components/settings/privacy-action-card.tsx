import { AppIcon } from '@/components/ui/app-icon';
import type { PrivacyAction } from '@/data/settings';
import { cn } from '@/lib/utils';

type Props = {
  action: PrivacyAction;
  /** Omit to render the card as "coming soon" (not clickable). */
  onPress?: () => void;
  busy?: boolean;
};

/** One Data & Privacy card: round icon well · title + subtitle · chevron (or "Soon"). */
export function PrivacyActionCard({ action, onPress, busy = false }: Props) {
  const danger = action.tone === 'danger';
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-pill',
            danger ? 'bg-rq-error-container text-rq-error' : 'bg-rq-surface-container text-rq-primary',
          )}
        >
          <AppIcon name={action.icon} size={22} />
        </span>
        <span className="min-w-0">
          <span className={cn('block font-heading text-base font-semibold', danger ? 'text-rq-error' : 'text-rq-on-surface')}>
            {action.title}
          </span>
          {action.subtitle ? (
            <span
              className={cn(
                'block text-xs font-medium',
                danger ? 'text-rq-on-error-container dark:text-rq-error' : 'text-rq-on-surface-variant',
              )}
            >
              {busy ? 'Working…' : action.subtitle}
            </span>
          ) : null}
        </span>
      </span>
      {onPress ? (
        <AppIcon name="chevron-right" size={20} className={danger ? 'text-rq-error' : 'text-rq-outline'} />
      ) : (
        <span className="shrink-0 rounded-pill bg-rq-surface-container px-2.5 py-1 text-[11px] font-semibold text-rq-on-surface-variant">
          Soon
        </span>
      )}
    </>
  );
  const classes = 'flex w-full items-center justify-between gap-3 rounded-inner bg-rq-surface-lowest p-5 text-left shadow-soft';

  return onPress ? (
    <button
      type="button"
      onClick={onPress}
      disabled={busy}
      className={cn(classes, 'transition hover:bg-rq-surface-low disabled:opacity-70')}
    >
      {body}
    </button>
  ) : (
    <div className={cn(classes, 'opacity-80')}>{body}</div>
  );
}
