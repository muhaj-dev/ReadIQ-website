import { BrandLogo } from '@/components/shell/brand-logo';

/** Hero: the readIQ mark above the "Ask anything from your notes" headline. */
export function AskHero() {
  return (
    <div className="flex flex-col items-center">
      <BrandLogo variant="mark" width={56} priority />
      <h2 className="mt-6 text-center font-heading text-[28px] leading-[34px] font-extrabold tracking-tight text-rq-primary lg:text-[34px] lg:leading-[40px]">
        Ask anything
        <br />
        from your notes
      </h2>
      <p className="mt-3 max-w-xs text-center text-sm text-rq-on-surface-variant">
        I&apos;ll only answer from what you&apos;ve saved — and show you which note it came from.
      </p>
    </div>
  );
}
