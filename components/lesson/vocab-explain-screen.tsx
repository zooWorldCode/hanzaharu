"use client";

import { motion } from "framer-motion";
import type { CharData } from "@/lib/lesson-data";

export function VocabExplainScreen({ char }: { char: CharData }) {
  const breakdown = char.breakdown ?? [];

  return (
    <div className="flex flex-col gap-3 px-5 pb-4 pt-3">
      {/* 단어 헤더 */}
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-[#F0F9E8] py-3">
        <span className="text-2xl font-extrabold text-gray-900">{char.char}</span>
        <span className="text-base font-bold text-[#4A9B2F]">({char.reading})</span>
      </div>

      {/* 한 글자씩 카드 */}
      <p className="text-center text-[11px] font-bold tracking-widest text-gray-400">
        글자 풀이
      </p>

      {breakdown.map((b, i) => (
        <motion.div
          key={`${b.char}-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-4 rounded-2xl border border-[#D4EBC5] bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F9E8] text-3xl font-extrabold text-[#2D7A1F]">
            {b.char}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-gray-500">음</span>
              <span className="text-base font-extrabold text-[#4A9B2F]">{b.reading}</span>
              <span className="mx-1 text-gray-300">·</span>
              <span className="text-xs font-bold text-gray-500">뜻</span>
              <span className="text-sm font-extrabold text-gray-800">{b.meaning}</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* 단어 뜻 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: breakdown.length * 0.1 + 0.1, duration: 0.3 }}
        className="rounded-2xl bg-[#4A9B2F] p-4 text-white shadow-lg"
      >
        <p className="text-[11px] font-bold opacity-70">단어 뜻</p>
        <p className="mt-1 font-extrabold">
          {char.char}({char.reading})
        </p>
        <p className="mt-1.5 text-sm font-bold opacity-90">
          → {char.meaning}
        </p>
      </motion.div>
    </div>
  );
}
