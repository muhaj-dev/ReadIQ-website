import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  value: string;
  onChange: (text: string) => void;
};

/** Rounded search field above the note list — filters notes by title. */
export function MemorySearchBar({ value, onChange }: Props) {
  return (
    <label className="flex h-12 items-center gap-2 rounded-inner bg-rq-surface-low px-4 ring-rq-secondary-container/40 transition focus-within:ring-2">
      <AppIcon name="search" size={22} className="text-rq-outline" />
      <span className="sr-only">Search your notes</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your notes..."
        className="min-w-0 flex-1 bg-transparent text-base text-rq-on-surface outline-none placeholder:text-rq-outline"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="flex size-7 items-center justify-center rounded-pill text-rq-outline hover:bg-rq-surface-container"
        >
          <AppIcon name="close" size={16} />
        </button>
      ) : null}
    </label>
  );
}
