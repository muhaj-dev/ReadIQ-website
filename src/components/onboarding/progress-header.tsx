import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  /** Current onboarding step, 1-based. */
  step: number;
  total?: number;
  /** When set, a back arrow renders at the left of the header row. */
  onBack?: () => void;
};

/** Shared onboarding header: "n/3" label + segmented progress bars. */
export function ProgressHeader({ step, total = 3, onBack }: Props) {
  return (
    <div className="flex items-center gap-4 px-5 pt-3 pb-6 lg:px-8 lg:pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="-ml-2 flex size-11 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container"
        >
          <AppIcon name="arrow-back" size={20} />
        </button>
      ) : null}
      <p className="text-sm font-semibold text-rq-on-surface-variant" aria-label={`Step ${step} of ${total}`}>
        {step}/{total}
      </p>
      <div className="flex flex-1 gap-2" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn('h-1 flex-1 rounded-pill', i < step ? 'bg-rq-primary' : 'bg-rq-surface-variant')}
          />
        ))}
      </div>
    </div>
  );
}
