// The Gemini client — Google's native Generative Language API, reached through
// this site's server route (src/app/api/gemini/*), which holds the key. Handles
// the jobs Groq can't: reading PDFs + photos (multimodal) and text embeddings for
// semantic retrieval. Errors reuse AiError so every screen shows the same calm copy.

import { AiError, kindForStatus } from './ai';

const BASE_URL = '/api/gemini';

/** The site always has its AI routes; whether the key is set is decided server-side. */
export function isGeminiConfigured(): boolean {
  return true;
}

// --- Models (verified live 2026-10-28) ---------------------------------------
export const GEMINI_VISION_MODEL = 'gemini-3.5-flash';

// 768 dims keeps stored rows small. Calibrated: on-topic questions scored ~0.70,
// off-topic peaked at ~0.54 (see COSINE_MIN in lib/retrieval.ts).
export const GEMINI_EMBED_MODEL = 'gemini-embedding-001';
const EMBED_DIMS = 768;
const EMBED_BATCH = 100;

// Once the server says Gemini has no key, stop retrying embeddings this session
// (retrieval quietly falls back to lexical).
let unavailable = false;

type JsonBody = Record<string, unknown>;

async function geminiPost<T>(path: string, body: JsonBody, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    throw new AiError('network', String(err));
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    if (res.status === 503) unavailable = true;
    throw new AiError(kindForStatus(res.status), detail, res.status);
  }
  return (await res.json()) as T;
}

// --- Read a file (PDF / image) -----------------------------------------------

type GenerateResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
};

/** Send a prompt + one file (base64, no data-URI prefix) and return the reply text.
 *  Temperature 0 for a faithful transcription. '' when the model returns nothing. */
export async function geminiReadFile(
  prompt: string,
  base64: string,
  mimeType: string,
  maxOutputTokens: number,
): Promise<string> {
  const res = await geminiPost<GenerateResponse>(`models/${GEMINI_VISION_MODEL}:generateContent`, {
    contents: [
      { role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }] },
    ],
    generationConfig: { temperature: 0, maxOutputTokens },
  });

  // Skip any "thought" parts — only the visible answer becomes note text.
  const parts = res.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((p) => !p.thought && typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
    .trim();
}

// --- Embeddings -------------------------------------------------------------

/** Notes are embedded as documents, questions as queries — Gemini tunes each side. */
export type EmbedTask = 'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY';

type BatchEmbedResponse = { embeddings?: { values?: number[] }[] };

/** Embed each input text → one vector per input, in input order. Throws {@link AiError}. */
export async function geminiEmbed(
  inputs: string[],
  task: EmbedTask,
  signal?: AbortSignal,
): Promise<number[][]> {
  if (inputs.length === 0) return [];
  if (unavailable) throw new AiError('not-configured');

  const model = `models/${GEMINI_EMBED_MODEL}`;
  const vectors: number[][] = [];
  for (let i = 0; i < inputs.length; i += EMBED_BATCH) {
    const res = await geminiPost<BatchEmbedResponse>(
      `${model}:batchEmbedContents`,
      {
        requests: inputs.slice(i, i + EMBED_BATCH).map((text) => ({
          model,
          content: { parts: [{ text }] },
          taskType: task,
          outputDimensionality: EMBED_DIMS,
        })),
      },
      signal,
    );
    vectors.push(...(res.embeddings ?? []).map((e) => e.values ?? []));
  }

  // A missing/short vector means the batch is unusable — fail so the caller uses lexical.
  if (vectors.length !== inputs.length || vectors.some((v) => v.length === 0)) {
    throw new AiError('server', 'embeddings: response missing a vector');
  }
  return vectors;
}
