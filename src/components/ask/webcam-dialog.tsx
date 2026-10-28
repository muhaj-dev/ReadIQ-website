'use client';

import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Props = {
  open: boolean;
  onClose: () => void;
  /** A JPEG of the captured frame. */
  onCapture: (blob: Blob) => void;
  /** No camera / permission denied → caller falls back to the file picker with this message. */
  onFallback: (message: string) => void;
};

const CAMERA_DENIED = 'Camera access is off — use “Upload image” to pick a photo instead.';
const NO_CAMERA = 'No camera found — use “Upload image” to pick a photo instead.';

/** Desktop "Take photo": a live webcam preview with a capture button. */
export function WebcamDialog({ open, onClose, onCapture, onFallback }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  // Latest fallback without restarting the camera when the parent re-renders.
  const fallbackRef = useRef(onFallback);
  useEffect(() => {
    fallbackRef.current = onFallback;
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : '';
        fallbackRef.current(name === 'NotFoundError' || name === 'OverconstrainedError' ? NO_CAMERA : CAMERA_DENIED);
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setReady(false);
    };
  }, [open]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
        onClose();
      },
      'image/jpeg',
      0.9,
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="gap-4 rounded-card bg-rq-surface-lowest p-5 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-bold text-rq-on-surface">Take a photo</DialogTitle>
          <DialogDescription className="text-rq-on-surface-variant">
            Hold your page or slide up to the camera, then capture.
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video overflow-hidden rounded-inner bg-rq-surface-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedData={() => setReady(true)}
            className="size-full object-cover"
          />
          {!ready ? (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-rq-on-surface-variant">
              <Loader2 className="size-4 animate-spin" />
              Starting camera…
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="h-11 rounded-btn px-4">
            Cancel
          </Button>
          <Button onClick={capture} disabled={!ready} className="h-11 gap-2 rounded-btn px-5">
            <AppIcon name="center-focus" size={18} />
            Capture
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
