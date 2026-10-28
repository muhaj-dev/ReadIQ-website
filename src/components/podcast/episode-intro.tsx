import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';
import { HOSTS, type PodcastCoverage, type PodcastSpeaker } from '@/types/podcast';

import { HOST_ACCENT } from './host-accent';

type Props = {
  title: string;
  noteTitle: string;
  coverage: PodcastCoverage;
  /** Opens the voice picker (a browser voice per host + speaking speed). */
  onEditVoices?: () => void;
};

function HostChip({ speaker, role }: { speaker: PodcastSpeaker; role: string }) {
  const name = HOSTS[speaker];
  return (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-pill font-heading text-xs font-bold text-rq-on-primary',
          HOST_ACCENT[speaker].bg,
        )}
      >
        {name.charAt(0)}
      </span>
      <span className="text-[13px] font-medium text-rq-on-surface-variant">
        {name} · {role}
      </span>
    </span>
  );
}

/** Episode header: eyebrow, title, source note, hosts, and a thin-note banner. */
export function EpisodeIntro({ title, noteTitle, coverage, onEditVoices }: Props) {
  return (
    <div className="grid gap-4 pb-4">
      <div className="grid gap-1.5">
        <p className="text-[11px] font-bold tracking-wider text-rq-secondary">FROM YOUR NOTES · BROADCAST</p>
        <h2 className="font-heading text-[26px] leading-8 font-bold text-rq-on-surface">{title}</h2>
        <p className="truncate text-[13px] font-medium text-rq-on-surface-variant">Made from your note: {noteTitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <HostChip speaker="A" role="asks" />
        <HostChip speaker="B" role="explains" />
      </div>

      {onEditVoices ? (
        <button
          type="button"
          onClick={onEditVoices}
          className="flex w-fit items-center gap-1.5 rounded-pill bg-rq-secondary/10 px-3 py-1.5 text-[13px] font-semibold text-rq-secondary transition hover:bg-rq-secondary/15"
        >
          <AppIcon name="settings" size={15} />
          Change voices
        </button>
      ) : null}

      {coverage === 'partial' ? (
        <div className="flex gap-2 rounded-inner border border-rq-error/10 bg-rq-error-container/40 p-3 text-[13px] font-medium text-rq-error">
          <AppIcon name="warning" size={18} />
          <p>This note is only a few lines so far — add more to it for a fuller episode.</p>
        </div>
      ) : null}
    </div>
  );
}
