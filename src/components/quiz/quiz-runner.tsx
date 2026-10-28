'use client';

import { useEffect, useEffectEvent, useState } from 'react';

import { NextButton } from '@/components/quiz/next-button';
import { QuizFeedback } from '@/components/quiz/quiz-feedback';
import { type OptionStatus, QuizOption } from '@/components/quiz/quiz-option';
import { QuizProgress } from '@/components/quiz/quiz-progress';
import { QuizQuestion } from '@/components/quiz/quiz-question';
import { SourceChip } from '@/components/quiz/source-chip';
import type { AttemptInput } from '@/store/use-quiz-store';
import type { GeneratedQuiz, MissedQuestion } from '@/types/quiz';

type Props = {
  quiz: GeneratedQuiz;
  /** Called once the last question is answered — carries the scored attempt. */
  onFinish: (attempt: AttemptInput) => void;
};

const LETTER_KEYS = ['a', 'b', 'c', 'd'];

/** Runs a quiz one MCQ per screen with green/red feedback; tracks missed topics.
 *  Keyboard: 1–4 or A–D answers, Enter moves on. */
export function QuizRunner({ quiz, onFinish }: Props) {
  const { questions } = quiz;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [missed, setMissed] = useState<MissedQuestion[]>([]);
  const [finishing, setFinishing] = useState(false);

  const question = questions[index];
  const total = questions.length;
  const answered = selected !== null;
  const isCorrect = selected === question.answerKey;
  const isLast = index === total - 1;

  const statusFor = (key: string): OptionStatus => {
    if (!answered) return 'idle';
    if (key === question.answerKey) return 'correct';
    if (key === selected) return 'wrong';
    return 'idle';
  };

  const onSelect = (key: string) => {
    if (answered) return;
    setSelected(key);
    if (key === question.answerKey) {
      setCorrect((c) => c + 1);
    } else {
      setWeakTopics((t) => (t.includes(question.topic) ? t : [...t, question.topic]));
      setMissed((m) => [...m, { question, selectedKey: key }]);
    }
  };

  const onNext = () => {
    if (!answered || finishing) return;
    if (isLast) {
      setFinishing(true);
      onFinish({ sourceId: quiz.sourceId, sourceLabel: quiz.sourceLabel, total, correct, weakTopics, missed });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, [contenteditable="true"]')) return;
    const key = e.key.toLowerCase();
    if (key === 'enter') {
      // A focused button already fires its own click on Enter — don't double-advance.
      if (target?.closest('button, a')) return;
      e.preventDefault();
      onNext();
      return;
    }
    const pos = /^[1-4]$/.test(key) ? Number(key) - 1 : LETTER_KEYS.indexOf(key);
    const option = pos >= 0 ? question.options[pos] : undefined;
    if (option) {
      e.preventDefault();
      onSelect(option.key);
    }
  });

  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <QuizProgress current={index + 1} total={total} />
      <SourceChip label={quiz.sourceLabel} />
      <QuizQuestion prompt={question.prompt} />

      <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
        {question.options.map((option) => (
          <QuizOption
            key={`${question.id}-${option.key}`}
            letter={option.key}
            text={option.text}
            status={statusFor(option.key)}
            disabled={answered}
            onPress={() => onSelect(option.key)}
          />
        ))}
      </div>

      <div className="min-h-7">{answered ? <QuizFeedback correct={isCorrect} /> : null}</div>

      <p className="hidden text-center text-xs text-rq-on-surface-variant lg:block">
        Tip: press 1–4 or A–D to answer, Enter for the next question.
      </p>

      <div className="sticky bottom-0 -mx-5 bg-rq-surface px-5 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] lg:static lg:mx-0 lg:bg-transparent lg:px-0">
        <NextButton label={isLast ? 'Finish' : 'Next Question'} enabled={answered && !finishing} onPress={onNext} />
      </div>
    </div>
  );
}
