type Props = {
  title: string;
  subtitle: string;
};

/** Centred headline + subtitle above the subject list / result. */
export function QuizIntro({ title, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="font-heading text-[26px] leading-8 font-bold text-rq-on-surface lg:text-3xl">{title}</h2>
      <p className="mt-2 max-w-sm text-base text-rq-on-surface-variant">{subtitle}</p>
    </div>
  );
}
