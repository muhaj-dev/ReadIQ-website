import { AppIcon } from '@/components/ui/app-icon';

/** Commenter avatar in the readers — a filled indigo circle for "You". */
export function CommentAvatar({ size = 34 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-pill bg-rq-secondary text-rq-on-primary"
      style={{ width: size, height: size }}
    >
      <AppIcon name="person" size={Math.round(size * 0.62)} filled />
    </span>
  );
}
