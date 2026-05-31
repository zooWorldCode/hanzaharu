"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import type { CharData } from "@/lib/lesson-data";
import { cn } from "@/lib/utils";

type QuizScreenProps = {
  char: CharData;
  choices: string[];
  answer: string;
  onAnswered: (correct: boolean) => void;
};

export function QuizScreen({ char, choices, answer, onAnswered }: QuizScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const pick = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    onAnswered(choice === answer);
  };

  const isCorrect = selected === answer;

  return (
    <div className="flex flex-col items-center gap-6 px-6 pb-2 pt-6">
      <p className="text-base font-extrabold text-gray-700">
        뜻에 맞는 한자를 고르세요
      </p>

      <div className="flex w-full max-w-xs flex-col items-center gap-2 rounded-3xl border-2 border-[#c2e8a8] bg-[#f0fdf4] px-10 py-8 shadow-sm">
        <span className="text-lg font-extrabold text-gray-700">{char.meaning}</span>
      </div>

      {selected && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "text-sm font-extrabold",
            isCorrect ? "text-[#288b1b]" : "text-[#B56012]",
          )}
        >
          {isCorrect ? "정답이에요" : `정답은 "${answer}" 이에요`}
        </motion.p>
      )}

      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        {choices.map((choice) => {
          const isPicked = selected === choice;
          const isRight = choice === answer;
          let bg = "bg-white border-gray-200";
          let text = "text-gray-800";

          if (selected) {
            if (isRight) {
              bg = "bg-[#f0fdf4] border-[#57B72A]";
              text = "text-[#288b1b]";
            } else if (isPicked) {
              bg = "bg-[#FFFBE6] border-[#C9A227]";
              text = "text-[#B56012]";
            } else {
              bg = "bg-white border-gray-100";
              text = "text-gray-300";
            }
          }

          return (
            <motion.button
              key={choice}
              type="button"
              whileTap={selected ? {} : { scale: 0.95 }}
              onClick={() => pick(choice)}
              className={cn(
                "rounded-2xl border-2 py-5 text-2xl font-extrabold shadow-sm transition-colors",
                bg,
                text,
              )}
            >
              {choice}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
