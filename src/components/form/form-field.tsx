import type { ReactNode } from 'react';

type Props = {
  label: string;
  /** id of the control the label names (inputs); omit for button rows. */
  htmlFor?: string;
  children: ReactNode;
};

/** Form section: muted label above its control (Title, Subject, Type, …). */
export function FormField({ label, htmlFor, children }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="ml-1 text-sm font-semibold text-rq-on-surface-variant">
        {label}
      </label>
      {children}
    </div>
  );
}
