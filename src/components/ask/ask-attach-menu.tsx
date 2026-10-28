'use client';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  disabled?: boolean;
  onLibrary: () => void;
  onCamera: () => void;
};

type Option = { icon: AppIconName; label: string; hint: string; run: 'library' | 'camera' };

const OPTIONS: Option[] = [
  { icon: 'image', label: 'Upload image', hint: 'Pick an image to ask about', run: 'library' },
  { icon: 'center-focus', label: 'Take photo', hint: 'Snap a page or slide now', run: 'camera' },
];

/** The "+" attach menu: add an image (upload or camera) for the AI to read. */
export function AskAttachMenu({ disabled, onLibrary, onCamera }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        render={
          <button
            type="button"
            aria-label="Add an image"
            className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-rq-surface-container text-rq-secondary transition hover:bg-rq-surface-variant disabled:opacity-50"
          />
        }
      >
        <AppIcon name="add" size={22} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={10} className="w-64 rounded-card p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 pt-1.5 pb-1 text-[11px] font-bold tracking-[0.08em] text-rq-on-surface-variant">
            ADD AN IMAGE
          </DropdownMenuLabel>
          {OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.run}
              onClick={() => (option.run === 'library' ? onLibrary() : onCamera())}
              className="gap-3 rounded-inner px-3 py-2.5"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-rq-secondary-fixed/50 text-rq-secondary">
                <AppIcon name={option.icon} size={20} />
              </span>
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold text-rq-on-surface">{option.label}</span>
                <span className="text-xs text-rq-outline">{option.hint}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
