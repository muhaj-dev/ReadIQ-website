'use client';

import Link from 'next/link';

import { Page, EmptyState } from '@/components/shell/page';
import { Button } from '@/components/ui/button';
import { useNotesStore } from '@/store/use-notes-store';

import { NoteHeader } from './note-header';

/** Fallback for a note id that can't be found (deleted or stale link).
 *  While the Memory store is still loading, render nothing instead of a false "gone". */
export function NoteMissing({ title = 'Note' }: { title?: string }) {
  const loaded = useNotesStore((s) => s.loaded);
  if (!loaded) return null;

  return (
    <Page width="narrow">
      <NoteHeader title={title} back="/memory" />
      <EmptyState
        icon="article"
        title="This note isn't here anymore"
        body="It may have been deleted. Your other notes are still safe in Memory."
        action={
          <Button nativeButton={false} render={<Link href="/memory" />} className="h-11 rounded-btn px-5">
            Back to Memory
          </Button>
        }
        className="mt-10"
      />
    </Page>
  );
}
