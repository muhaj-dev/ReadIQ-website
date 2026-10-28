'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

type Props = {
  /** Renderable URL (from useFileUrl) of the image to show; null closes it. */
  src: string | null;
  alt: string;
  onClose: () => void;
};

/** Full-size image viewer for note attachments and the content preview. */
export function ImageLightbox({ src, alt, onClose }: Props) {
  return (
    <Dialog open={src != null} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="max-h-[92dvh] gap-3 bg-rq-surface-lowest p-3 sm:max-w-4xl">
        <DialogTitle className="truncate pr-10 text-sm font-semibold text-rq-on-surface">{alt}</DialogTitle>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL, not optimizable
          <img src={src} alt={alt} className="max-h-[80dvh] w-full rounded-inner object-contain" />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
