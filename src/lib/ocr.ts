// Scan OCR — a photo of notes → text via Gemini vision. The image is downscaled
// in the browser, then sent inline to a multimodal model; its readable text
// becomes the note body. Temperature 0 for a faithful, verbatim transcription.

import { AiError } from './ai';
import { blobToBase64, getBlob } from './blob-store';
import { MAX_AI_FILE_BYTES } from './files';
import { geminiReadFile } from './gemini';
import { shrinkImage } from './image-resize';

const OCR_PROMPT =
  'You are an OCR engine. Transcribe ALL readable text in this image EXACTLY as ' +
  'written — every heading, bullet, label, equation, and paragraph, in reading ' +
  'order. Preserve line and paragraph breaks. Do NOT summarize, translate, ' +
  'correct, explain, or add anything that is not in the image. If the image has no ' +
  'legible text, return nothing. Return only the transcribed text — no markdown ' +
  'code fences and no commentary.';

/** Extract the text in a captured/picked image (any stored uri). '' when illegible. Throws AiError. */
export async function extractImageText(uri: string): Promise<string> {
  const image = await shrinkImage(await getBlob(uri));
  // Base64 inflates by ~1/3 — keep the encoded body under the server's request limit.
  if (image.size > MAX_AI_FILE_BYTES * 0.75) throw new AiError('too-large');
  const base64 = await blobToBase64(image);
  return geminiReadFile(OCR_PROMPT, base64, image.type || 'image/jpeg', 4000);
}
