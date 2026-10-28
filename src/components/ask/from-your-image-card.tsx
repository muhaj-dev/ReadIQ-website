import { AppIcon } from '@/components/ui/app-icon';

/** Trust tag proving the answer used the photo the student attached to this question. */
export function FromYourImageCard() {
  return (
    <div className="flex max-w-[70%] items-center gap-3 self-start rounded-inner border border-rq-topic-amber-border bg-rq-topic-amber-bg/80 p-3 text-rq-topic-amber-ink">
      <div className="flex size-8 items-center justify-center rounded-lg bg-rq-surface-lowest/60">
        <AppIcon name="image" size={18} />
      </div>
      <span className="text-[10px] font-bold tracking-[0.08em]">FROM YOUR IMAGE</span>
    </div>
  );
}
