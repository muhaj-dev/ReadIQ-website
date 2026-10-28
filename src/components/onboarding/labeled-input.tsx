import type { HTMLInputTypeAttribute } from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
  /** Show an accent asterisk marking the field as required. */
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  /** Inline validation message, shown under the field. */
  error?: string;
};

/** "Tell us about you" form field: label + input that lifts on focus. */
export function LabeledInput({ id, label, value, placeholder, onChange, required, type = 'text', autoComplete, error }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-rq-on-surface">
        {label}
        {required ? <span className="text-rq-primary"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-transparent bg-rq-surface-low px-4 py-3 text-base text-rq-on-surface transition outline-none placeholder:text-rq-outline-variant dark:placeholder:text-rq-outline focus:border-rq-secondary-container focus:bg-rq-surface-lowest aria-invalid:border-rq-error"
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-rq-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
