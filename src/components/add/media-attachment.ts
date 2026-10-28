// Turn a captured photo / recorded clip (already stored as an `idb:` blob) into a
// NoteAttachment, so Scan and Record notes keep their original media.

import { getBlob } from '@/lib/blob-store';
import { formatBytes } from '@/lib/files';
import type { NoteAttachment } from '@/types/note';

export async function mediaAttachment(uri: string, name: string, label: string): Promise<NoteAttachment> {
  let size = '';
  let mimeType: string | undefined;
  try {
    const blob = await getBlob(uri);
    size = formatBytes(blob.size);
    mimeType = blob.type || undefined;
  } catch {
    // Missing blob — still attach the reference; the card just shows no size.
  }
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    meta: size ? `${label} • ${size}` : label,
    uri,
    kind: mimeType?.startsWith('image/') || label === 'Image' ? 'image' : 'file',
    mimeType,
  };
}
