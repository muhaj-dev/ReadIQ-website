import { BrandLogo } from '@/components/shell/brand-logo';

/** readIQ wordmark that swaps to the white lockup in dark mode (CSS only, no flash). */
export function ThemedLogo({ width = 88, priority }: { width?: number; priority?: boolean }) {
  return (
    <>
      <BrandLogo width={width} priority={priority} className="dark:hidden" />
      <BrandLogo width={width} priority={priority} onDark className="hidden dark:block" />
    </>
  );
}
