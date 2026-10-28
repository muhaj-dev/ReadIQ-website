'use client';

import { type Ref, useEffect, useImperativeHandle, useRef } from 'react';

import type { AnnotationMode } from '@/data/note-annotations';

import {
  makeCommentMark,
  makeHighlightMark,
  newCommentId,
  resolveStoredImages,
  sanitizeHtml,
  selectedText,
  serializeArticle,
  unwrap,
  wrapSelection,
} from './reader-dom';
import './reader.css';

/** Imperative DOM actions the reader view drives (undo/redo, comment cancel/delete). */
export type ReaderArticleHandle = {
  setHtml: (html: string) => void;
  removeMark: (cid: string) => void;
};

type Props = {
  ref?: Ref<ReaderArticleHandle>;
  /** Rendered once on mount; later changes flow through the DOM, not props. */
  initialHtml: string;
  mode: AnnotationMode;
  highlightColor: string;
  /** Text size multiplier (1 = 17px). */
  fontScale: number;
  onChangeHtml: (html: string) => void;
  onRequestComment: (cid: string, quote: string, html: string) => void;
  onOpenComment: (cid: string) => void;
};

const EMPTY_HTML = '<p><em>This note has no content yet.</em></p>';

/** The annotatable note body: highlights and comment anchors bake into the DOM as <mark>s. */
export function ReaderArticle({
  ref,
  initialHtml,
  mode,
  highlightColor,
  fontScale,
  onChangeHtml,
  onRequestComment,
  onOpenComment,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const urlsRef = useRef<string[]>([]);
  const downRef = useRef<{ x: number; y: number } | null>(null);
  // Latest props for the DOM event handler without re-binding it.
  const live = useRef({ mode, highlightColor, onChangeHtml, onRequestComment, onOpenComment });
  useEffect(() => {
    live.current = { mode, highlightColor, onChangeHtml, onRequestComment, onOpenComment };
  });

  const render = (html: string) => {
    const root = rootRef.current;
    if (!root) return;
    root.innerHTML = sanitizeHtml(html.trim() ? html : EMPTY_HTML);
    void resolveStoredImages(root).then((urls) => urlsRef.current.push(...urls));
  };

  // Mount: inject the note once. Unmount: free image object URLs.
  useEffect(() => {
    render(initialHtml);
    const urls = urlsRef.current; // same array for the component's life
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    setHtml: (html) => render(html),
    removeMark: (cid) => {
      const root = rootRef.current;
      const el = root?.querySelector(`mark[data-cid="${CSS.escape(cid)}"]`);
      if (!root || !el) return;
      unwrap(el);
      live.current.onChangeHtml(serializeArticle(root));
    },
  }));

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    const { clientX, clientY } = e;
    // Let the browser finish updating the selection first.
    window.setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      const { mode: m, highlightColor: color } = live.current;
      const quote = selectedText(root);
      if (quote) {
        if (m === 'highlight' && wrapSelection(root, makeHighlightMark(color))) {
          live.current.onChangeHtml(serializeArticle(root));
        } else if (m === 'comment') {
          const cid = newCommentId();
          if (wrapSelection(root, makeCommentMark(cid))) {
            live.current.onRequestComment(cid, quote, serializeArticle(root));
          }
        }
        return; // view mode: leave the selection for copying.
      }
      const down = downRef.current;
      if (down && (Math.abs(clientX - down.x) > 10 || Math.abs(clientY - down.y) > 10)) return;
      const cm = target.closest?.('mark[data-cid]');
      if (cm) {
        live.current.onOpenComment(cm.getAttribute('data-cid') ?? '');
        return;
      }
      const hl = m === 'highlight' ? target.closest?.('mark.hl') : null;
      if (hl) {
        unwrap(hl);
        live.current.onChangeHtml(serializeArticle(root));
      }
    }, 10);
  };

  return (
    <div
      ref={rootRef}
      data-mode={mode}
      className="rq-reader"
      style={{ fontSize: `${17 * fontScale}px` }}
      onPointerDown={(e) => {
        downRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={onPointerUp}
    />
  );
}
