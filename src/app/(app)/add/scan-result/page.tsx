'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { mediaAttachment } from '@/components/add/media-attachment';
import { MediaResultView } from '@/components/add/media-result-view';
import { ScanPreview } from '@/components/add/scan-preview';
import { Page } from '@/components/shell/page';
import { useMediaExtraction } from '@/hooks/use-media-extraction';
import { extractImageText } from '@/lib/ocr';
import { plainTextToHtml } from '@/lib/rich-text';
import { useNotesStore } from '@/store/use-notes-store';

const READ_FAIL = "We couldn't read that photo. You can type your notes in instead.";

/** Add — Scan Result: OCR the photo (Gemini vision), confirm the text, tag it, save. */
export default function ScanResultPage() {
  const router = useRouter();
  const addNote = useNotesStore((s) => s.addNote);
  const uri = useSearchParams().get('uri') || undefined;
  const extraction = useMediaExtraction(uri, extractImageText, READ_FAIL);

  return (
    <Page width="wide">
      <MediaResultView
        title="Scan Result"
        extraction={extraction}
        preview={<ScanPreview uri={uri} />}
        status={{
          fileName: 'Your photo',
          readingTitle: 'Reading your photo…',
          readingHint: 'Pulling the text out with your study assistant.',
          errorTitle: "Couldn't read that photo",
        }}
        placeholder="No text found — type your notes in here."
        onRetake={() => router.replace('/add/scan')}
        onSave={async ({ text, tags, aiSummary }) => {
          const attachments = uri ? [await mediaAttachment(uri, 'Scanned page', 'Image')] : [];
          const note = await addNote({
            subject: tags[0] ?? null,
            content: text,
            contentHtml: plainTextToHtml(text),
            tags,
            attachments,
            aiSummary,
            source: 'scan',
          });
          return note.id;
        }}
      />
    </Page>
  );
}
