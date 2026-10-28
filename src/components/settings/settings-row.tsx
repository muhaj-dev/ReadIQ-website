import Link from 'next/link';
import type { ReactNode } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Switch } from '@/components/ui/switch';
import type { SettingsRowItem } from '@/data/settings';

type Props = {
  item: SettingsRowItem;
  /** Navigating rows link somewhere and show a chevron. */
  href?: string;
  /** Toggle rows only. */
  toggled?: boolean;
  onToggle?: (value: boolean) => void;
  /** Custom trailing control (e.g. the Appearance segmented picker). */
  trailing?: ReactNode;
};

const ROW = 'flex min-h-16 items-center justify-between gap-4 px-5 py-4';

/** One Settings row: icon + label · then a link chevron, a switch, a custom control,
 *  or a plain read-only value (preferences that aren't adjustable on the web yet). */
export function SettingsRow({ item, href, toggled = false, onToggle, trailing }: Props) {
  const lead = (
    <span className="flex min-w-0 items-center gap-4">
      <AppIcon name={item.icon} size={24} className="text-rq-outline" />
      <span className="min-w-0">
        <span className="block text-base text-rq-on-surface">{item.title}</span>
        {item.subtitle ? (
          <span className="block text-xs font-medium text-rq-on-surface-variant">{item.subtitle}</span>
        ) : null}
      </span>
    </span>
  );
  const value = item.value ? (
    <span className="truncate text-sm font-semibold tracking-[0.01em] text-rq-on-surface-variant">{item.value}</span>
  ) : null;

  if (href) {
    return (
      <Link href={href} className={`${ROW} transition hover:bg-rq-surface-low`}>
        {lead}
        <span className="flex min-w-0 items-center gap-2">
          {value}
          <AppIcon name="chevron-right" size={16} className="text-rq-outline-variant" />
        </span>
      </Link>
    );
  }

  if (item.kind === 'toggle') {
    return (
      <label className={`${ROW} cursor-pointer`}>
        {lead}
        <Switch checked={toggled} onCheckedChange={(on) => onToggle?.(on)} aria-label={item.title} />
      </label>
    );
  }

  return (
    // Wraps on very narrow phones so a wide trailing control drops below the label.
    <div className={`${ROW} flex-wrap gap-y-3`}>
      {lead}
      {trailing ?? value}
    </div>
  );
}
