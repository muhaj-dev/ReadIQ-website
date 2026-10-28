import Link from 'next/link';

type Props = {
  title: string;
  /** Optional right-side link, e.g. "View all". */
  action?: string;
  href?: string;
};

/** Uppercase section label used above every dashboard block. */
export function SectionHeader({ title, action, href }: Props) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="font-sans text-sm font-bold tracking-[0.05em] text-rq-on-surface uppercase">{title}</h2>
      {action && href ? (
        <Link href={href} className="text-xs font-medium text-rq-secondary hover:underline">
          {action}
        </Link>
      ) : null}
    </div>
  );
}
