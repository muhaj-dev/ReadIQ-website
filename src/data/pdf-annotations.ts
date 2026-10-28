// PDF Reader annotation state for the web: active tool, highlight colour, the
// geometry-based highlights/comments (normalized page rects — see types/note.ts),
// and the comment draft/open editor. Every change persists to the note via
// useNotesStore.updateNote({ pdfAnnotations }).

import { useCallback, useRef, useState } from 'react';

import { ReaderHighlights } from '@/constants/theme';
import type { AnnotationMode } from '@/data/note-annotations';
import type { NoteDetail } from '@/data/note-detail';
import { useNotesStore } from '@/store/use-notes-store';
import type { PdfAnnotations, PdfRect } from '@/types/note';

const EMPTY: PdfAnnotations = { highlights: [], comments: [] };

/** A text selection on one PDF page, as normalized rects. */
export type PdfSelection = { page: number; rects: PdfRect[]; quote: string };
/** A new comment awaiting a body; drawn on the page until saved or cancelled. */
export type PdfCommentDraft = PdfSelection & { id: string };
/** An existing comment opened to read / edit / delete. */
export type PdfOpenComment = { id: string; quote: string; body: string; createdAt: string };

function newId(): string {
  return `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function usePdfAnnotations(note: NoteDetail) {
  const updateNote = useNotesStore((s) => s.updateNote);

  const [annotations, setAnnotations] = useState<PdfAnnotations>(note.pdfAnnotations ?? EMPTY);
  // Mirror so chained callbacks always build on the latest set.
  const annRef = useRef(annotations);
  const [mode, setMode] = useState<AnnotationMode>('view');
  const [highlightColor, setHighlightColor] = useState<string>(ReaderHighlights[0]);
  const [draft, setDraft] = useState<PdfCommentDraft | null>(null);
  const [opened, setOpened] = useState<PdfOpenComment | null>(null);

  const commit = useCallback(
    (next: PdfAnnotations) => {
      annRef.current = next;
      setAnnotations(next);
      void updateNote(note.id, { pdfAnnotations: next });
    },
    [note.id, updateNote],
  );

  const addHighlight = useCallback(
    (sel: PdfSelection) => {
      const cur = annRef.current;
      commit({
        ...cur,
        highlights: [
          ...cur.highlights,
          { id: newId(), color: highlightColor, createdAt: new Date().toISOString(), ...sel },
        ],
      });
    },
    [commit, highlightColor],
  );

  const eraseHighlight = useCallback(
    (id: string) => {
      const cur = annRef.current;
      commit({ ...cur, highlights: cur.highlights.filter((h) => h.id !== id) });
    },
    [commit],
  );

  const requestComment = useCallback((sel: PdfSelection) => setDraft({ id: newId(), ...sel }), []);

  const openComment = useCallback((id: string) => {
    const c = annRef.current.comments.find((x) => x.id === id);
    if (c) setOpened({ id: c.id, quote: c.quote, body: c.body, createdAt: c.createdAt });
  }, []);

  /** Save the draft as a new comment, or the opened comment's edited body. */
  const saveComment = useCallback(
    (body: string) => {
      const cur = annRef.current;
      const text = body.trim();
      if (draft) {
        const { id, page, rects, quote } = draft;
        commit({
          ...cur,
          comments: [...cur.comments, { id, page, rects, quote, body: text, createdAt: new Date().toISOString() }],
        });
        setDraft(null);
      } else if (opened) {
        commit({ ...cur, comments: cur.comments.map((c) => (c.id === opened.id ? { ...c, body: text } : c)) });
        setOpened(null);
      }
    },
    [commit, draft, opened],
  );

  const deleteComment = useCallback(() => {
    if (!opened) return;
    const cur = annRef.current;
    commit({ ...cur, comments: cur.comments.filter((c) => c.id !== opened.id) });
    setOpened(null);
  }, [commit, opened]);

  /** Close the editor; a draft (no body yet) is simply dropped. */
  const cancelComment = useCallback(() => {
    setDraft(null);
    setOpened(null);
  }, []);

  return {
    annotations,
    mode,
    setMode,
    highlightColor,
    setHighlightColor,
    draft,
    opened,
    addHighlight,
    eraseHighlight,
    requestComment,
    openComment,
    saveComment,
    deleteComment,
    cancelComment,
  };
}
