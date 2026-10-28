import { cn } from '@/lib/utils';

type Props = {
  id?: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  /** Notes field — taller box, top-aligned text. */
  multiline?: boolean;
  /** Show a danger border — e.g. a required field left blank on save. */
  error?: boolean;
  autoFocus?: boolean;
};

const BASE =
  'w-full rounded-lg border-2 bg-rq-surface-lowest px-4 text-base text-rq-on-surface shadow-[0_1px_2px_rgb(0_0_0/0.05)] outline-none transition placeholder:text-rq-outline-variant focus:border-rq-secondary-container';

/** White filled input that gains an indigo focus ring. */
export function FormInput({ id, value, onChange, placeholder, multiline = false, error = false, autoFocus }: Props) {
  const border = error ? 'border-rq-error' : 'border-transparent';
  if (multiline) {
    return (
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={cn(BASE, border, 'min-h-26 resize-y py-3.5 leading-6')}
      />
    );
  }
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      aria-invalid={error || undefined}
      className={cn(BASE, border, 'h-12')}
    />
  );
}
