"use client";

import { motion } from "framer-motion";
import type { CharData } from "@/lib/lesson-data";

export function IdiomExplainScreen({ char }: { char: CharData }) {
  const breakdown = char.breakdown ?? [];

  return (
    <div className="flex flex-col gap-3 px-5 pb-4 pt-3">
      {/* 섹션 헤더 */}
      <p className="text-center text-[11px] font-bold tracking-widest text-gray-400">
        글자 풀이
      </p>

      {/* 한 글자씩 카드 */}
      {breakdown.map((b, i) => (
        <motion.div
          key={`${b.char}-${i}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.25, ease: "easeOut" }}
          className="flex items-center gap-4 rounded-2xl border border-[#D4EBC5] bg-white px-4 py-3 shadow-sm"
        >
          {/* 한자 */}
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F0F9E8] text-3xl font-extrabold text-[#2D7A1F]">
            {b.char}
          </div>

          {/* 훈음 + 뜻 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-gray-600">{b.huneum}</span>
              <span className="text-base font-extrabold text-[#4A9B2F]">{b.reading}</span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">→ {b.meaning}</p>
          </div>

          {/* 순서 번호 */}
          <span className="shrink-0 text-xl font-extrabold text-[#D4EBC5]">
            {i + 1}
          </span>
        </motion.div>
      ))}

      {/* 전체 성어 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: breakdown.length * 0.1 + 0.15, duration: 0.3 }}
        className="rounded-2xl bg-[#4A9B2F] p-5 text-white shadow-lg"
      >
        {/* 한자 표기 */}
        <p className="text-center text-2xl font-extrabold tracking-[0.2em]">
          {char.reading}
        </p>

        {/* 직역 */}
        {char.origin && (
          <div className="mt-3 rounded-xl bg-white/15 px-4 py-2.5">
            <p className="text-center text-sm font-bold leading-snug">
              {char.origin}
            </p>
          </div>
        )}

        {/* 의미 */}
        <p className="mt-3 text-center text-xs font-bold opacity-80">
          → {char.meaning}
        </p>
      </motion.div>
    </div>
  );
}
