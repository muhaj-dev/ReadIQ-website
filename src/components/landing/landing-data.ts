// Static copy for the public landing page. Product facts come from ../ReadIQ/AGENTS.md.

import type { AppIconName } from '@/components/ui/app-icon';

export const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#screenshots', label: 'Screenshots' },
  { href: '#privacy', label: 'Privacy' },
] as const;

export type Pillar = { icon: AppIconName; name: string; title: string; body: string };

export const PILLARS: Pillar[] = [
  {
    icon: 'psychology',
    name: 'Memory',
    title: 'It remembers your notes',
    body: 'Every note you save lives in a Memory panel you can always see — the proof that readIQ remembers.',
  },
  {
    icon: 'center-focus',
    name: 'Attention',
    title: 'It focuses on what matters',
    body: 'Your dashboard surfaces weak topics and the deadlines coming up next, so you always know where to look.',
  },
  {
    icon: 'flash-on',
    name: 'Action',
    title: 'It does things for you',
    body: 'Ask a question, generate a quiz, or add a reminder — one obvious button for each, never buried in menus.',
  },
  {
    icon: 'trending-up',
    name: 'Learning',
    title: 'You improve over time',
    body: 'Streaks, quiz scores and topics mastered show your progress, day by day, without the pressure.',
  },
];

export type AddWay = { icon: AppIconName; title: string; body: string; tint: string; well: string };

export const ADD_WAYS: AddWay[] = [
  {
    icon: 'content-paste',
    title: 'Paste',
    body: 'Drop in lecture notes or a reading — the fastest way in.',
    tint: 'text-rq-method-paste',
    well: 'bg-rq-method-paste-well',
  },
  {
    icon: 'picture-as-pdf',
    title: 'Upload PDF / docx',
    body: 'Slides, handouts and Word docs — readIQ reads the text for you.',
    tint: 'text-rq-method-upload',
    well: 'bg-rq-method-upload-well',
  },
  {
    icon: 'document-scanner',
    title: 'Scan a photo',
    body: 'Snap a whiteboard or a textbook page. AI reads it, you confirm it.',
    tint: 'text-rq-method-scan',
    well: 'bg-rq-method-scan-well',
  },
  {
    icon: 'mic',
    title: 'Record a lecture',
    body: 'Record class audio and get an editable transcript and summary.',
    tint: 'text-rq-method-record',
    well: 'bg-rq-method-record-well',
  },
];

export type Feature = { icon: AppIconName; title: string; body: string };

export const FEATURES: Feature[] = [
  {
    icon: 'auto-awesome',
    title: 'Grounded Ask',
    body: 'Answers stream in from your saved notes only — each tagged with the note it came from. No note, no made-up answer.',
  },
  {
    icon: 'quiz',
    title: 'Auto-quiz',
    body: 'Pick a subject and get multiple-choice questions built from your own notes, with a short “why” for every miss.',
  },
  {
    icon: 'calendar-month',
    title: 'Deadlines',
    body: 'Exams and assignments on a calendar, colour-coded by urgency, with a countdown so nothing sneaks up on you.',
  },
  {
    icon: 'headphones',
    title: 'From Your Notes podcast',
    body: 'Turn a note into a short spoken episode and revise on the bus, at the gym, or with your eyes closed.',
  },
  {
    icon: 'highlight',
    title: 'PDF reader with highlights',
    body: 'Read the original PDF exactly as uploaded — highlight, comment, and jump back to the parts that matter.',
  },
  {
    icon: 'analytics',
    title: 'Weak topics & streaks',
    body: 'Quiz misses become weak-topic chips on your dashboard, and a daily streak keeps the habit gentle.',
  },
];

export type Shot = { src: string; width: number; height: number; title: string; caption: string; wide?: boolean };

export const SHOTS: Shot[] = [
  { src: '/screenshots/home-ask.png', width: 4418, height: 2762, title: 'Home, Ask & Memory', wide: true, caption: 'Dashboard, a grounded answer with its source note, and your Memory panel.' },
  { src: '/screenshots/add-note.png', width: 4434, height: 2702, title: 'Add a note four ways', caption: 'Paste, upload, scan or record — then save it to memory.' },
  { src: '/screenshots/quiz.png', width: 1912, height: 2326, title: 'Quizzes from your notes', caption: 'One question per screen, instant feedback, and topics to review.' },
  { src: '/screenshots/deadlines.png', width: 3558, height: 2326, title: 'Deadlines', caption: 'A calm calendar with urgency colours and reminders.' },
  { src: '/screenshots/profile-settings.png', width: 2670, height: 2458, title: 'Profile & settings', caption: 'Your progress, achievements, theme and AI model in one place.' },
  { src: '/screenshots/memory.png', width: 4482, height: 2874, title: 'Memory & reading', wide: true, caption: 'Every saved note, searchable, with a reader for highlights and comments.' },
];
