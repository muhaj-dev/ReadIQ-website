import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/** Frosted "glass" surface used on the indigo profile panel (white @8% + hairline). */
export function GlassCard({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('border border-rq-on-primary/10 bg-rq-on-primary/8 backdrop-blur-sm', className)}
      {...props}
    />
  );
}
