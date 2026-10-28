import { forwardRef } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';
import type { PodcastSpeaker } from '@/types/podcast';

import { HOST_ACCENT } from './host-accent';

type Props = {
  speaker: PodcastSpeaker;
  name: string;
  text: string;
  /** The turn currently being spoken — pops out so the read-along is obvious. */
  active: boolean;
  onClick: () => void;
};

/** One turn of the two-host conversation as a chat bubble; clicking seeks to it. */
export const HostTurn = forwardRef<HTMLDivElement, Props>(function HostTurn(
  { speaker, name, text, active, onClick },
  ref,
) {
  const accent = HOST_ACCENT[speaker];
  const right = speaker === 'A';

  return (
    <div ref={ref} className={cn('flex flex-col', right ? 'items-end' : 'items-start')}>
      <div className={cn('mb-1 flex items-center gap-1.5 px-1', right && 'flex-row-reverse')}>
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded-pill font-heading text-[11px] font-bold text-rq-on-primary',
            accent.bg,
          )}
        >
          {name.charAt(0)}
        </span>
        <span className={cn('text-xs font-bold tracking-wide', accent.text)}>{name}</span>
        {active ? <AppIcon name="headphones" size={13} className={accent.text} /> : null}
      </div>

      <button
        type="button"
        aria-label={`${name}${active ? ', now reading' : ''}: ${text}`}
        aria-current={active ? 'true' : undefined}
        onClick={onClick}
        className={cn(
          'max-w-[86%] rounded-card text-left transition-all duration-300',
          right ? 'rounded-tr-[4px] bg-rq-secondary-container text-rq-on-primary' : 'rounded-tl-[4px] bg-rq-surface-lowest',
          !right && (active ? 'text-rq-on-surface' : 'text-rq-on-surface-variant'),
          active ? 'px-5 py-4 text-lg leading-[27px] shadow-lg' : 'px-4 py-3 text-[15px] leading-[23px] shadow-soft',
          active && (right ? 'origin-right scale-[1.04]' : 'origin-left scale-[1.03]'),
        )}
      >
        {text}
      </button>
    </div>
  );
});
