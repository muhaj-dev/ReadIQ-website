import { AppIcon } from '@/components/ui/app-icon';
import { cn } from '@/lib/utils';

type Props = {
  /** Disables the shutter while a capture is in flight or the camera isn't live. */
  canCapture: boolean;
  /** Torch toggle (only rendered when the camera supports it). */
  torch?: { on: boolean; toggle: () => void };
  onPickImage: () => void;
  onCapture: () => void;
};

/** Camera bottom bar: upload image · shutter · flash (see the scan mock). Fixed dark chrome. */
export function ScanControls({ canCapture, torch, onPickImage, onCapture }: Props) {
  return (
    <div className="flex items-center justify-between bg-black px-6 py-6 sm:px-10">
      <button
        type="button"
        onClick={onPickImage}
        aria-label="Upload an image instead"
        title="Upload an image"
        className="flex size-14 items-center justify-center rounded-inner border border-white/20 bg-white/10 text-white/85 transition hover:bg-white/20"
      >
        <AppIcon name="image" size={26} />
      </button>

      <div className="relative flex items-center justify-center">
        <span className="absolute size-22 rounded-pill border-2 border-white/40" />
        <button
          type="button"
          aria-label="Take photo"
          disabled={!canCapture}
          onClick={onCapture}
          className="flex size-18 items-center justify-center rounded-pill bg-white shadow-lg shadow-white/20 transition active:scale-95 disabled:opacity-50"
        >
          <span className="size-16 rounded-pill border-2 border-black/15" />
        </button>
      </div>

      {torch ? (
        <button
          type="button"
          onClick={torch.toggle}
          aria-label={torch.on ? 'Turn flash off' : 'Turn flash on'}
          className={cn(
            'flex size-14 items-center justify-center rounded-pill bg-white/10 transition hover:bg-white/20',
            torch.on ? 'text-white' : 'text-white/60',
          )}
        >
          <AppIcon name={torch.on ? 'flash-on' : 'flash-off'} size={24} />
        </button>
      ) : (
        <span className="size-14" />
      )}
    </div>
  );
}
