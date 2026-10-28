// Voice selection for the podcast player. Reads via the browser's built-in
// text-to-speech (Web Speech API, `speechSynthesis`). Curates a balanced shortlist
// of five real voices — three female + two male, distinct, Nigerian + natural first.

import type { PodcastSpeaker } from '@/types/podcast';

export type VoiceGender = 'female' | 'male' | 'unknown';

/** A browser voice, cleaned up for the picker (friendly label + quality flag). */
export type DeviceVoice = {
  /** SpeechSynthesisVoice.voiceURI — passed back to pick the voice when speaking. */
  identifier: string;
  name: string;
  /** True for higher-quality "Natural"/"Neural"/"Enhanced"/"Google" voices. */
  enhanced: boolean;
  gender: VoiceGender;
  nigerian: boolean;
  language: string;
};

/** Gentle per-host pitch so two hosts read apart even with a single voice. */
export const HOST_PITCH: Record<PodcastSpeaker, number> = { A: 1.06, B: 0.94 };

export const PREVIEW_LINE: Record<PodcastSpeaker, string> = {
  A: "Hey, welcome back — let's get into it.",
  B: 'Right, so let me break this idea down nice and simply.',
};

export const RATE_PRESETS = [
  { label: 'Slow', value: 0.85 },
  { label: 'Normal', value: 1 },
  { label: 'Fast', value: 1.15 },
] as const;

export const DEFAULT_RATE = 1;

const TARGET_FEMALE = 3;
const TARGET_MALE = 2;
const TARGET_TOTAL = 5;

const FEMALE_NAMES = new Set([
  'samantha', 'ava', 'allison', 'susan', 'nicky', 'zoe', 'joelle', 'karen', 'catherine',
  'kate', 'serena', 'stephanie', 'martha', 'moira', 'tessa', 'fiona', 'veena', 'sangeeta',
  'isha', 'matilda', 'nora', 'zira', 'hazel', 'aria', 'jenny', 'sonia', 'libby', 'ezinne',
  'emma', 'michelle', 'natasha', 'clara', 'luna',
]);
const MALE_NAMES = new Set([
  'aaron', 'arthur', 'daniel', 'fred', 'gordon', 'lee', 'oliver', 'rishi', 'nathan', 'tom',
  'david', 'mark', 'george', 'guy', 'ryan', 'abeo', 'christopher', 'eric', 'william', 'brian',
]);

/** Words in a browser voice name that aren't the person's name. */
const NAME_NOISE = /\b(microsoft|google|apple|online|natural|neural|enhanced|premium|desktop|\(.*?\)|-.*$)/gi;

function personName(rawName: string): string {
  return rawName.replace(NAME_NOISE, ' ').replace(/\s+/g, ' ').trim();
}

function inferGender(rawName: string): VoiceGender {
  const lower = rawName.toLowerCase();
  if (/(?:^|[^a-z])female(?:[^a-z]|$)/.test(lower)) return 'female';
  if (/(?:^|[^a-z])male(?:[^a-z]|$)/.test(lower)) return 'male';
  const first = personName(rawName).toLowerCase().split(/[ ._#-]/)[0];
  if (FEMALE_NAMES.has(first)) return 'female';
  if (MALE_NAMES.has(first)) return 'male';
  return 'unknown';
}

function isNigerian(rawName: string, language: string): boolean {
  return language.toLowerCase().replace('_', '-').startsWith('en-ng') || /nigeria/i.test(rawName);
}

function isEnhanced(rawName: string): boolean {
  return /natural|neural|enhanced|premium|google/i.test(rawName);
}

function groupRank(v: { gender: VoiceGender; nigerian: boolean }): number {
  if (v.nigerian) return 0;
  if (v.gender === 'female') return 1;
  return 2;
}

function curateToFive<T extends { identifier: string; gender: VoiceGender }>(list: T[]): T[] {
  const picked: T[] = [];
  const used = new Set<string>();
  const take = (pool: T[], count: number) => {
    let n = count;
    for (const v of pool) {
      if (picked.length >= TARGET_TOTAL || n <= 0) break;
      if (used.has(v.identifier)) continue;
      picked.push(v);
      used.add(v.identifier);
      n -= 1;
    }
  };
  take(list.filter((v) => v.gender === 'female'), TARGET_FEMALE);
  take(list.filter((v) => v.gender === 'male'), TARGET_MALE);
  take(list.filter((v) => !used.has(v.identifier)), TARGET_TOTAL - picked.length);
  return picked;
}

/** speechSynthesis loads voices asynchronously in Chrome — wait for them (max ~1.5s). */
function browserVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => resolve(window.speechSynthesis.getVoices());
    window.speechSynthesis.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
}

/** Load a curated shortlist of browser voices (English preferred), balanced five. */
export async function loadDeviceVoices(): Promise<DeviceVoice[]> {
  const raw = await browserVoices();
  if (raw.length === 0) return [];

  const en = raw.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = en.length ? en : raw;

  const mapped = pool.map((v) => ({
    identifier: v.voiceURI,
    rawName: v.name,
    enhanced: isEnhanced(v.name),
    language: v.lang,
    gender: inferGender(v.name),
    nigerian: isNigerian(v.name, v.lang),
  }));

  const curated = mapped.filter((v) => v.nigerian || v.gender !== 'unknown');
  const chosen = curated.length >= 2 ? curated : mapped;

  chosen.sort(
    (a, b) =>
      groupRank(a) - groupRank(b) ||
      Number(b.enhanced) - Number(a.enhanced) ||
      a.rawName.localeCompare(b.rawName),
  );

  // One entry per person name (browsers list the same voice in several variants).
  const seen = new Set<string>();
  const unique = chosen.filter((v) => {
    const key = personName(v.rawName).toLowerCase() || v.identifier;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return curateToFive(unique).map((v, i) => {
    const base = personName(v.rawName);
    const label = v.gender === 'female' ? 'Female' : v.gender === 'male' ? 'Male' : '';
    return {
      identifier: v.identifier,
      name: base || (label ? `${label} voice ${i + 1}` : `Voice ${i + 1}`),
      enhanced: v.enhanced,
      gender: v.gender,
      nigerian: v.nigerian,
      language: v.language,
    };
  });
}

/** Default host pair: top voice for A, best different-gender voice for B. */
export function pickDefaultVoices(list: DeviceVoice[]): Record<PodcastSpeaker, string | null> {
  if (list.length === 0) return { A: null, B: null };
  const a = list[0];
  const b =
    list.find((v) => v.identifier !== a.identifier && v.gender !== a.gender) ??
    list.find((v) => v.identifier !== a.identifier) ??
    a;
  return { A: a.identifier, B: b.identifier };
}

/** The SpeechSynthesisVoice for a stored identifier (null → browser default). */
export function voiceFor(identifier: string | null): SpeechSynthesisVoice | null {
  if (!identifier || typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  return window.speechSynthesis.getVoices().find((v) => v.voiceURI === identifier) ?? null;
}
