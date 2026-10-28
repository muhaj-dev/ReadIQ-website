import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

type Props = {
  icon: AppIconName;
  title: string;
  description: string;
};

/** One value-proposition row on the Welcome screen: icon circle + title + blurb. */
export function ValuePropRow({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-secondary">
        <AppIcon name={icon} size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-semibold text-rq-on-surface">{title}</p>
        <p className="text-sm text-rq-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
