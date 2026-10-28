// Server-only AI proxy logic shared by the /api/groq/* and /api/gemini/* route
// handlers. Ported from the mobile app's Cloudflare Worker (proxy/src/index.ts):
// the browser never holds a key — these handlers add it, forward ONLY the calls
// readIQ makes with ONLY the models it uses, cap reply sizes, and apply a light
// per-IP rate limit. Upstream responses (including SSE streams) pass straight
// through, so the client's parsing is unchanged.
//
// Keys come from server env vars (never NEXT_PUBLIC_*): GROQ_API_KEY, GEMINI_API_KEY.

import 'server-only';

import https from 'node:https';
import { Readable } from 'node:stream';

export const GROQ_BASE = 'https://api.groq.com/openai/v1';
export const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// Keep in sync with src/data/ai-models.ts, src/lib/gemini.ts, src/lib/transcription.ts.
export const CHAT_MODELS = new Set(['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']);
export const STT_MODELS = new Set(['whisper-large-v3-turbo', 'whisper-large-v3']);
export const GEMINI_METHODS: Record<string, Set<string>> = {
  generateContent: new Set(['gemini-3.5-flash']),
  batchEmbedContents: new Set(['gemini-embedding-001']),
};

/** Hard ceiling on a chat reply, whatever the client asks for (the app's largest is 4000). */
export const MAX_CHAT_TOKENS = 4096;
/** Largest body forwarded (hosting platforms cap request bodies around 4.5 MB anyway). */
export const MAX_BODY_BYTES = 6 * 1024 * 1024;

export function groqKey(): string {
  return process.env.GROQ_API_KEY ?? '';
}

export function geminiKey(): string {
  return process.env.GEMINI_API_KEY ?? '';
}

export function errorResponse(status: number, message: string): Response {
  return Response.json({ error: { message } }, { status });
}

/** Pass the upstream response through untouched (status, body stream, content type). */
export function relay(upstream: Response): Response {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  const type = upstream.headers.get('Content-Type');
  if (type) headers.set('Content-Type', type);
  return new Response(upstream.body, { status: upstream.status, headers });
}

/** POST/GET to an AI provider over plain HTTP/1.1 (node:https), returning a web
 *  Response whose body streams (so SSE passes straight through).
 *
 *  Why not fetch(): Node's built-in fetch (undici) negotiates HTTP/2, and on some
 *  networks the first TLS handshake to Groq fails, after which undici keeps
 *  reusing the dead session ("ERR_HTTP2_INVALID_SESSION") for every request.
 *  HTTP/1.1 via node:https was verified reliable for every provider. */
export async function upstreamFetch(url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  let payload: Buffer | undefined;
  if (typeof init.body === 'string') {
    payload = Buffer.from(init.body);
  } else if (init.body instanceof FormData) {
    // Serialize the multipart form (and its boundary header) the same way fetch would.
    const encoded = new Response(init.body);
    payload = Buffer.from(await encoded.arrayBuffer());
    headers.set('Content-Type', encoded.headers.get('Content-Type') ?? 'multipart/form-data');
  }
  if (payload) headers.set('Content-Length', String(payload.length));

  return new Promise<Response>((resolve, reject) => {
    const req = https.request(
      url,
      { method: init.method ?? 'GET', headers: Object.fromEntries(headers), signal: init.signal ?? undefined },
      (res) => {
        const outHeaders = new Headers();
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === 'string') outHeaders.set(key, value);
        }
        const body = Readable.toWeb(res) as ReadableStream<Uint8Array>;
        resolve(new Response(body, { status: res.statusCode ?? 502, headers: outHeaders }));
      },
    );
    req.on('error', reject);
    req.end(payload);
  });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// --- Rate limit ----------------------------------------------------------------
// Fixed-window, in-memory, per server instance — a light guard against a single
// browser hammering the keys, not a security boundary. For production traffic, put
// a real limiter (e.g. Vercel WAF rate limiting or Upstash) in front.

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

/** Run every proxy guard. Returns an error Response to send, or null to continue. */
export function guard(request: Request): Response | null {
  const length = Number(request.headers.get('Content-Length') ?? 0);
  if (length > MAX_BODY_BYTES) return errorResponse(413, 'File too large.');

  const ip = clientIp(request);
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (hits.size > 5000) {
      for (const [key, value] of hits) if (value.resetAt <= now) hits.delete(key);
    }
    return null;
  }
  entry.count += 1;
  if (entry.count > MAX_PER_WINDOW) return errorResponse(429, 'Too many requests — slow down a little.');
  return null;
}
