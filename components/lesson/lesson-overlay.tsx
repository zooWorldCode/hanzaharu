"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { buildSteps, getLessonEntry, type Step } from "@/lib/lesson-data";
import { IdiomExplainScreen } from "./idiom-explain-screen";
import { IdiomTraceScreen } from "./idiom-trace-screen";
import { LearnScreen } from "./learn-screen";
import { LessonShell } from "./lesson-shell";
import { QuizScreen } from "./quiz-screen";
import { TraceScreen } from "./trace-screen";
import { VocabExplainScreen } from "./vocab-explain-screen";
import { VocabDialogueQuizScreen } from "./vocab-dialogue-quiz-screen";

type LessonOverlayProps = {
  lessonKey: string;
  onClose: () => void;
  onComplete?: () => void;
};

export function LessonOverlay({ lessonKey, onClose, onComplete }: LessonOverlayProps) {
  const steps = useMemo<Step[]>(() => {
    const entry = getLessonEntry(lessonKey);
    if (!entry) return [];
    return buildSteps(entry);
  }, [lessonKey]);

  const [stepIndex, setStepIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setQuizAnswered(false);
  }, [lessonKey]);

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white">
        <p className="font-bold text-gray-400">준비 중인 학습입니다.</p>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-extrabold text-[#57B72A] underline"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onComplete?.();
      onClose();
      return;
    }

    setStepIndex((index) => index + 1);
    setQuizAnswered(false);
  };

  const goPrev = () => {
    if (stepIndex === 0) return;
    setStepIndex((index) => index - 1);
    setQuizAnswered(false);
  };

  const nextDisabled =
    (step.type === "quiz" || step.type === "vocab-dialogue-quiz") && !quizAnswered;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 280 }}
      className="fixed inset-0 z-50"
    >
      <LessonShell
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onClose={onClose}
        onPrev={goPrev}
        onNext={goNext}
        nextDisabled={nextDisabled}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {step.type === "learn" && <LearnScreen char={step.char} />}
            {step.type === "trace" && <TraceScreen char={step.char} />}
            {step.type === "idiom-explain" && <IdiomExplainScreen char={step.char} />}
            {step.type === "idiom-trace" && (
              <IdiomTraceScreen
                traceChar={step.traceChar}
                traceHuneum={step.traceHuneum}
                traceReading={step.traceReading}
                traceMeaning={step.traceMeaning}
                traceIndex={step.traceIndex}
                traceTotal={step.traceTotal}
              />
            )}
            {step.type === "vocab-explain" && <VocabExplainScreen char={step.char} />}
            {step.type === "vocab-dialogue-quiz" && (
              <VocabDialogueQuizScreen
                dialogue={step.dialogue}
                highlighted={step.highlighted}
                choices={step.choices}
                answer={step.answer}
                onAnswered={() => setQuizAnswered(true)}
              />
            )}
            {step.type === "quiz" && (
              <QuizScreen
                char={step.char}
                choices={step.choices}
                answer={step.answer}
                onAnswered={() => setQuizAnswered(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </LessonShell>
    </motion.div>
  );
}
