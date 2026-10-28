'use client';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

type Props = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

/** Undo/redo pill in the reader; buttons dim when there's nothing left to step. */
export function ReaderHistoryBar({ canUndo, canRedo, onUndo, onRedo }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-pill border border-rq-outline-variant/20 bg-rq-surface-lowest p-1 shadow-soft">
      <HistoryButton icon="undo" label="Undo" enabled={canUndo} onClick={onUndo} />
      <span className="h-5 w-px bg-rq-outline-variant/30" />
      <HistoryButton icon="redo" label="Redo" enabled={canRedo} onClick={onRedo} />
    </div>
  );
}

function HistoryButton({
  icon,
  label,
  enabled,
  onClick,
}: {
  icon: AppIconName;
  label: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!enabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-low disabled:text-rq-outline-variant/60 disabled:hover:bg-transparent"
    >
      <AppIcon name={icon} size={20} />
    </button>
  );
}
