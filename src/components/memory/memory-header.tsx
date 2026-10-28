import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  noteCount: number;
  /** True while the student is selecting notes. */
  selectMode: boolean;
  onToggleSelect: () => void;
};

/** Memory Panel header: title, live note count, and the Select toggle. */
export function MemoryHeader({ noteCount, selectMode, onToggleSelect }: Props) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-[26px] leading-8 font-bold text-rq-on-surface lg:text-3xl lg:font-extrabold">
          Memory
        </h1>
        <p className="mt-2 text-sm font-semibold text-rq-on-surface-variant">
          {noteCount === 0 ? 'Nothing saved yet' : `All Notes · ${noteCount} saved`}
        </p>
      </div>

      {noteCount > 0 ? (
        <button
          type="button"
          onClick={onToggleSelect}
          aria-pressed={selectMode}
          className={cn(
            'flex h-10 items-center gap-2 rounded-pill border px-3 text-sm font-semibold transition',
            selectMode
              ? 'border-rq-fab bg-rq-fab text-rq-on-primary'
              : 'border-rq-outline-variant/70 text-rq-on-surface-variant hover:bg-rq-surface-low',
          )}
        >
          <span
            className={cn(
              'flex size-5 items-center justify-center rounded-md border-[1.5px]',
              selectMode ? 'border-rq-on-primary' : 'border-rq-outline-variant',
            )}
          >
            {selectMode ? <AppIcon name="check" size={13} /> : null}
          </span>
          {selectMode ? 'Done' : 'Select'}
        </button>
      ) : null}
    </header>
  );
}
