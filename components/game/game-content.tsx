"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GAMES = [
  {
    id: "card",
    title: "한자 카드 맞히기",
    description: "뒤집힌 카드를 맞춰 보세요!",
    emoji: "🃏",
    difficulty: "쉬움",
  },
  {
    id: "speed",
    title: "스피드 한자",
    description: "제한 시간 안에 빠르게 맞혀요!",
    emoji: "⚡",
    difficulty: "보통",
  },
  {
    id: "word",
    title: "단어 조합",
    description: "한자를 모아 단어를 완성해요.",
    emoji: "🧩",
    difficulty: "보통",
  },
  {
    id: "draw",
    title: "한자 따라쓰기",
    description: "화면에 한자를 따라 그려요.",
    emoji: "✍️",
    difficulty: "쉬움",
  },
];

export function GameContent() {
  return (
    <motion.div
      className="h-[calc(100dvh-7rem)] overflow-y-auto overscroll-y-contain px-4 pb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">한자 게임</h1>
        <p className="text-base text-gray-500">게임을 골라 도전해 보세요</p>
      </div>

      <motion.div className="flex flex-col gap-4">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="rounded-3xl border-2 border-gray-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl">
                  {game.emoji}
                </span>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {game.title}
                  </CardTitle>
                  <p className="mt-1 text-sm font-medium text-[#57B72A]">
                    {game.difficulty}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <p className="text-base text-gray-600">{game.description}</p>
                <Button className="h-12 w-full rounded-2xl bg-[#57B72A] text-base font-bold text-white hover:bg-[#4aa323]">
                  시작하기
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
