# readIQ — Website

The web version of **readIQ**, the AI study companion that remembers your notes and
answers questions **only from what you saved** — every grounded answer carries a
📌 *From your notes* tag naming its source note.

It's a Next.js port of the readIQ mobile app (Expo / React Native, in `../ReadIQ`):
same features, same grounding rules, same AI providers.

## Features

- **Landing page** at `/`, onboarding at `/welcome` → `/about` → `/first-note`
- **Ask ★** — streaming, retrieval-gated answers with source tags, "Generate more",
  opt-in "Beyond your notes", image questions, voice dictation
- **Memory** — every saved note, searchable and filterable by subject
- **Add notes 4 ways** — paste (rich editor), upload PDF / .docx, scan with your webcam
  or a photo (AI OCR), record a lecture (AI transcript)
- **Note reader** — highlights and comments, **PDF reader** with page highlights,
  and **Listen**: a two-host podcast of your note (browser text-to-speech)
- **Quiz** — MCQs generated per subject from your notes, scoring, weak topics
- **Deadlines** — calendar and countdowns, colour-coded by urgency
- **Profile, achievements, stats, settings** — light/dark theme, AI model picker,
  export or delete your data

## Run it

```bash
npm install
cp .env.example .env.local   # add GROQ_API_KEY and GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

Checks: `npm run lint` · `npm run typecheck` · `npm run build`

## How it works

| Concern | Web implementation |
|---|---|
| Storage | **IndexedDB** in the browser (Dexie) — notes, vectors, chats, quizzes, deadlines, and uploaded files. Nothing is stored on a server. |
| AI keys | Server-only env vars, used by route handlers in `src/app/api/*` (a port of the mobile app's Cloudflare proxy: model allowlist, token caps, light rate limit). |
| Chat / quiz / summaries / podcast | Groq `openai/gpt-oss-120b` (selectable) via `/api/groq/chat/completions` (SSE streaming) |
| Transcription | Groq Whisper `whisper-large-v3-turbo` via `/api/groq/audio/transcriptions` |
| PDF reading, scan OCR, embeddings | Gemini `gemini-3.5-flash` and `gemini-embedding-001` via `/api/gemini/models/*` |
| Retrieval | Cosine similarity over stored embeddings, with a lexical fallback, behind a grounding gate |

## Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel (framework: Next.js).
2. Add `GROQ_API_KEY` and `GEMINI_API_KEY` under **Settings → Environment Variables**.
3. Deploy.

Vercel caps request bodies at about 4.5 MB, so PDFs, photos, and recordings sent to
the AI must stay under about 4 MB. Photos are downscaled in the browser automatically.
The built-in rate limiter is in-memory per instance; for heavy traffic, add Vercel WAF
rate limiting or a shared store such as Upstash.
