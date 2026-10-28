import { AppIcon } from '@/components/ui/app-icon';

type Props = { onPress: () => void };

/** Quiet opt-in for a general-knowledge answer from outside the notes. */
export function BeyondNotesButton({ onPress }: Props) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex items-center gap-1.5 self-start py-1 text-[13px] font-medium text-rq-on-surface-variant underline underline-offset-2 transition hover:text-rq-on-surface"
    >
      <AppIcon name="language" size={15} />
      Answer from outside your notes
    </button>
  );
}
