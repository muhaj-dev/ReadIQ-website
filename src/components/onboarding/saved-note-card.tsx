import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  /** The note text being drafted — word count derives from it live. */
  text: string;
  /** The student's chosen save name; falls back to the note's first line. */
  title?: string;
};

/** "Note landing in memory" preview: arrow into a saved-note card, fades in. */
export function SavedNoteCard({ text, title }: Props) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const displayTitle = title?.trim() ? title.trim() : deriveTitle(text);

  return (
    <div className="flex animate-in flex-col items-center px-5 duration-500 fade-in slide-in-from-bottom-3 lg:px-8">
      <span className="mb-2 flex h-6 items-center justify-center text-rq-outline-variant">
        <AppIcon name="arrow-downward" size={16} />
      </span>
      <div className="flex w-full items-center justify-between rounded-inner border border-rq-outline-variant/30 bg-rq-surface-lowest p-3 shadow-soft">
        <div className="flex min-w-0 flex-1 items-center gap-3 pr-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rq-surface-variant text-rq-primary">
            <AppIcon name="description" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-rq-on-surface">{displayTitle}</p>
            <p className="mt-0.5 text-xs font-medium text-rq-outline">
              Just now • {words} {words === 1 ? 'word' : 'words'}
            </p>
          </div>
        </div>
        <span className="flex size-8 items-center justify-center rounded-pill bg-rq-surface-low text-rq-quiz-check">
          <AppIcon name="check-circle" size={18} />
        </span>
      </div>
    </div>
  );
}

/** First line of the note, cut at a word boundary so the card title stays short. */
function deriveTitle(text: string): string {
  const line = text.trim().split('\n')[0];
  if (line.length <= 26) return line;
  const cut = line.slice(0, 26);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 10 ? lastSpace : 26)}…`;
}
