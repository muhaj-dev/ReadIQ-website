'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { GlassCard } from '@/components/profile/glass-card';
import { AppIcon } from '@/components/ui/app-icon';
import type { ProfileMenuItem, ProfileMenuTone } from '@/data/profile';
import { cn } from '@/lib/utils';

const TONE: Record<ProfileMenuTone, string> = {
  green: 'bg-rq-menu-green-well text-rq-menu-green',
  blue: 'bg-rq-menu-blue-well text-rq-menu-blue',
  orange: 'bg-rq-menu-orange-well text-rq-menu-orange',
  slate: 'bg-rq-menu-slate-well text-rq-menu-slate',
  purple: 'bg-rq-menu-purple-well text-rq-menu-purple',
};

const ROW =
  'flex w-full items-center justify-between gap-3 rounded-[24px] p-5 text-left transition hover:bg-rq-on-primary/5';

/** The glass action list (Study Sessions · Quiz Performance · …). */
export function ProfileMenu({ items }: { items: ProfileMenuItem[] }) {
  return (
    <GlassCard className="rounded-[32px] p-2">
      <ul>
        {items.map((item, index) => {
          const body = (
            <>
              <span className="flex items-center gap-4">
                <span className={cn('flex size-10 items-center justify-center rounded-inner', TONE[item.tone])}>
                  <AppIcon name={item.icon} size={22} />
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-[0.01em] text-rq-on-primary">{item.title}</span>
                  {item.subtitle ? (
                    <span className="block text-xs font-medium text-rq-on-primary-soft">{item.subtitle}</span>
                  ) : null}
                </span>
              </span>
              <AppIcon name="chevron-right" size={24} className="text-rq-on-primary-soft" />
            </>
          );
          return (
            <li key={item.id} className={cn(index > 0 && 'border-t border-rq-on-primary/10')}>
              {item.href ? (
                <Link href={item.href} className={ROW}>
                  {body}
                </Link>
              ) : (
                // Help & Support has no page yet — say so honestly instead of a dead tap.
                <button
                  type="button"
                  className={ROW}
                  onClick={() => toast(`${item.title} is coming soon.`)}
                >
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
