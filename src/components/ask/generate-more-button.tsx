import { Loader2 } from 'lucide-react';

import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  /** A continuation is in flight — show a spinner and disable the tap. */
  busy?: boolean;
  /** Another answer is streaming — disable without the spinner. */
  disabled?: boolean;
  onPress: () => void;
};

/** Shown under a note-backed answer to pull in more; "Generating…" while busy. */
export function GenerateMoreButton({ busy, disabled, onPress }: Props) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      aria-busy={busy}
      onClick={onPress}
      className="flex items-center gap-2 self-start rounded-pill border border-rq-outline-variant bg-rq-surface-lowest px-3.5 py-2 text-[13px] font-semibold text-rq-primary transition hover:bg-rq-surface-low disabled:opacity-60"
    >
      {busy ? <Loader2 className="size-4 animate-spin" /> : <AppIcon name="add" size={16} />}
      {busy ? 'Generating…' : 'Generate more'}
    </button>
  );
}
