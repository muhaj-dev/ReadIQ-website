/** The current question, shown large and bold. */
export function QuizQuestion({ prompt }: { prompt: string }) {
  return (
    <h2 className="font-heading text-2xl leading-[30px] font-bold text-rq-primary lg:text-[28px] lg:leading-9">
      {prompt}
    </h2>
  );
}
