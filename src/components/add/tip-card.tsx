import { AppIcon } from '@/components/ui/app-icon';

/** The tinted tip banner under the method grid, with a sparkle watermark. */
export function TipCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative overflow-hidden rounded-card border border-rq-outline-variant/30 bg-rq-surface-low p-6">
      <p className="mb-2 font-semibold text-rq-primary">{title}</p>
      <p className="relative max-w-xl text-sm leading-relaxed text-rq-on-surface-variant">{body}</p>
      <AppIcon name="auto-awesome" size={120} className="pointer-events-none absolute -right-4 -bottom-4 text-rq-primary/10" />
    </div>
  );
}
