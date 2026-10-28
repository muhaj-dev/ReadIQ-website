// POST /api/gemini/models/<model>:<method> → Gemini generateContent / batchEmbedContents.

import { errorResponse, GEMINI_BASE, GEMINI_METHODS, geminiKey, guard, readJson, relay, upstreamFetch } from '@/server/ai-proxy';

// Reading a long PDF can take a while.
export const maxDuration = 60;

export async function POST(request: Request, ctx: RouteContext<'/api/gemini/models/[target]'>) {
  const blocked = guard(request);
  if (blocked) return blocked;
  if (!geminiKey()) return errorResponse(503, 'GEMINI_API_KEY is not set on the server.');

  // target looks like "gemini-3.5-flash:generateContent"
  const { target } = await ctx.params;
  const [model, method] = decodeURIComponent(target).split(':');
  if (!GEMINI_METHODS[method]?.has(model)) return errorResponse(400, 'Model not allowed.');

  const body = await readJson(request);
  if (!body) return errorResponse(400, 'Invalid JSON body.');

  try {
    const upstream = await upstreamFetch(`${GEMINI_BASE}/models/${model}:${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey() },
      body: JSON.stringify(body),
    });
    return relay(upstream);
  } catch {
    return errorResponse(502, 'Upstream AI provider unreachable.');
  }
}
