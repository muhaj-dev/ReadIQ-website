// PDF-attachment helpers for the PDF Reader: find a note's PDF and load its bytes
// (pdf.js decodes them in the browser — the file never leaves the device).

import { getBlob } from '@/lib/blob-store';
import { isPdf } from '@/lib/files';
import type { NoteAttachment } from '@/types/note';

/** The note's first PDF attachment, or null. Drives the "PDF Reader" button. */
export function firstPdf(attachments: NoteAttachment[]): NoteAttachment | null {
  return attachments.find(isPdf) ?? null;
}

/** Read the PDF's raw bytes for pdf.js `getDocument({ data })`. */
export async function readPdfBytes(attachment: NoteAttachment): Promise<Uint8Array> {
  const blob = await getBlob(attachment.uri);
  return new Uint8Array(await blob.arrayBuffer());
}
