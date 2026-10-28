import { Section } from '@/components/landing/section';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

// Web wording of the mobile app's aiDataDisclosures (src/data/settings.ts) — honest
// about exactly what leaves the device and where it goes.
const DISCLOSURES: { icon: AppIconName; title: string; body: string }[] = [
  {
    icon: 'shield',
    title: 'Saved in your browser',
    body: 'Your notes, quizzes and deadlines are stored in this browser on this device. There is no readIQ account server and no analytics.',
  },
  {
    icon: 'smart-toy',
    title: 'Answers by Groq',
    body: 'To answer, quiz, summarize or transcribe, your question, the matching parts of your notes, and class recordings are sent to Groq.',
  },
  {
    icon: 'document-scanner',
    title: 'Reading & search by Google Gemini',
    body: 'PDFs and photos you add, and note text for smart search, are sent to Google Gemini. On its free tier, Google may use this data to improve its products.',
  },
];

const PROMISES = [
  'Retrieval first — if no saved note matches, readIQ does not call the model.',
  'Every grounded answer names its source note with a 📌 tag you can open.',
  'No outside knowledge fills the gaps. An honest “not in your notes yet” instead.',
];

/** Privacy & trust: the grounding promise plus an honest data disclosure. */
export function Trust() {
  return (
    <Section
      id="privacy"
      eyebrow="Privacy & trust"
      title="Honest about your notes, and about where they go"
      intro="Only what's needed to answer is sent to the AI providers. Everything else stays with you."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-card border border-rq-outline-variant/30 bg-rq-surface-container p-6 lg:p-8">
          <span className="flex size-12 items-center justify-center rounded-pill bg-rq-surface-lowest text-rq-secondary">
            <AppIcon name="policy" size={24} />
          </span>
          <h3 className="mt-5 text-xl font-bold text-rq-on-surface">The grounding promise</h3>
          <ul className="mt-4 space-y-3">
            {PROMISES.map((promise) => (
              <li key={promise} className="flex gap-3 text-[15px] leading-6 text-rq-on-surface">
                <AppIcon name="check-circle" size={20} className="mt-0.5 text-rq-quiz-check" />
                {promise}
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-4">
          {DISCLOSURES.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-card border border-rq-outline-variant/30 bg-rq-surface-lowest p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-inner bg-rq-surface-container text-rq-secondary">
                <AppIcon name={item.icon} size={22} />
              </span>
              <div>
                <h3 className="text-base font-bold text-rq-on-surface">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-6 text-rq-on-surface-variant">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
