"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QUESTIONS = [
  {
    id: 1,
    prompt: "다음 한자의 뜻은?",
    character: "山",
    choices: ["산", "물", "불", "나무"],
    answer: 0,
  },
  {
    id: 2,
    prompt: "다음 한자의 음은?",
    character: "水",
    choices: ["화", "수", "목", "금"],
    answer: 1,
  },
  {
    id: 3,
    prompt: "'사람' 뜻의 한자는?",
    character: "?",
    choices: ["人", "女", "子", "大"],
    answer: 0,
  },
  {
    id: 4,
    prompt: "다음 한자의 뜻은?",
    character: "火",
    choices: ["흙", "불", "해", "달"],
    answer: 1,
  },
];

export function TestContent() {
  return (
    <motion.div
      className="h-[calc(100dvh-7rem)] px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">한자 시험</h1>
        <p className="text-base text-gray-500">좌우로 넘기며 문제를 풀어요</p>
      </div>

      <div className="flex h-[calc(100%-4rem)] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUESTIONS.map((q, index) => (
          <Card
            key={q.id}
            className="w-[min(100%,22rem)] shrink-0 snap-center rounded-3xl border-2 border-gray-200 bg-white shadow-sm"
          >
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-500">
                문제 {index + 1} / {QUESTIONS.length}
              </CardTitle>
              <p className="text-lg font-bold text-gray-900">{q.prompt}</p>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <div className="flex h-32 items-center justify-center rounded-2xl bg-gray-100">
                <span className="text-6xl font-bold text-gray-900">
                  {q.character}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {q.choices.map((choice, choiceIndex) => (
                  <button
                    key={choice}
                    type="button"
                    className="min-h-14 rounded-2xl border-2 border-gray-200 bg-gray-50 text-base font-semibold text-gray-800 transition-colors active:bg-[#57B72A]/20"
                    aria-pressed={choiceIndex === q.answer}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
