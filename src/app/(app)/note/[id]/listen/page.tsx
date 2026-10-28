'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { IconAction, NoteHeader } from '@/components/note/note-header';
import { NoteMissing } from '@/components/note/note-missing';
import { EpisodeGate } from '@/components/podcast/episode-gate';
import { EpisodePlayer } from '@/components/podcast/episode-player';
import { AppIcon } from '@/components/ui/app-icon';
import { useNotesStore } from '@/store/use-notes-store';
import { usePodcastStore } from '@/store/use-podcast-store';

/** "From Your Notes" — the note's two-host podcast episode, scripted only from this note and cached. */
export default function ListenPage() {
  const { id } = useParams<{ id: string }>();
  const noteId = id ?? '';

  const note = useNotesStore((s) => s.notes.find((n) => n.id === noteId));
  const episode = usePodcastStore((s) => s.episodes[noteId]);
  const status = usePodcastStore((s) => s.status[noteId]) ?? 'idle';
  const error = usePodcastStore((s) => s.error[noteId]) ?? '';
  const load = usePodcastStore((s) => s.load);
  const generate = usePodcastStore((s) => s.generate);
  const isFresh = usePodcastStore((s) => s.isFresh);

  // Read the cached episode on open (no model call).
  useEffect(() => {
    if (noteId) void load(noteId);
  }, [noteId, load]);

  if (!note) return <NoteMissing title="From Your Notes" />;

  const ready = status === 'ready' && !!episode && episode.turns.length > 0;
  const onGenerate = () => void generate(note);
  const stale = ready && !isFresh(note);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-5 lg:px-10 lg:pt-10">
      <NoteHeader
        title="From Your Notes"
        back={`/note/${note.id}`}
        actions={ready ? <IconAction icon="replay" label="Regenerate episode" onClick={onGenerate} /> : null}
      />

      {stale ? (
        <button
          type="button"
          onClick={onGenerate}
          className="mb-5 flex w-full items-center gap-3 rounded-inner border border-rq-secondary/30 bg-rq-secondary/10 p-3 text-left text-[13px] font-medium text-rq-secondary transition hover:bg-rq-secondary/15"
        >
          <AppIcon name="auto-awesome" size={18} />
          <span className="flex-1">You&apos;ve edited this note since the episode was made. Click to rewrite it.</span>
        </button>
      ) : null}

      {ready ? (
        <EpisodePlayer key={episode.createdAt} episode={episode} noteTitle={note.title} />
      ) : (
        <EpisodeGate status={status} error={error} onGenerate={onGenerate} />
      )}
    </div>
  );
}
