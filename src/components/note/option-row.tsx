'use client';

import { AppIcon } from '@/components/ui/app-icon';
import { Switch } from '@/components/ui/switch';
import type { NoteOption } from '@/data/note-options';
import { cn } from '@/lib/utils';

type Props = {
  option: NoteOption;
  /** All rows except the last draw a hairline divider underneath. */
  divider: boolean;
  /** Overrides the option's static subtitle (e.g. the current folder). */
  subtitle?: string;
  busy?: boolean;
  /** Toggle rows only. */
  toggled?: boolean;
  onToggle?: (value: boolean) => void;
  onClick?: () => void;
};

/** One row of the Note Options card (chevron, toggle, or danger). */
export function OptionRow({ option, divider, subtitle, busy = false, toggled = false, onToggle, onClick }: Props) {
  const danger = option.kind === 'danger';
  const sub = subtitle ?? option.subtitle;
  const content = (
    <>
      <span className={cn('w-10 shrink-0', danger ? 'text-rq-error' : 'text-rq-on-surface')}>
        <AppIcon name={option.icon} size={22} className={busy ? 'animate-pulse' : undefined} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn('block text-[15px] font-semibold', danger ? 'text-rq-error' : 'text-rq-on-surface')}>
          {option.title}
        </span>
        {sub ? <span className="block truncate text-xs text-rq-outline">{busy ? 'Working…' : sub}</span> : null}
      </span>
    </>
  );
  const classes = cn(
    'flex w-full items-center p-4 text-left',
    divider && 'border-b border-rq-outline-variant/20',
  );

  if (option.kind === 'toggle') {
    return (
      <label className={cn(classes, 'cursor-pointer')}>
        {content}
        <Switch checked={toggled} onCheckedChange={(v) => onToggle?.(v)} aria-label={option.title} />
      </label>
    );
  }

  return (
    <button type="button" disabled={busy} onClick={onClick} className={cn(classes, 'transition hover:bg-rq-surface-low disabled:opacity-70')}>
      {content}
      <AppIcon name="chevron-right" size={20} className="text-rq-outline-variant" />
    </button>
  );
}
