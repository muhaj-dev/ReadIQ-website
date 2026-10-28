'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { MemoryHeader } from '@/components/memory/memory-header';
import { MemorySearchBar } from '@/components/memory/memory-search-bar';
import { MemorySelectBar } from '@/components/memory/memory-select-bar';
import { NoteGrid } from '@/components/memory/note-grid';
import { SubjectChips } from '@/components/memory/subject-chips';
import { Page } from '@/components/shell/page';
import { toMemoryNote } from '@/lib/note-view';
import { useNotesStore } from '@/store/use-notes-store';

/** MEMORY — the Memory Panel: every saved note, searchable/filterable, with multi-select Share/Delete. */
export default function MemoryPage() {
  const storeNotes = useNotesStore((s) => s.notes);
  const removeNote = useNotesStore((s) => s.removeNote);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const cards = useMemo(() => storeNotes.map(toMemoryNote), [storeNotes]);
  const subjects = useMemo(() => [...new Set(cards.map((n) => n.subject))], [cards]);
  // A deleted subject's chip disappears — fall back to All rather than an empty list.
  const activeSubject = subject === 'All' || subjects.includes(subject) ? subject : 'All';

  const needle = query.trim().toLowerCase();
  const notes = cards.filter(
    (note) =>
      (activeSubject === 'All' || note.subject === activeSubject) &&
      note.title.toLowerCase().includes(needle),
  );

  const toggleSelectMode = () => {
    setSelectMode((on) => !on);
    setSelectedIds(new Set());
  };

  const toggleNote = (id: string) =>
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = notes.length > 0 && notes.every((n) => selectedIds.has(n.id));
  const selectAll = () => setSelectedIds(allSelected ? new Set() : new Set(notes.map((n) => n.id)));

  const shareSelected = async () => {
    const chosen = storeNotes.filter((n) => selectedIds.has(n.id));
    if (chosen.length === 0) return;
    const text = chosen.map((n) => `${n.title}\n\n${n.content}`.trim()).join('\n\n———\n\n');
    const title = chosen.length === 1 ? chosen[0].title : 'My notes';
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success(chosen.length === 1 ? 'Note copied to clipboard' : `${chosen.length} notes copied to clipboard`);
      }
    } catch {
      // Share sheet dismissed or clipboard blocked — nothing to recover.
    }
  };

  const deleteSelected = async () => {
    const ids = [...selectedIds];
    await Promise.all(ids.map((id) => removeNote(id)));
    toast.success(ids.length === 1 ? 'Note deleted' : `${ids.length} notes deleted`);
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  return (
    <Page width="wide" className={selectMode ? 'pb-48 lg:pb-32' : undefined}>
      <MemoryHeader noteCount={storeNotes.length} selectMode={selectMode} onToggleSelect={toggleSelectMode} />

      {storeNotes.length > 0 ? (
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-6">
          <div className="lg:w-96 lg:shrink-0">
            <MemorySearchBar value={query} onChange={setQuery} />
          </div>
          <div className="min-w-0 lg:flex-1">
            <SubjectChips subjects={subjects} active={activeSubject} onSelect={setSubject} />
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <NoteGrid
          notes={notes}
          libraryEmpty={storeNotes.length === 0}
          selectMode={selectMode}
          selectedIds={selectedIds}
          onToggle={toggleNote}
          onClearFilters={() => {
            setQuery('');
            setSubject('All');
          }}
        />
      </div>

      {selectMode ? (
        <MemorySelectBar
          count={selectedIds.size}
          allSelected={allSelected}
          onSelectAll={selectAll}
          onShare={shareSelected}
          onDelete={deleteSelected}
        />
      ) : null}
    </Page>
  );
}
