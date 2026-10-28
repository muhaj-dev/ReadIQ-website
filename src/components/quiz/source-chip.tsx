import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  /** The subject/course the quiz was drawn from. */
  label: string;
};

/** Grounding proof pill: "From your notes · <subject>". */
export function SourceChip({ label }: Props) {
  return (
    <div className="flex max-w-full items-center gap-1.5 self-center rounded-pill bg-rq-secondary/10 px-3 py-1.5 text-rq-secondary">
      <AppIcon name="auto-awesome" size={14} filled />
      <span className="max-w-64 truncate text-xs font-semibold">From your notes · {label}</span>
    </div>
  );
}
