'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ScanCamera } from '@/components/add/scan-camera';
import { Page, PageHeader } from '@/components/shell/page';
import { AppIcon } from '@/components/ui/app-icon';
import { putBlob } from '@/lib/blob-store';
import { ACCEPT_IMAGES, pickFiles } from '@/lib/files';

/** Add — Scan. Live viewfinder; a capture or an uploaded image opens Scan Result. */
export default function ScanPage() {
  const router = useRouter();
  const [showFrame, setShowFrame] = useState(true);
  const [error, setError] = useState<string>();

  const openResult = async (photo: Blob, name: string) => {
    try {
      const uri = await putBlob(photo, name);
      router.push(`/add/scan-result?uri=${encodeURIComponent(uri)}`);
    } catch {
      setError("We couldn't keep that photo on this device. Please try again.");
    }
  };

  const pickImage = async () => {
    const [file] = await pickFiles({ accept: ACCEPT_IMAGES });
    if (file) await openResult(file, file.name);
  };

  return (
    <Page width="default" className="flex min-h-dvh flex-col lg:min-h-0">
      <PageHeader
        title="Scan Page"
        subtitle="Point at your notes and hold steady."
        back="/add"
        actions={
          <button
            type="button"
            aria-label={showFrame ? 'Hide frame guide' : 'Show frame guide'}
            aria-pressed={showFrame}
            onClick={() => setShowFrame((now) => !now)}
            className="flex size-10 items-center justify-center rounded-pill bg-rq-surface-container text-rq-primary transition hover:bg-rq-surface-variant"
          >
            <AppIcon name="crop-free" size={20} />
          </button>
        }
      />

      <div className="h-[calc(100dvh-15rem)] min-h-105 lg:h-[70vh]">
        <ScanCamera
          showFrame={showFrame}
          onCapture={(photo) => openResult(photo, `scan-${Date.now()}.jpg`)}
          onPickImage={pickImage}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-center text-sm text-rq-error">
          {error}
        </p>
      ) : null}
      <p className="mt-4 text-center text-sm text-rq-on-surface-variant">
        No camera handy?{' '}
        <button type="button" onClick={pickImage} className="font-semibold text-rq-secondary hover:underline">
          Upload an image
        </button>
      </p>
    </Page>
  );
}
