import Link from 'next/link';

import { NoteCard } from '@/components/memory/note-card';
import { EmptyState } from '@/components/shell/page';
import { Button } from '@/components/ui/button';
import type { MemoryNote } from '@/data/memory-notes';

type Props = {
  notes: MemoryNote[];
  /** True when the student has no notes at all (vs. a filter with no matches). */
  libraryEmpty: boolean;
  selectMode: boolean;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onClearFilters: () => void;
};

/** The Memory Panel grid — one card per saved note (1 / 2 / 3 columns), or an empty state. */
export function NoteGrid({ notes, libraryEmpty, selectMode, selectedIds, onToggle, onClearFilters }: Props) {
  if (libraryEmpty) {
    return (
      <EmptyState
        icon="psychology"
        title="No notes yet — add your first one!"
        body="Paste it, upload it, snap a photo, or record your class. Everything you save shows up here."
        action={
          <Button nativeButton={false} render={<Link href="/add" />} className="h-11 rounded-btn px-5 text-sm font-semibold">
            Add a note
          </Button>
        }
      />
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No notes found"
        body="Try a different search or subject."
        action={
          <Button variant="outline" onClick={onClearFilters} className="h-10 rounded-btn px-4">
            Clear filters
          </Button>
        }
      />
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard
            note={note}
            selectable={selectMode}
            selected={selectedIds.has(note.id)}
            onToggle={() => onToggle(note.id)}
          />
        </li>
      ))}
    </ul>
  );
}
