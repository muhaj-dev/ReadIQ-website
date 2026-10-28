import type { PodcastSpeaker } from '@/types/podcast';

/** Distinct accent per host — Maya (A) indigo, Leo (B) violet — as Tailwind classes. */
export const HOST_ACCENT: Record<
  PodcastSpeaker,
  { bg: string; text: string; soft: string; border: string }
> = {
  A: {
    bg: 'bg-rq-secondary',
    text: 'text-rq-secondary',
    soft: 'bg-rq-secondary/12',
    border: 'border-rq-secondary/50',
  },
  B: {
    bg: 'bg-rq-method-record',
    text: 'text-rq-method-record',
    soft: 'bg-rq-method-record/12',
    border: 'border-rq-method-record/50',
  },
};
