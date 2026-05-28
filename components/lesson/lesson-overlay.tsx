"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { getLessonEntry, buildSteps, type Step } from "@/lib/lesson-data";
import { LessonShell } from "./lesson-shell";
import { LearnScreen } from "./learn-screen";
import { TraceScreen } from "./trace-screen";
import { QuizScreen } from "./quiz-screen";

type LessonOverlayProps = {
  lessonKey: string;  // e.g. "meaning_1_1"
  onClose: () => void;
};

export function LessonOverlay({ lessonKey, onClose }: LessonOverlayProps) {
  const steps = useMemo<Step[]>(() => {
    const entry = getLessonEntry(lessonKey);
    if (!entry) return [];
    return buildSteps(entry);
  }, [lessonKey]);

  const [stepIndex, setStepIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Reset when lesson changes
  useEffect(() => {
    setStepIndex(0);
    setQuizAnswered(false);
  }, [lessonKey]);

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-gray-400 font-bold">준비 중인 레슨이에요</p>
        <button type="button" onClick={onClose} className="text-sm text-[#57B72A] font-extrabold underline">
          돌아가기
        </button>
      </div>
    );
  }

  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    setStepIndex((i) => i + 1);
    setQuizAnswered(false);
  };

  const nextDisabled = step.type === "quiz" && !quizAnswered;

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
