import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  value: string;
  onPress: () => void;
  /** Accessible name, e.g. "Subject". */
  label: string;
  /** Subject rows lead with a small indigo dot. */
  dot?: boolean;
};

/** Dropdown-style row: current value + expand chevron, opens an OptionSheet. */
export function SelectRow({ value, onPress, label, dot = false }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`${label}: ${value}`}
      aria-haspopup="dialog"
      className="flex h-12 w-full items-center justify-between rounded-lg bg-rq-surface-lowest px-4 text-left shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition hover:bg-rq-surface-low focus-visible:outline-2 focus-visible:outline-rq-secondary-container"
    >
      <span className="flex min-w-0 items-center gap-3">
        {dot ? <span className="size-2.5 shrink-0 rounded-pill bg-rq-secondary-container" /> : null}
        <span className="truncate text-base text-rq-on-surface">{value}</span>
      </span>
      <AppIcon name="expand-more" size={20} className="text-rq-outline" />
    </button>
  );
}
