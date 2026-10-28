// Downscale a photo in the browser before sending it to the AI. Phone photos are
// often 4–10 MB — over the server's request limit and slower to read — while OCR
// only needs ~2000px on the long edge.

const MAX_EDGE = 2000;
const QUALITY = 0.85;
/** Images already this small are sent as-is. */
const SKIP_BELOW_BYTES = 1.2 * 1024 * 1024;

/** Returns a JPEG no larger than MAX_EDGE on its long side (or the original if small). */
export async function shrinkImage(blob: Blob): Promise<Blob> {
  if (blob.size <= SKIP_BELOW_BYTES || !blob.type.startsWith('image/')) return blob;
  try {
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const out = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
    return out ?? blob;
  } catch {
    // HEIC and other formats the browser can't decode — send the original.
    return blob;
  }
}
