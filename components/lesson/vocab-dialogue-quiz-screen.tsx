"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Line = { speaker: string; line: string };

type VocabDialogueQuizScreenProps = {
  dialogue: Line[];
  highlighted: string;   // "부모"
  choices: string[];     // ["父母", "兄弟", "姉妹", "親戚"]
  answer: string;        // "父母"
  onAnswered: (correct: boolean) => void;
};

const SPEAKER_EMOJI: Record<string, string> = {
  "선생님": "👩‍🏫",
  "엄마": "👩",
  "아빠": "👨",
  "지아": "👧",
  "현우": "🧒",
  "민준": "👦",
};

function getEmoji(speaker: string) {
  return SPEAKER_EMOJI[speaker] ?? "🙂";
}

function HighlightedLine({ line, highlighted }: { line: string; highlighted: string }) {
  if (!line.includes(highlighted)) {
    return <span>{line}</span>;
  }
  const parts = line.split(highlighted);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="mx-0.5 inline-block rounded-md bg-[#FFFBE6] px-1.5 py-0.5 font-extrabold text-[#B56012] ring-1 ring-[#C9A227]/40">
              {highlighted}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

export function VocabDialogueQuizScreen({
  dialogue,
  highlighted,
  choices,
  answer,
  onAnswered,
}: VocabDialogueQuizScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function pick(choice: string) {
    if (selected) return;
    setSelected(choice);
    onAnswered(choice === answer);
  }

  const isCorrect = selected === answer;

  return (
    <div className="flex flex-col gap-4 px-5 pb-4 pt-3">
      {/* 안내 */}
      <p className="text-center text-sm font-extrabold text-gray-700">
        밑줄 친 단어의 한자를 고르세요
      </p>

      {/* 대화문 */}
      <div className="rounded-2xl border border-[#D4EBC5] bg-[#F0F9E8] p-4 space-y-3">
        {dialogue.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5",
              i % 2 === 1 ? "flex-row-reverse" : "flex-row",
            )}
          >
            {/* 아바타 */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
              {getEmoji(line.speaker)}
            </div>

            {/* 말풍선 */}
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm font-bold leading-relaxed shadow-sm",
                i % 2 === 0
                  ? "rounded-tl-none bg-white text-gray-800"
                  : "rounded-tr-none bg-[#57B72A] text-white",
              )}
            >
              <p className="mb-0.5 text-[10px] font-semibold opacity-60">{line.speaker}</p>
              <HighlightedLine line={line.line} highlighted={highlighted} />
            </div>
          </div>
        ))}
      </div>

      {/* 피드백 */}
      <AnimatePresence>
        {selected && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-center text-sm font-extrabold",
              isCorrect ? "text-[#288b1b]" : "text-[#B56012]",
            )}
          >
            {isCorrect ? "🎉 정답이에요!" : `❌ 정답은 "${answer}"이에요`}
          </motion.p>
        )}
      </AnimatePresence>

      {/* 객관식 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          const isPicked = selected === choice;
          const isRight = choice === answer;
          let className = "border-gray-200 bg-white text-gray-800";
          if (selected) {
            if (isRight)       className = "border-[#57B72A] bg-[#f0fdf4] text-[#288b1b]";
            else if (isPicked) className = "border-[#C9A227] bg-[#FFFBE6] text-[#B56012]";
            else               className = "border-gray-100 bg-gray-50 text-gray-300";
          }
          return (
            <motion.button
              key={choice}
              type="button"
              whileTap={selected ? {} : { scale: 0.95 }}
              onClick={() => pick(choice)}
              className={cn(
                "rounded-2xl border-2 py-4 text-xl font-extrabold shadow-sm transition-colors",
                className,
              )}
            >
              {choice}
              {selected && isRight  && <span className="ml-1 text-sm">✓</span>}
              {selected && isPicked && !isRight && <span className="ml-1 text-sm">✗</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
