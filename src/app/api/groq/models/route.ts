// GET /api/groq/models → connectivity check (no tokens spent).

import { errorResponse, GROQ_BASE, groqKey, guard, relay, upstreamFetch } from '@/server/ai-proxy';

export async function GET(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  if (!groqKey()) return errorResponse(503, 'GROQ_API_KEY is not set on the server.');

  try {
    return relay(await upstreamFetch(`${GROQ_BASE}/models`, { headers: { Authorization: `Bearer ${groqKey()}` } }));
  } catch {
    return errorResponse(502, 'Upstream AI provider unreachable.');
  }
}
