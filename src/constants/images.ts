// Centralized image imports (AGENTS.md → Image Rule). Never import assets directly in screens.
// Static imports give next/image the intrinsic width/height (aspect ratio) for free.

import readiqMark from '../../public/brand/readiq-iqmark.png';
import readiqLogoMark from '../../public/brand/readiq-mark.png';
import readiqWordmarkWhite from '../../public/brand/readiq-wordmark-white.png';
import readiqWordmark from '../../public/brand/readiq-wordmark.png';

export const images = { readiqMark, readiqLogoMark, readiqWordmark, readiqWordmarkWhite };
