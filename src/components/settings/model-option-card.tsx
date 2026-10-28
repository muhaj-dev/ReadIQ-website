import { AppIcon } from '@/components/ui/app-icon';
import type { AiModel } from '@/data/ai-models';
import { cn } from '@/lib/utils';

type Props = {
  model: AiModel;
  selected: boolean;
  onSelect: () => void;
};

/** One selectable AI-model card: name + provider · description, with a check when active. */
export function ModelOptionCard({ model, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex h-full w-full items-center gap-4 rounded-card bg-rq-surface-lowest p-4 text-left transition',
        selected
          ? 'border-2 border-rq-primary'
          : 'border border-rq-outline-variant/50 hover:border-rq-outline-variant',
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-base font-bold text-rq-on-surface">{model.label}</span>
          {model.recommended ? (
            <span className="rounded-pill bg-rq-primary/12 px-2 py-0.5 text-[11px] font-semibold tracking-[0.02em] text-rq-primary">
              Recommended
            </span>
          ) : null}
        </span>
        <span className="text-xs font-semibold tracking-[0.02em] text-rq-on-surface-variant">{model.provider}</span>
        <span className="text-[13px] leading-[18px] text-rq-on-surface-variant">{model.description}</span>
      </span>
      <AppIcon
        name="check-circle"
        size={24}
        className={selected ? 'text-rq-primary' : 'text-rq-outline-variant/60'}
      />
    </button>
  );
}
