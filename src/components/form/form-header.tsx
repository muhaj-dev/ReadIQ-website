'use client';

import { BackButton } from '@/components/shell/page';

type Props = {
  title: string;
  /** Where the back chevron goes. */
  backTo: string;
  onSave: () => void;
  saving?: boolean;
};

/** Add-form top bar: back chevron · centred title · Save in indigo. */
export function FormHeader({ title, backTo, onSave, saving = false }: Props) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3">
      <BackButton to={backTo} />
      <h1 className="font-heading text-lg font-bold text-rq-on-surface lg:text-2xl">{title}</h1>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="h-11 rounded-btn px-4 text-sm font-bold text-rq-primary transition hover:bg-rq-surface-container disabled:opacity-50"
      >
        Save
      </button>
    </header>
  );
}
