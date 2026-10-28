// Note Options actions for the web: share, export, duplicate, move, favourite,
// regenerate AI summary, delete. Grounding: the summary uses only the note text.

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { AiError } from '@/lib/ai';
import { summarizeNoteText } from '@/lib/summarize';
import { useNotesStore } from '@/store/use-notes-store';
import type { Note } from '@/types/note';

import { downloadText, noteToMarkdown, noteToText, printNote } from './note-export';

export type ExportFormat = 'pdf' | 'txt' | 'md';

const FAVORITES_KEY = 'favorite_notes';

function readFavorites(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function useNoteOptionActions(note: Note) {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const removeNote = useNotesStore((s) => s.removeNote);
  const [summarizing, setSummarizing] = useState(false);
  // Favourites are a per-browser convenience (not part of the note record).
  const [favorite, setFavoriteState] = useState(() => readFavorites().includes(note.id));

  const share = async () => {
    const text = noteToText(note);
    try {
      if (navigator.share) {
        await navigator.share({ title: note.title, text });
        return;
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return; // closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Note copied — paste it anywhere to share.');
    } catch {
      toast.error("Couldn't share or copy this note.");
    }
  };

  const exportAs = async (format: ExportFormat) => {
    if (format === 'txt') downloadText(note, 'txt', noteToText(note));
    else if (format === 'md') downloadText(note, 'md', noteToMarkdown(note));
    else if (!(await printNote(note))) toast.error('Allow pop-ups for readIQ to export as PDF.');
  };

  const duplicate = async () => {
    const copy = await addNote({
      title: `${note.title} (copy)`,
      subject: note.subject,
      content: note.content,
      contentHtml: note.contentHtml,
      source: note.source,
      tags: note.tags,
      attachments: note.attachments,
      aiSummary: note.aiSummary,
    });
    toast.success('Note duplicated.');
    router.push(`/note/${copy.id}`);
  };

  const moveTo = async (subject: string) => {
    await updateNote(note.id, { subject });
    toast.success(`Moved to ${subject}.`);
  };

  const setFavorite = (value: boolean) => {
    setFavoriteState(value);
    try {
      const next = readFavorites().filter((id) => id !== note.id);
      if (value) next.push(note.id);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // Blocked storage — the toggle still shows for this visit.
    }
  };

  const regenerateSummary = async () => {
    if (!note.content.trim()) {
      toast.error('This note has no text to summarize yet.');
      return;
    }
    setSummarizing(true);
    try {
      const summary = await summarizeNoteText(note.content);
      if (!summary) throw new Error('empty');
      await updateNote(note.id, { aiSummary: summary });
      toast.success('AI summary updated from your note.');
    } catch (err) {
      toast.error(err instanceof AiError ? err.friendly : "Couldn't write a summary right now. Please try again.");
    } finally {
      setSummarizing(false);
    }
  };

  const remove = async () => {
    // Leave first so this page never flashes its "note not found" state.
    router.replace('/memory');
    await removeNote(note.id);
    toast.success('Note deleted.');
  };

  return { share, exportAs, duplicate, moveTo, favorite, setFavorite, summarizing, regenerateSummary, remove };
}
