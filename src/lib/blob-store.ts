// File storage for the web: picked/captured files live as Blobs in IndexedDB and
// are referenced everywhere (NoteAttachment.uri, ChatAttachment.uri) by an
// `idb:<id>` uri — the web stand-in for the mobile app's file:// uris. Unlike a
// `blob:` URL, an `idb:` uri survives page reloads.

import { useEffect, useState } from 'react';

import { getDb } from './db';

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Persist a Blob/File and return its durable `idb:<id>` uri. */
export async function putBlob(blob: Blob, name = 'file'): Promise<string> {
  const id = createId();
  await getDb().files.put({
    id,
    blob,
    name: blob instanceof File ? blob.name : name,
    type: blob.type,
    createdAt: new Date().toISOString(),
  });
  return `idb:${id}`;
}

/** Load the Blob behind any uri the app stores: idb:, data:, blob:, or http(s). */
export async function getBlob(uri: string): Promise<Blob> {
  if (uri.startsWith('idb:')) {
    const row = await getDb().files.get(uri.slice(4));
    if (!row) throw new Error('That file is no longer stored on this device.');
    return row.blob;
  }
  const res = await fetch(uri);
  if (!res.ok) throw new Error('Could not read the file.');
  return res.blob();
}

/** The stored MIME type for a uri ('' when unknown). */
export async function blobType(uri: string): Promise<string> {
  try {
    return (await getBlob(uri)).type;
  } catch {
    return '';
  }
}

export async function deleteBlob(uri: string): Promise<void> {
  if (uri.startsWith('idb:')) await getDb().files.delete(uri.slice(4));
}

/** Blob → raw base64 (no data-URI prefix). */
export async function blobToBase64(blob: Blob): Promise<string> {
  const dataUri = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
  const comma = dataUri.indexOf(',');
  return comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
}

/** React hook: a renderable URL (for <img>/<audio>/<iframe> src) for any stored uri.
 *  `idb:` uris become object URLs, revoked on unmount; other uris pass through. */
export function useFileUrl(uri: string | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const passthrough = !!uri && !uri.startsWith('idb:');

  useEffect(() => {
    if (!uri || passthrough) return;
    let objectUrl: string | null = null;
    let cancelled = false;
    getBlob(uri)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [uri, passthrough]);

  if (!uri) return null;
  return passthrough ? uri : url;
}
