'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { ScanControls } from './scan-controls';
import { ScanFrame } from './scan-frame';
import { ScanPermission } from './scan-permission';

type CameraState = 'starting' | 'live' | 'denied' | 'unsupported' | 'error';

type Props = {
  /** A captured frame as a JPEG blob. */
  onCapture: (photo: Blob) => void;
  /** Open the file picker for an existing photo. */
  onPickImage: () => void;
  /** Hide the framing overlay. */
  showFrame: boolean;
};

type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };

/** Live viewfinder (rear camera preferred) + shutter. Frames are captured to a canvas → JPEG. */
export function ScanCamera({ onCapture, onPickImage, showFrame }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>('starting');
  const [attempt, setAttempt] = useState(0);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!navigator.mediaDevices?.getUserMedia) {
      queueMicrotask(() => setState('unsupported'));
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then((stream) => {
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const caps = stream.getVideoTracks()[0]?.getCapabilities?.() as TorchCapabilities | undefined;
        setTorchSupported(!!caps?.torch);
        setState('live');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err instanceof DOMException ? err.name : '';
        if (name === 'NotAllowedError' || name === 'SecurityError') setState('denied');
        else if (name === 'NotFoundError' || name === 'OverconstrainedError') setState('unsupported');
        else setState('error');
      });
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [attempt]);

  const retry = () => {
    setState('starting');
    setAttempt((n) => n + 1);
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn } as MediaTrackConstraintSet] });
      setTorchOn((now) => !now);
    } catch {
      setTorchSupported(false);
    }
  };

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || busy || !video.videoWidth) return;
    setBusy(true);
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        setBusy(false);
        if (blob) onCapture(blob);
      },
      'image/jpeg',
      0.9,
    );
  }, [busy, onCapture]);

  const blocked = state === 'denied' || state === 'unsupported' || state === 'error';

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card bg-black">
      <div className="relative min-h-0 flex-1">
        {blocked ? (
          <ScanPermission reason={state} onRetry={retry} onPickImage={onPickImage} />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 size-full object-cover" />
            {state === 'starting' ? (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-white/70">Opening camera…</p>
            ) : null}
            {showFrame && state === 'live' ? <ScanFrame /> : null}
          </>
        )}
      </div>
      <ScanControls
        canCapture={state === 'live' && !busy}
        torch={torchSupported ? { on: torchOn, toggle: toggleTorch } : undefined}
        onPickImage={onPickImage}
        onCapture={capture}
      />
    </div>
  );
}
