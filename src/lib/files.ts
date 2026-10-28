// File helpers for the web. The browser hands us File objects (from an
// <input type="file">, drag-drop, webcam, or MediaRecorder); we persist them in
// IndexedDB (lib/blob-store.ts) and describe them as NoteAttachments — the same
// shape the mobile app used, with an `idb:` uri instead of file://.

import type { NoteAttachment } from '@/types/note';

import { blobToBase64, getBlob, putBlob } from './blob-store';

/** `accept` strings for file inputs. */
export const ACCEPT_EXTRACTABLE =
  '.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const ACCEPT_ANY_DOC = `${ACCEPT_EXTRACTABLE},.doc,.txt,application/msword,text/plain`;
export const ACCEPT_IMAGES = 'image/*';

/** Largest file the AI routes accept (the Vercel request-body limit is ~4.5 MB). */
export const MAX_AI_FILE_BYTES = 4 * 1024 * 1024;

export function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const extensionLabel = (name: string) => {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toUpperCase() : 'FILE';
};

const attachmentId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** True for a PDF. Checks MIME first, then name/meta. */
export function isPdf(attachment: NoteAttachment): boolean {
  return (
    /pdf/i.test(attachment.mimeType ?? '') ||
    /\.pdf$/i.test(attachment.name) ||
    /^pdf\b/i.test(attachment.meta)
  );
}

/** True for a .docx (a zip unpacked locally — no AI call). Legacy .doc is excluded. */
export function isDocx(attachment: NoteAttachment): boolean {
  return /wordprocessingml\.document/i.test(attachment.mimeType ?? '') || /\.docx$/i.test(attachment.name);
}

/** Read any stored uri (idb:, data:, blob:) into raw base64 — what Gemini and jszip want. */
export async function fileUriToBase64(uri: string): Promise<string> {
  return blobToBase64(await getBlob(uri));
}

/** Read any stored uri into a base64 data URI (inline images in the rich editor). */
export async function fileUriToDataUri(uri: string, mimeType?: string): Promise<string> {
  const blob = await getBlob(uri);
  return `data:${mimeType ?? (blob.type || 'application/octet-stream')};base64,${await blobToBase64(blob)}`;
}

/** Persist one picked File as a note attachment (kind from its MIME type). */
export async function fileToAttachment(file: File): Promise<NoteAttachment> {
  const uri = await putBlob(file);
  const isImage = file.type.startsWith('image/');
  const size = formatBytes(file.size);
  const label = isImage ? 'Image' : extensionLabel(file.name);
  return {
    id: attachmentId(),
    name: file.name || (isImage ? 'Image' : 'File'),
    meta: size ? `${label} • ${size}` : label,
    uri,
    kind: isImage ? 'image' : 'file',
    mimeType: file.type || undefined,
  };
}

/** Persist several picked Files as attachments, preserving order. */
export async function filesToAttachments(files: FileList | File[]): Promise<NoteAttachment[]> {
  const list = Array.from(files);
  const out: NoteAttachment[] = [];
  for (const file of list) out.push(await fileToAttachment(file));
  return out;
}

/** Open the browser's file picker programmatically; resolves [] if cancelled. */
export function pickFiles(options: { accept: string; multiple?: boolean; capture?: 'user' | 'environment' }): Promise<File[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept;
    input.multiple = !!options.multiple;
    if (options.capture) input.setAttribute('capture', options.capture);
    input.onchange = () => resolve(input.files ? Array.from(input.files) : []);
    input.oncancel = () => resolve([]);
    input.click();
  });
}

/** Pick document attachments; `extractableOnly` limits to PDF + .docx (the Upload flow). */
export async function pickFileAttachments(options?: { extractableOnly?: boolean }): Promise<NoteAttachment[]> {
  const files = await pickFiles({
    accept: options?.extractableOnly ? ACCEPT_EXTRACTABLE : ACCEPT_ANY_DOC,
    multiple: true,
  });
  return filesToAttachments(files);
}

/** Pick image attachments from the device. */
export async function pickImageAttachments(): Promise<NoteAttachment[]> {
  return filesToAttachments(await pickFiles({ accept: ACCEPT_IMAGES, multiple: true }));
}

/** Pick one image as a base64 data URI for inline insertion in the rich editor. */
export async function pickInlineImageDataUri(): Promise<string | null> {
  const [file] = await pickFiles({ accept: ACCEPT_IMAGES });
  if (!file) return null;
  return `data:${file.type || 'image/jpeg'};base64,${await blobToBase64(file)}`;
}
