import Image from 'next/image';
import Link from 'next/link';

import { AppIcon } from '@/components/ui/app-icon';
import { images } from '@/constants/images';

type Props = {
  name: string;
  streakDays: number;
};

/** Time-of-day greeting so the header always feels current. */
function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

/** Dashboard top bar. Phones: logo mark + greeting (opens Profile), streak pill, gear.
 *  Desktop: the sidebar already carries the logo, so the greeting becomes the page title. */
export function HomeHeader({ name, streakDays }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3 border-b border-rq-outline-variant/30 pb-4 lg:mb-8 lg:border-b-0 lg:pb-0">
      <Link href="/profile" aria-label="Open profile" className="flex min-w-0 items-center gap-3">
        <Image src={images.readiqMark} alt="" width={28} className="shrink-0 lg:hidden" />
        <div className="min-w-0">
          <p className="text-xs text-rq-on-surface-variant lg:text-sm">{greeting()}</p>
          <p className="truncate text-base leading-5 font-bold text-rq-primary lg:font-heading lg:text-3xl lg:leading-10 lg:font-extrabold">
            {name} 👋
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 rounded-pill bg-rq-surface-container px-3 py-1 lg:py-2">
          <AppIcon name="flame" size={14} filled className="text-rq-flame" />
          <span className="text-xs font-bold whitespace-nowrap text-rq-primary">{streakDays} day streak</span>
        </div>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container hover:text-rq-primary lg:hidden"
        >
          <AppIcon name="settings" size={20} />
        </Link>
      </div>
    </header>
  );
}
