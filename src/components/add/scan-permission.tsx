import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

type Props = {
  reason: 'denied' | 'unsupported' | 'error';
  onRetry: () => void;
  onPickImage: () => void;
};

const COPY = {
  denied: {
    title: 'Camera access is blocked',
    body: 'Allow camera access in your browser (the camera icon in the address bar), then try again — or upload a photo of your notes instead.',
  },
  unsupported: {
    title: 'No camera available',
    body: "This browser or device can't open a camera here. Upload a photo of your notes instead.",
  },
  error: {
    title: "Couldn't start the camera",
    body: 'Another app may be using it. Try again, or upload a photo of your notes instead.',
  },
} as const;

/** Shown in the viewfinder when the camera can't run — always offers the upload fallback. */
export function ScanPermission({ reason, onRetry, onPickImage }: Props) {
  const copy = COPY[reason];
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center text-white">
      <span className="flex size-16 items-center justify-center rounded-pill bg-white/10">
        <AppIcon name="document-scanner" size={30} />
      </span>
      <h2 className="mt-5 font-heading text-xl font-bold">{copy.title}</h2>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-white/70">{copy.body}</p>
      <div className="mt-7 flex w-full max-w-xs flex-col gap-2">
        <Button onClick={onPickImage} className="h-12 rounded-btn text-base font-semibold">
          Upload an image
        </Button>
        {reason !== 'unsupported' ? (
          <Button variant="ghost" onClick={onRetry} className="h-11 text-[15px] font-semibold text-white hover:bg-white/10 hover:text-white">
            Try the camera again
          </Button>
        ) : null}
      </div>
    </div>
  );
}
