import type { ReactNode } from 'react';

/** One Settings group: uppercase label over a card of rows. */
export function SettingsSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 px-1 font-sans text-sm font-semibold tracking-[0.05em] text-rq-on-surface-variant uppercase">
        {label}
      </h2>
      <div className="divide-y divide-rq-outline-variant/50 overflow-hidden rounded-inner bg-rq-surface-lowest shadow-soft">
        {children}
      </div>
    </section>
  );
}
