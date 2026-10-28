// The AI chat models the student can pick in Settings → AI Model.
// Every option is a real Groq model id (verified live 2026-10-28); the id is sent
// verbatim as `model` in the request. Grounding is unaffected by the choice —
// this only changes which model writes the answer.

import { DEFAULT_CHAT_MODEL } from '@/lib/ai';

export type AiModel = {
  /** The Groq model id sent in the request body. */
  id: string;
  /** Friendly name shown in the picker + the Settings row. */
  label: string;
  /** Who made the model (all served by Groq). */
  provider: string;
  /** One calm line on what it's good for. */
  description: string;
  /** The tested default. */
  recommended?: boolean;
};

export const AI_MODELS: AiModel[] = [
  {
    id: DEFAULT_CHAT_MODEL, // 'openai/gpt-oss-120b'
    label: 'readIQ Default',
    provider: 'OpenAI · on Groq',
    description: 'Careful, grounded study answers. The tested default.',
    recommended: true,
  },
  {
    id: 'openai/gpt-oss-20b',
    label: 'GPT-OSS 20B',
    provider: 'OpenAI · on Groq',
    description: 'Lighter and quicker — great for short questions.',
  },
  {
    id: 'qwen/qwen3.8-27b',
    label: 'Qwen 3.8',
    provider: 'Alibaba · on Groq',
    description: 'Fast and concise — sticks closely to what your notes say.',
  },
];

/** The friendly label for a model id — falls back to the id, then the default. */
export function modelLabelFor(id: string): string {
  return AI_MODELS.find((m) => m.id === id)?.label ?? id ?? 'readIQ Default';
}

/** Is this id one we offer? Guards a stale persisted value after the list changes. */
export function isKnownModel(id: string): boolean {
  return AI_MODELS.some((m) => m.id === id);
}
