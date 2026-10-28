'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { mediaAttachment } from '@/components/add/media-attachment';
import { MediaResultView } from '@/components/add/media-result-view';
import { RecordPreview } from '@/components/add/record-preview';
import { Page } from '@/components/shell/page';
import { useMediaExtraction } from '@/hooks/use-media-extraction';
import { AiError } from '@/lib/ai';
import { plainTextToHtml } from '@/lib/rich-text';
import { transcribeAudio } from '@/lib/transcription';
import { useNotesStore } from '@/store/use-notes-store';

const READ_FAIL = "We couldn't transcribe that recording. You can type the transcript in instead.";

/** transcribeAudio throws plain Errors; surface its size/length message as a friendly AiError
 *  (useMediaExtraction shows `.friendly`), anything else falls back to READ_FAIL. */
async function transcribeLecture(uri: string): Promise<string> {
  try {
    return await transcribeAudio(uri);
  } catch (err) {
    if (err instanceof Error && /too (long|large)/i.test(err.message)) {
      const friendly = new AiError('too-large', err.message);
      Object.defineProperty(friendly, 'friendly', { value: `${err.message} You can still type your notes in.` });
      throw friendly;
    }
    throw err;
  }
}

/** Add — Record Result: transcribe (Groq Whisper), summarize, confirm, tag, save with the audio. */
export default function RecordResultPage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const params = useSearchParams();
  const uri = params.get('uri') || undefined;
  const duration = Number(params.get('seconds')) || 0;
  const extraction = useMediaExtraction(uri, transcribeLecture, READ_FAIL);

  return (
    <Page width="wide">
      <MediaResultView
        title="Record Result"
        extraction={extraction}
        preview={<RecordPreview seconds={duration} uri={uri} transcribed={extraction.text.trim().length > 0} />}
        status={{
          fileName: 'Your lecture',
          readingTitle: 'Transcribing your lecture…',
          readingHint: 'Turning your recording into notes with your study assistant.',
          errorTitle: "Couldn't transcribe that recording",
        }}
        textHeading="Transcript"
        placeholder="No transcript yet — type your notes in here."
        retakeLabel="Record again"
        onRetake={() => router.replace('/add/record')}
        onSave={async ({ text, tags, aiSummary }) => {
          const attachments = uri ? [await mediaAttachment(uri, 'Lecture recording', 'Audio')] : [];
          const note = await addNote({
            subject: tags[0] ?? null,
            content: text,
            contentHtml: plainTextToHtml(text),
            tags,
            attachments,
            aiSummary,
            source: 'voice',
          });
          return note.id;
        }}
      />
    </Page>
  );
}
