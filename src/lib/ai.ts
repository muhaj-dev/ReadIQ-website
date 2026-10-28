// The chat AI client — Groq's OpenAI-compatible API, reached through this site's
// own server routes (src/app/api/groq/*). The browser never sees an API key: the
// route handler adds it server-side, allowlists the models, and caps max_tokens.
// Every text job (Ask, quiz, summary, podcast) goes through here; vision, PDF
// reading, and embeddings go through lib/gemini.ts.

const BASE_URL = '/api/groq';

/** The site always has its AI routes; whether keys are set is decided server-side. */
export function isAiConfigured(): boolean {
  return true;
}

// --- Models -----------------------------------------------------------------
// Verified live on Groq (2026-10-28); user-selectable in Settings → AI Model.
export const DEFAULT_CHAT_MODEL = 'openai/gpt-oss-120b';

type JsonBody = Record<string, unknown>;

/** Groq's chat models all "think" first, and thinking tokens count against
 *  max_tokens — so keep it minimal and out of the reply. Verified live per family. */
function reasoningParams(model: string): JsonBody {
  if (model.startsWith('openai/gpt-oss')) return { reasoning_effort: 'low', include_reasoning: false };
  if (model.startsWith('qwen/')) return { reasoning_effort: 'none' };
  return {};
}

// --- Friendly errors --------------------------------------------------------

export type AiErrorKind =
  | 'not-configured'
  | 'network'
  | 'auth'
  | 'credits'
  | 'server'
  | 'too-large'
  | 'unknown';

const FRIENDLY: Record<AiErrorKind, string> = {
  'not-configured': 'AI is not set up yet. Add GROQ_API_KEY and GEMINI_API_KEY to the server environment.',
  network: 'Cannot reach your study assistant. Check your connection and try again.',
  auth: 'The study assistant could not sign in right now. Please try again later.',
  credits: 'The study assistant is busy right now. Please try again in a minute.',
  server: 'The study assistant is having a moment. Please try again shortly.',
  'too-large': 'That file is too large to read online. Try a smaller file (under 4 MB).',
  unknown: 'Something went wrong reaching the study assistant. Please try again.',
};

/** Every AI failure surfaces as this — render `.friendly`, log `.message`. */
export class AiError extends Error {
  readonly kind: AiErrorKind;
  readonly friendly: string;
  readonly status?: number;

  constructor(kind: AiErrorKind, detail?: string, status?: number) {
    super(detail || kind);
    this.name = 'AiError';
    this.kind = kind;
    this.friendly = FRIENDLY[kind];
    this.status = status;
  }
}

/** HTTP status → error kind. Shared with lib/gemini.ts + lib/transcription.ts. */
export function kindForStatus(status: number): AiErrorKind {
  if (status === 503) return 'not-configured'; // our route: key missing
  if (status === 401 || status === 403) return 'auth';
  if (status === 402 || status === 429) return 'credits';
  if (status === 413) return 'too-large';
  if (status >= 500) return 'server';
  return 'unknown';
}

// --- Core request -----------------------------------------------------------

/** POST a chat-completions body and return the parsed response. Throws {@link AiError}. */
export async function aiChat<T = unknown>(body: JsonBody, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, ...reasoningParams(String(body.model ?? '')) }),
      signal,
    });
  } catch (err) {
    throw new AiError('network', String(err));
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new AiError(kindForStatus(res.status), detail, res.status);
  }

  return (await res.json()) as T;
}

// --- Response text extraction ------------------------------------------------

type ChatContentPart = { type?: string; text?: string };
type ChatLike = {
  choices?: { message?: { content?: string | ChatContentPart[] } }[];
  output_text?: string;
  output?: { content?: ChatContentPart[] }[];
};

/** Pull the assistant text out of whatever shape the API returned. '' when none. */
export function readChatText(res: unknown): string {
  const r = (res ?? {}) as ChatLike;
  const join = (parts: ChatContentPart[]) =>
    parts.map((p) => (typeof p?.text === 'string' ? p.text : '')).join('').trim();
  const message = r.choices?.[0]?.message?.content;
  if (typeof message === 'string') return message.trim();
  if (Array.isArray(message)) return join(message);
  if (typeof r.output_text === 'string') return r.output_text.trim();
  const output = r.output?.[0]?.content;
  if (Array.isArray(output)) return join(output);
  return '';
}

// --- Streaming chat ---------------------------------------------------------

/** Streamed completion outcome. `tokens` (~1 per delta) also flags truncation. */
export type StreamResult = { text: string; finishReason: string | null; tokens: number };

/** Stream a chat completion (SSE), calling `onToken` per delta; resolves to the full
 *  answer. `body` omits `stream` (always set here). Throws {@link AiError} on failure. */
export async function aiChatStream(
  body: JsonBody,
  onToken?: (delta: string) => void,
  signal?: AbortSignal,
): Promise<StreamResult> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ ...body, ...reasoningParams(String(body.model ?? '')), stream: true }),
      signal,
    });
  } catch (err) {
    throw new AiError('network', String(err));
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new AiError(kindForStatus(res.status), detail, res.status);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new AiError('server', 'stream body unavailable');

  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';
  let finishReason: string | null = null;
  let tokens = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are newline-delimited; keep any partial trailing line buffered.
      let nl: number;
      while ((nl = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line.startsWith('data:')) continue; // skip keep-alives / comments
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return { text: full, finishReason, tokens };
        try {
          const json = JSON.parse(payload) as {
            choices?: { delta?: { content?: string }; finish_reason?: string | null }[];
          };
          const delta = json.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            tokens += 1;
            onToken?.(delta);
          }
          const reason = json.choices?.[0]?.finish_reason;
          if (reason) finishReason = reason;
        } catch {
          // A partial or non-JSON line — ignore and wait for more bytes.
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) return { text: full, finishReason, tokens };
    throw new AiError('network', String(err));
  }

  return { text: full, finishReason, tokens };
}

// --- Connectivity check -----------------------------------------------------

export type AiStatus = { ok: boolean; message: string };

/** Cheap health check via GET /models (no tokens spent). Never throws. */
export async function checkAiConnection(signal?: AbortSignal): Promise<AiStatus> {
  try {
    const res = await fetch(`${BASE_URL}/models`, { signal });
    if (res.ok) return { ok: true, message: 'Connected to your study assistant.' };
    return { ok: false, message: FRIENDLY[kindForStatus(res.status)] };
  } catch {
    return { ok: false, message: FRIENDLY.network };
  }
}
