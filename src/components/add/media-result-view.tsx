'use client';

import { useRouter } from 'next/navigation';
import { type ReactNode, useState } from 'react';

import { PageHeader } from '@/components/shell/page';
import type { MediaExtraction } from '@/hooks/use-media-extraction';

import { ExtractStatus } from './extract-status';
import { ExtractedTextCard } from './extracted-text-card';
import { SaveBar, type SaveState } from './save-bar';
import { TagEditor } from './tag-editor';

export type MediaDraft = { text: string; tags: string[]; aiSummary: string | null };

type Props = {
  title: string;
  extraction: MediaExtraction;
  /** The captured photo / recorded clip, shown beside the text on desktop. */
  preview: ReactNode;
  status: { fileName: string; readingTitle: string; readingHint: string; errorTitle: string };
  textHeading?: string;
  placeholder?: string;
  retakeLabel?: string;
  onRetake: () => void;
  /** Persist the note; resolves to its id (the view then opens it). */
  onSave: (draft: MediaDraft) => Promise<string>;
};

/** Shared Scan Result / Record Result body: status while the AI reads, then preview + editable text + tags + save. */
export function MediaResultView({ title, extraction, preview, status, textHeading, placeholder, retakeLabel, onRetake, onSave }: Props) {
  const router = useRouter();
  const { status: state, text, setText, aiSummary, error, retry, skip } = extraction;
  const [tags, setTags] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string>();

  const save = async () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    setSaveError(undefined);
    try {
      const id = await onSave({ text: text.trim(), tags, aiSummary });
      setSaveState('saved');
      // Let the green "Saved!" moment land before opening the note.
      setTimeout(() => router.replace(`/note/${id}`), 700);
    } catch {
      setSaveState('idle');
      setSaveError("We couldn't save that note. Please try again.");
    }
  };

  if (state !== 'ready') {
    return (
      <>
        <PageHeader title={title} back />
        <ExtractStatus
          state={state}
          fileName={status.fileName}
          readingTitle={status.readingTitle}
          readingHint={status.readingHint}
          errorTitle={status.errorTitle}
          skipLabel="Type it instead"
          message={error}
          onRetry={retry}
          onSkip={skip}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title={title} back />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-10">
        <div className="lg:sticky lg:top-10">{preview}</div>
        <div>
          <ExtractedTextCard value={text} onChange={setText} heading={textHeading} placeholder={placeholder} />
          <TagEditor
            tags={tags}
            onAdd={(tag) => setTags((now) => (now.includes(tag) ? now : [...now, tag]))}
            onRemove={(tag) => setTags((now) => now.filter((t) => t !== tag))}
          />
          {saveError ? <p className="mt-4 text-sm text-rq-error">{saveError}</p> : null}
          {!text.trim() ? (
            <p className="mt-4 text-sm text-rq-outline">Add some text first — your notes are what the app answers from.</p>
          ) : null}
          <SaveBar state={saveState} retakeLabel={retakeLabel} onRetake={onRetake} onSave={save} disabled={!text.trim()} />
        </div>
      </div>
    </>
  );
}
