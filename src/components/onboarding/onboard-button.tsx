import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  /** 'filled' = solid indigo CTA · 'outline' = bordered secondary (Back). */
  variant?: 'filled' | 'outline';
  /** Filled tone: 'container' (Get Started / Continue) or 'primary' (Save to memory). */
  tone?: 'container' | 'primary';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
};

/** Onboarding button — 52px tall, matching the mobile CTA. */
export function OnboardButton({
  children,
  onClick,
  variant = 'filled',
  tone = 'container',
  disabled = false,
  type = 'button',
  className,
}: Props) {
  const filled = variant === 'filled';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex min-h-[52px] items-center justify-center rounded-btn px-4 text-sm font-semibold tracking-[0.01em] transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        filled
          ? cn(
              'text-rq-on-primary shadow-soft enabled:hover:opacity-90',
              // In dark mode the deep indigo tokens lighten, so use the FAB indigo there.
              tone === 'primary' ? 'bg-rq-profile-top dark:bg-rq-fab' : 'bg-rq-primary-container dark:bg-rq-fab',
            )
          : 'border border-rq-outline-variant text-rq-on-surface-variant enabled:hover:bg-rq-surface-low',
        className,
      )}
    >
      {children}
    </button>
  );
}
