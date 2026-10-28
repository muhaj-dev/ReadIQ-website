import { cn } from '@/lib/utils';

type Props = {
  subjects: string[];
  /** The selected chip — 'All' or one of `subjects`. */
  active: string;
  onSelect: (subject: string) => void;
};

/** Subject filter pills (All · Biology · …). Scrolls sideways on phones, wraps on desktop. */
export function SubjectChips({ subjects, active, onSelect }: Props) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
      <div className="flex w-max gap-3 lg:w-auto lg:flex-wrap" role="group" aria-label="Filter by subject">
        {['All', ...subjects].map((subject) => {
          const selected = subject === active;
          return (
            <button
              key={subject}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(subject)}
              className={cn(
                'rounded-pill px-5 py-2 text-sm font-semibold whitespace-nowrap transition',
                selected
                  ? 'bg-rq-secondary text-rq-on-primary dark:text-rq-surface'
                  : 'bg-rq-surface-variant text-rq-on-surface-variant hover:bg-rq-surface-container-high',
              )}
            >
              {subject}
            </button>
          );
        })}
      </div>
    </div>
  );
}
