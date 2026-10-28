'use client';

import { AppIcon } from '@/components/ui/app-icon';
import { useFileUrl } from '@/lib/blob-store';

/** The captured page (Scan Result), with the "Optimized" badge from the mock. */
export function ScanPreview({ uri }: { uri?: string }) {
  const url = useFileUrl(uri);

  return (
    <div className="relative overflow-hidden rounded-inner border border-rq-outline-variant bg-rq-surface-container shadow-soft">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL
        <img src={url} alt="Your scanned page" className="max-h-[70vh] w-full object-contain" />
      ) : (
        <div className="flex aspect-4/3 items-center justify-center text-rq-on-surface-variant">
          <AppIcon name="image" size={40} />
        </div>
      )}
      {url ? (
        <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-pill bg-rq-primary-container px-3 py-1.5 text-xs font-semibold text-rq-on-primary shadow-soft">
          <AppIcon name="check-circle" size={14} />
          Optimized
        </span>
      ) : null}
    </div>
  );
}
