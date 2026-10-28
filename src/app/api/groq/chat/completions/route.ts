// POST /api/groq/chat/completions → Groq chat (JSON or SSE stream), key added server-side.

import {
  CHAT_MODELS,
  errorResponse,
  GROQ_BASE,
  groqKey,
  guard,
  MAX_CHAT_TOKENS,
  readJson,
  relay,
  upstreamFetch,
} from '@/server/ai-proxy';

// Long answers / quiz JSON can take a while; streaming keeps the connection alive.
export const maxDuration = 60;

export async function POST(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  if (!groqKey()) return errorResponse(503, 'GROQ_API_KEY is not set on the server.');

  const body = await readJson(request);
  if (!body) return errorResponse(400, 'Invalid JSON body.');
  if (!CHAT_MODELS.has(String(body.model))) return errorResponse(400, 'Model not allowed.');
  body.max_tokens = Math.min(Number(body.max_tokens) || MAX_CHAT_TOKENS, MAX_CHAT_TOKENS);

  try {
    const upstream = await upstreamFetch(`${GROQ_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey()}` },
      body: JSON.stringify(body),
      signal: request.signal,
    });
    return relay(upstream);
  } catch {
    return errorResponse(502, 'Upstream AI provider unreachable.');
  }
}
