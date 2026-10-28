'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { RecordControls } from '@/components/add/record-controls';
import { RecordTimer } from '@/components/add/record-timer';
import { RecordWaveform } from '@/components/add/record-waveform';
import { EmptyState, Page, PageHeader } from '@/components/shell/page';
import { Button } from '@/components/ui/button';
import { useLectureRecorder } from '@/hooks/use-lecture-recorder';
import { putBlob } from '@/lib/blob-store';

/** Add — Record Lecture. Recording starts on entry; Finish hands the clip to Record Result. */
export default function RecordPage() {
  const router = useRouter();
  const { status, seconds, levels, toggle, stop } = useLectureRecorder();
  const [error, setError] = useState<string>();

  // Discard: stop and back out of the flow.
  const leave = async () => {
    await stop();
    router.replace('/add');
  };

  // Finish: stop, persist the clip, and open Record Result with its uri + duration.
  const finish = async () => {
    const elapsed = seconds;
    const blob = await stop();
    if (!blob) {
      setError('Nothing was recorded. Go back and try again.');
      return;
    }
    try {
      const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      const uri = await putBlob(blob, `lecture-${Date.now()}.${ext}`);
      router.replace(`/add/record-result?uri=${encodeURIComponent(uri)}&seconds=${elapsed}`);
    } catch {
      setError("We couldn't keep that recording on this device. Please try again.");
    }
  };

  if (status === 'denied' || status === 'unsupported') {
    return (
      <Page width="narrow">
        <PageHeader title="Record Lecture" back="/add" />
        <EmptyState
          icon="mic"
          title={status === 'denied' ? 'Microphone access needed' : 'Recording not supported here'}
          body={
            status === 'denied'
              ? 'Allow microphone access in your browser (the mic icon in the address bar) so readIQ can record and transcribe your lecture.'
              : "This browser can't record audio. Try a recent Chrome, Edge, Firefox or Safari."
          }
          action={
            <Button onClick={() => router.replace('/add')} className="h-11 rounded-btn px-6">
              Go back
            </Button>
          }
        />
      </Page>
    );
  }

  return (
    <Page width="narrow" className="flex min-h-dvh flex-col lg:min-h-[80vh]">
      <PageHeader title="Record Lecture" back="/add" />
      <div className="flex flex-1 flex-col items-center justify-center gap-10 py-6">
        <RecordWaveform levels={levels} active={status === 'recording'} />
        <RecordTimer seconds={seconds} status={status} />
        {error ? (
          <p role="alert" className="text-center text-sm text-rq-error">
            {error}
          </p>
        ) : null}
        <RecordControls
          paused={status === 'paused'}
          disabled={status !== 'recording' && status !== 'paused'}
          onDiscard={leave}
          onToggle={toggle}
          onFinish={finish}
        />
        <p className="max-w-xs text-center text-xs text-rq-outline">
          Transcription works best for clips up to about 15 minutes.
        </p>
      </div>
    </Page>
  );
}
