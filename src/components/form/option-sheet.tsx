'use client';

import { useState } from 'react';

import { AppIcon } from '@/components/ui/app-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { SheetOption } from '@/types/sheet';

export type { SheetOption };

type Props = {
  visible: boolean;
  /** Heading for the picker (screen readers + the sheet's top bar). */
  title: string;
  options: SheetOption[];
  selected: string;
  onSelect: (label: string) => void;
  onCancel: () => void;
  /** When set, shows an inline "add" row that lets the student type a new option. */
  onAddOption?: (name: string) => void;
  /** Label + placeholder for the add row (e.g. "Add subject or course"). */
  addLabel?: string;
};

/** Option picker with a check on the selected row — a bottom sheet on phones,
 *  a centred dialog on desktop (the mobile app's OptionSheet). */
export function OptionSheet({ visible, title, options, selected, onSelect, onCancel, onAddOption, addLabel = 'Add new' }: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const submitNew = () => {
    const name = draft.trim();
    if (name) onAddOption?.(name);
    setDraft('');
    setAdding(false);
  };

  return (
    <Dialog open={visible} onOpenChange={(open) => (open ? undefined : onCancel())}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col top-auto bottom-0 max-h-[85dvh] max-w-full translate-y-0 gap-0 overflow-hidden rounded-t-3xl rounded-b-none bg-rq-surface-lowest p-0 sm:top-1/2 sm:bottom-auto sm:max-w-md sm:-translate-y-1/2 sm:rounded-2xl"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-rq-outline-variant/30 px-5">
          <button type="button" onClick={onCancel} className="px-2 text-sm font-bold text-rq-primary">
            Cancel
          </button>
          <DialogTitle className="text-sm font-bold text-rq-on-surface">{title}</DialogTitle>
          <span className="w-16" aria-hidden />
        </div>

        <div className="overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]" role="listbox" aria-label={title}>
          {options.map((option, index) => {
            const isSelected = !option.chevron && option.label === selected;
            return (
              <button
                key={option.label}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.chevron}
                onClick={() => onSelect(option.label)}
                className={cn(
                  'flex w-full items-center justify-between px-5 py-4 text-left text-base transition hover:bg-rq-surface-low disabled:opacity-50',
                  index > 0 && 'border-t border-rq-outline-variant/30',
                  isSelected ? 'bg-rq-surface-low/40 font-bold text-rq-primary' : 'text-rq-on-surface',
                )}
              >
                {option.label}
                {isSelected ? <AppIcon name="check" size={20} /> : null}
                {option.chevron ? <AppIcon name="chevron-right" size={20} className="text-rq-outline-variant" /> : null}
              </button>
            );
          })}

          {onAddOption ? (
            <div className="border-t border-rq-outline-variant/30">
              {adding ? (
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitNew();
                  }}
                  onBlur={submitNew}
                  placeholder={addLabel}
                  className="w-full bg-transparent px-5 py-4 text-base text-rq-on-surface outline-none placeholder:text-rq-outline-variant"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="flex w-full items-center gap-2 px-5 py-4 text-base font-semibold text-rq-primary transition hover:bg-rq-surface-low"
                >
                  <AppIcon name="add" size={20} />
                  {addLabel}
                </button>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
