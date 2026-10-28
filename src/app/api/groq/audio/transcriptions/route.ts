// POST /api/groq/audio/transcriptions → Groq Whisper (multipart), key added server-side.

import { errorResponse, GROQ_BASE, groqKey, guard, relay, STT_MODELS, upstreamFetch } from '@/server/ai-proxy';

export const maxDuration = 60;

export async function POST(request: Request) {
  const blocked = guard(request);
  if (blocked) return blocked;
  if (!groqKey()) return errorResponse(503, 'GROQ_API_KEY is not set on the server.');

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse(400, 'Expected a multipart form.');
  }
  if (!STT_MODELS.has(String(form.get('model')))) return errorResponse(400, 'Model not allowed.');

  try {
    // fetch sets the multipart boundary itself — no Content-Type header here.
    const upstream = await upstreamFetch(`${GROQ_BASE}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${groqKey()}` },
      body: form,
    });
    return relay(upstream);
  } catch {
    return errorResponse(502, 'Upstream AI provider unreachable.');
  }
}
