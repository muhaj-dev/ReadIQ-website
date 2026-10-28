'use client';

// Upload-flow state: picked documents → extracted text (PDF via Gemini, .docx
// locally) → best-effort summary. picking → reading → summarizing → ready | error.

import { useState } from 'react';

import { AiError } from '@/lib/ai';
import { extractDocumentsText, isExtractable } from '@/lib/document-extract';
import { filesToAttachments } from '@/lib/files';
import { summarizeNoteText } from '@/lib/summarize';
import type { NoteAttachment } from '@/types/note';

export type UploadStatus = 'picking' | 'reading' | 'summarizing' | 'error' | 'ready';

export function useDocumentUpload() {
  const [status, setStatus] = useState<UploadStatus>('picking');
  const [attachments, setAttachments] = useState<NoteAttachment[]>([]);
  const [content, setContent] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  const extract = async (files: NoteAttachment[]) => {
    setStatus('reading');
    setError(undefined);
    let text = '';
    try {
      text = await extractDocumentsText(files);
    } catch (err) {
      setError(err instanceof AiError ? err.friendly : 'We could not read the text from that file.');
      setStatus('error');
      return;
    }
    // Extraction worked but found nothing — don't silently save a blank note.
    if (!text.trim()) {
      setError("We couldn't find readable text in that document. Add it as an attachment and type your notes, or try again.");
      setStatus('error');
      return;
    }
    setContent(text);
    setStatus('summarizing');
    try {
      setAiSummary((await summarizeNoteText(text)) || null);
    } catch {
      setAiSummary(null); // best-effort
    }
    setStatus('ready');
  };

  /** Accept picked/dropped files: keep PDFs + .docx (others are rejected with a hint). */
  const accept = async (files: File[]) => {
    if (!files.length) return;
    const picked = await filesToAttachments(files);
    const usable = picked.filter(isExtractable);
    if (!usable.length) {
      setError('Choose a PDF or Word (.docx) file — those are the formats we can read.');
      return;
    }
    setError(undefined);
    setAttachments(usable);
    void extract(usable);
  };

  return {
    status,
    attachments,
    content,
    aiSummary,
    error,
    accept,
    retry: () => extract(attachments),
    /** Keep the files without text (the student types notes later). */
    skip: () => setStatus('ready'),
    reset: () => {
      setStatus('picking');
      setAttachments([]);
      setError(undefined);
    },
  };
}
