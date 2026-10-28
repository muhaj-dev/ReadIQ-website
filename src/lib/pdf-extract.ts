// PDF → text via Gemini: the PDF bytes are sent inline as `application/pdf`, which
// Gemini reads natively (text, tables, and scanned pages). Its text becomes the
// note body; extract once and persist.

import type { NoteAttachment } from '@/types/note';

import { AiError } from './ai';
import { blobToBase64, getBlob } from './blob-store';
import { isPdf, MAX_AI_FILE_BYTES } from './files';
import { geminiReadFile } from './gemini';

const EXTRACT_PROMPT =
  'Extract ALL of the readable text from this document exactly as written. ' +
  'Preserve headings, lists, and paragraph breaks. Do not summarize, translate, ' +
  'add commentary, or wrap the output in markdown code fences. Return only the text.';

/** Extract a single PDF's full text via Gemini (may be empty). Throws AiError / Error. */
export async function extractPdfText(attachment: NoteAttachment): Promise<string> {
  const blob = await getBlob(attachment.uri);
  // Base64 inflates by ~1/3 — keep the encoded body under the server's request limit.
  if (blob.size > MAX_AI_FILE_BYTES * 0.75) throw new AiError('too-large');
  const text = await geminiReadFile(EXTRACT_PROMPT, await blobToBase64(blob), 'application/pdf', 16000);
  if (!text) console.warn('[pdf-extract] Gemini returned no text for', attachment.name);
  return text;
}

/** Extract and join text from every PDF in a set (non-PDFs ignored); '' when none. */
export async function extractPdfsText(attachments: NoteAttachment[]): Promise<string> {
  const pdfs = attachments.filter(isPdf);
  if (pdfs.length === 0) return '';

  const parts: string[] = [];
  for (const pdf of pdfs) {
    const text = await extractPdfText(pdf);
    if (text) parts.push(text);
  }
  return parts.join('\n\n');
}
