'use client';

import { useRouter } from 'next/navigation';

import { AppIcon } from '@/components/ui/app-icon';

type Props = {
  /** Centred title — defaults to "Quiz". */
  title?: string;
  /** Called when the ✕ is clicked — exits the quiz. */
  onClose: () => void;
};

/** Quiz top bar: back chevron, centred title in indigo, close ✕. */
export function QuizHeader({ title = 'Quiz', onClose }: Props) {
  const router = useRouter();
  const goBack = () => (window.history.length > 1 ? router.back() : router.push('/quiz'));

  return (
    <header className="mb-4 flex items-center">
      <button
        type="button"
        aria-label="Back"
        onClick={goBack}
        className="flex size-11 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container"
      >
        <AppIcon name="chevron-left" size={26} />
      </button>
      <h1 className="flex-1 text-center font-heading text-xl font-semibold text-rq-primary">{title}</h1>
      <button
        type="button"
        aria-label="Close quiz"
        onClick={onClose}
        className="flex size-11 items-center justify-center rounded-pill text-rq-on-surface-variant transition hover:bg-rq-surface-container"
      >
        <AppIcon name="close" size={22} />
      </button>
    </header>
  );
}
