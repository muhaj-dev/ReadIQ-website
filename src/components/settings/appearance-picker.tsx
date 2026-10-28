'use client';

import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

const OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
] as const;

/** Light / Dark / System segmented control for the Appearance row (next-themes). */
export function AppearancePicker() {
  const { theme, setTheme } = useTheme();
  const current = theme ?? 'light';

  return (
    <div role="radiogroup" aria-label="Appearance" className="flex shrink-0 rounded-pill bg-rq-surface-container p-1">
      {OPTIONS.map((option) => {
        const selected = current === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={cn(
              'rounded-pill px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:text-sm',
              selected
                ? 'bg-rq-surface-lowest text-rq-primary shadow-soft'
                : 'text-rq-on-surface-variant hover:text-rq-on-surface',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
