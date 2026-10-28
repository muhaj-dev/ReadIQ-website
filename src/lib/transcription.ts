// Record transcription — lecture audio → transcript via Groq Whisper, reached
// through this site's server route (src/app/api/groq/audio/transcriptions). The
// browser records with MediaRecorder (webm/opus or mp4), which Whisper accepts.
// The transcript never blocks a save: any failure surfaces the retry / "type it
// instead" screen.

import { MAX_AI_FILE_BYTES } from './files';
import { getBlob } from './blob-store';

const STT_MODEL = 'whisper-large-v3-turbo';

export function isTranscriptionConfigured(): boolean {
  return true;
}

/** A filename whose extension matches the recording's container (Whisper reads by it). */
function audioFileName(type: string): string {
  if (type.includes('webm')) return 'audio.webm';
  if (type.includes('ogg')) return 'audio.ogg';
  if (type.includes('mp4') || type.includes('m4a') || type.includes('aac')) return 'audio.m4a';
  if (type.includes('mpeg') || type.includes('mp3')) return 'audio.mp3';
  if (type.includes('wav')) return 'audio.wav';
  return 'audio.webm';
}

/** Transcribe a recording (an `idb:`/`blob:` uri or a Blob). Throws on failure. */
export async function transcribeAudio(source: string | Blob): Promise<string> {
  const blob = typeof source === 'string' ? await getBlob(source) : source;
  if (blob.size > MAX_AI_FILE_BYTES) {
    throw new Error('That recording is too long to transcribe online. Try a shorter clip (about 4 minutes or less).');
  }

  const form = new FormData();
  form.append('file', blob, audioFileName(blob.type));
  form.append('model', STT_MODEL);
  form.append('response_format', 'text'); // body IS the transcript — no JSON to parse

  let res: Response;
  try {
    res = await fetch('/api/groq/audio/transcriptions', { method: 'POST', body: form });
  } catch {
    throw new Error('Could not reach the transcription service.');
  }

  if (!res.ok) {
    if (res.status === 503) throw new Error('Transcription is not set up yet (missing GROQ_API_KEY).');
    if (res.status === 413) throw new Error('That recording is too large to transcribe online.');
    throw new Error(`Transcription failed (${res.status}).`);
  }

  return (await res.text()).trim();
}
