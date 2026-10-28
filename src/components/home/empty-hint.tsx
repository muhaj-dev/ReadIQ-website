import Link from 'next/link';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

type Props = {
  icon: AppIconName;
  title: string;
  subtitle: string;
  /** Optional call-to-action (e.g. "Add a deadline") and where it goes. */
  cta?: string;
  href?: string;
};

/** Calm empty-state card for a dashboard section with no data yet. */
export function EmptyHint({ icon, title, subtitle, cta, href }: Props) {
  const body = (
    <>
      <div className="mb-1 flex size-11 items-center justify-center rounded-lg bg-rq-surface-container text-rq-primary">
        <AppIcon name={icon} size={22} />
      </div>
      <p className="text-sm font-semibold text-rq-on-surface">{title}</p>
      <p className="max-w-xs text-center text-xs leading-[18px] text-rq-on-surface-variant">{subtitle}</p>
      {cta ? (
        <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-rq-secondary">
          {cta}
          <AppIcon name="chevron-right" size={16} />
        </span>
      ) : null}
    </>
  );
  const classes =
    'flex flex-col items-center gap-2 rounded-card border border-rq-surface-low bg-rq-surface-lowest p-6 shadow-soft';

  return href ? (
    <Link href={href} className={`${classes} transition hover:border-rq-outline-variant/40`}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}
