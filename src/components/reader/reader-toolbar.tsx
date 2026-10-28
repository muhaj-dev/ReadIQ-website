'use client';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import type { AnnotationMode } from '@/data/note-annotations';
import { cn } from '@/lib/utils';

type Props = {
  mode: AnnotationMode;
  /** Toggle a tool on, or back to plain reading when clicked while active. */
  onSetMode: (mode: AnnotationMode) => void;
  onListen: () => void;
  /** Optional text-size tool (Note Reader only); opens the size control. */
  onTextSize?: () => void;
  textSizeOpen?: boolean;
};

/** Floating pill over the readers: text size, highlight, comment, and Broadcast. */
export function ReaderToolbar({ mode, onSetMode, onListen, onTextSize, textSizeOpen = false }: Props) {
  const toggle = (target: AnnotationMode) => () => onSetMode(mode === target ? 'view' : target);

  return (
    <div className="flex items-center justify-around rounded-pill border border-rq-outline-variant/20 bg-rq-surface-lowest px-4 py-2 shadow-soft">
      {onTextSize ? <Tool icon="text-fields" label="Text size" active={textSizeOpen} onClick={onTextSize} /> : null}
      <Tool icon="edit" label="Highlight" active={mode === 'highlight'} onClick={toggle('highlight')} />
      <Tool icon="comment" label="Comment" active={mode === 'comment'} onClick={toggle('comment')} />
      <Tool icon="headphones" label="Broadcast" active={false} onClick={onListen} />
    </div>
  );
}

function Tool({
  icon,
  label,
  active,
  onClick,
}: {
  icon: AppIconName;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="group flex flex-col items-center gap-1 px-2 outline-none"
    >
      <span
        className={cn(
          'flex size-11 items-center justify-center rounded-pill transition group-focus-visible:ring-2 group-focus-visible:ring-rq-secondary',
          active
            ? 'bg-rq-secondary-container text-rq-on-primary'
            : 'text-rq-on-surface-variant group-hover:bg-rq-surface-low',
        )}
      >
        <AppIcon name={icon} size={22} />
      </span>
      <span className={cn('text-[11px] font-medium', active ? 'text-rq-primary' : 'text-rq-on-surface-variant')}>
        {label}
      </span>
    </button>
  );
}
