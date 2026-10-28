'use client';

import { useRouter } from 'next/navigation';

import { MethodCard } from '@/components/add/method-card';
import { TipCard } from '@/components/add/tip-card';
import { Page } from '@/components/shell/page';
import { AppIcon } from '@/components/ui/app-icon';
import { addMethods, addNoteTip } from '@/data/add-methods';

/** Add Note — choose one of the four methods (see the add-note mock). */
export default function AddNotePage() {
  const router = useRouter();

  const close = () => {
    if (window.history.length > 1) router.back();
    else router.push('/home');
  };

  return (
    <Page width="wide">
      <header className="mb-8 flex items-center justify-between lg:mb-4">
        <h1 className="font-heading text-lg font-bold text-rq-on-surface lg:sr-only">Add Note</h1>
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="ml-auto flex size-10 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container"
        >
          <AppIcon name="close" size={24} />
        </button>
      </header>

      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="mb-2 font-heading text-[26px] leading-8 font-extrabold text-rq-on-surface lg:text-4xl lg:leading-tight">
          How do you want to add your note?
        </h2>
        <p className="text-base text-rq-on-surface-variant">
          Select your preferred method to start processing academic information with AI.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {addMethods.map((method) => (
          <MethodCard key={method.key} method={method} />
        ))}
      </div>

      <TipCard title={addNoteTip.title} body={addNoteTip.body} />
    </Page>
  );
}
