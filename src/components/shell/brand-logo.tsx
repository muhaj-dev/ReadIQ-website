import Image from 'next/image';

import { images } from '@/constants/images';

type Props = {
  /** Rendered width in px; height follows the lockup's aspect ratio. */
  width?: number;
  /** 'wordmark' = full "readIQ" lockup, 'mark' = the square ✦IQ glyph. */
  variant?: 'wordmark' | 'mark';
  /** Light lockup for dark/indigo backgrounds. */
  onDark?: boolean;
  priority?: boolean;
  className?: string;
};

/** The readIQ brand lockup (PNG from the mobile app's assets). */
export function BrandLogo({ width = 120, variant = 'wordmark', onDark = false, priority, className }: Props) {
  const src = variant === 'mark' ? images.readiqMark : onDark ? images.readiqWordmarkWhite : images.readiqWordmark;
  return (
    <Image
      src={src}
      alt="readIQ"
      width={width}
      height={Math.round(width * src.height / src.width)}
      priority={priority}
      className={className}
    />
  );
}
