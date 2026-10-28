import { AppIcon } from '@/components/ui/app-icon';
import { aiDataDisclosures, type AiDataDisclosure } from '@/data/settings';

// The shared disclosures were written for the phone app. On the web, notes live in
// this browser and AI calls pass through readIQ's own server relay — say so honestly.
const WEB_COPY: Record<string, Pick<AiDataDisclosure, 'title' | 'body'>> = {
  device: {
    title: 'Saved in this browser',
    body: 'Your notes, quizzes, and deadlines are stored in this browser on this device — not on a readIQ account server. We run no analytics. Clearing your browser’s site data erases them, so export a copy if you want a backup.',
  },
  groq: {
    title: 'Answers by Groq',
    body: 'To answer, quiz, summarize, or transcribe, your question, the matching parts of your notes, and class recordings are sent to Groq through readIQ’s server, which passes them on without storing them.',
  },
};

/** Data & Privacy — "How AI uses your notes": what stays in the browser, what goes to which provider. */
export function AiDataNotice() {
  const items = aiDataDisclosures.map((item) => ({ ...item, ...WEB_COPY[item.key] }));

  return (
    <section className="flex flex-col gap-5 rounded-inner bg-rq-surface-lowest p-5 shadow-soft">
      <h2 className="font-heading text-lg font-bold text-rq-on-surface">How AI uses your notes</h2>
      {items.map((item) => (
        <div key={item.key} className="flex gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-primary">
            <AppIcon name={item.icon} size={22} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="font-heading text-[15px] font-semibold text-rq-on-surface">{item.title}</p>
            <p className="text-[13px] leading-[19px] text-rq-on-surface-variant">{item.body}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
