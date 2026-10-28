<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# readIQ Website — project rules

This is the **web version of the readIQ mobile app** (Expo/React Native source at
`../ReadIQ`). Its product rules — grounding, the "📌 From your notes" tag, honest
fallbacks, calm design — are in `../ReadIQ/AGENTS.md` and apply here unchanged.
This file covers what is different on the web.

## Stack
Next.js 16 (App Router, `cacheComponents` on) · React 19 · TypeScript · Tailwind v4 ·
shadcn/ui (**base-nova style = Base UI, not Radix**: compose with the `render` prop,
there is no `asChild`) · Zustand · Dexie (IndexedDB) · lucide-react · Tiptap · pdf.js.

## Where things live
- `src/app/page.tsx` — public landing page.
- `src/app/(onboarding)/*` — welcome · about · first-note.
- `src/app/(app)/*` — every in-app route, wrapped by `AppShell` (desktop sidebar,
  mobile bottom bar, onboarding gate) and a `<Suspense>` boundary.
- `src/app/api/*` — the AI proxy (Groq + Gemini). Keys are server-only env vars
  (`GROQ_API_KEY`, `GEMINI_API_KEY`) read only in `src/server/ai-proxy.ts`.
- `src/lib`, `src/store`, `src/types`, `src/data`, `src/hooks` — ported from the
  mobile app with the **same exports**. Platform pieces were rewritten:
  `db.ts` (Dexie), `files.ts` + `blob-store.ts` (files as Blobs, `idb:<id>` uris),
  `ai.ts` / `gemini.ts` / `transcription.ts` (call `/api/*`), `storage.ts`
  (AsyncStorage-shaped localStorage), `podcast-voices.ts` (Web Speech API).

## Rules
- Pages are client components (`'use client'`) that compose components and call
  stores/hooks. Keep page files ≤150 lines and component files ≤200 lines.
- Colours: never hard-code hex in components. Use the `rq-*` Tailwind colours —
  the mobile app's `colors.onSurfaceVariant` is `text-rq-on-surface-variant`,
  `withAlpha(colors.outlineVariant, 0.2)` is `border-rq-outline-variant/20`.
  shadcn's `primary` is mapped to readIQ indigo, so `<Button>` is already on-brand.
  Fixed palettes (highlight / deadline marker swatches) come from `constants/theme.ts`.
- Fonts: `font-heading` (Manrope) for headings/numbers, default `font-sans` (Hanken Grotesk).
- Radii: `rounded-card` (16) · `rounded-inner` (12) · `rounded-btn` (12) · `rounded-pill`.
  Soft shadow: `shadow-soft`.
- Icons: `<AppIcon name="…">` from `@/components/ui/app-icon` (the mobile app's names).
- Layout: `Page`, `PageHeader`, `BackButton`, `EmptyState` from `@/components/shell/page`.
  Mobile-first, 20px gutters, no horizontal scroll at 360px; use the extra width on
  desktop (multi-column grids) instead of a stretched phone layout.
- Files: never keep a `blob:` URL as a stored uri. Persist with `putBlob` /
  `fileToAttachment` and render with `useFileUrl(uri)`.
- Search params / params in client pages: `useSearchParams()` / `useParams()`.
- AI calls only via `lib/ai.ts` / `lib/gemini.ts` / `lib/transcription.ts`; show
  `AiError.friendly` on failure — never a raw error.
- Validate with `npm run lint` and `npm run typecheck`.
