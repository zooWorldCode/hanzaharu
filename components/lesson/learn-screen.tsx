"use client";

import type { CharData } from "@/lib/lesson-data";

type LearnScreenProps = {
  char: CharData;
};

export function LearnScreen({ char }: LearnScreenProps) {
  const isIdiom = char.strokes === 0;

  return (
    <div className="flex flex-col items-center px-6 pt-6 pb-4 gap-5">
      {/* Emoji */}
      <div className="text-6xl">{char.emoji}</div>

      {/* Character card */}
      <div className="w-full max-w-xs rounded-3xl bg-[#f0fdf4] border-2 border-[#c2e8a8] shadow-sm overflow-hidden">
        {/* Big character */}
        <div className="flex items-center justify-center py-8 bg-white">
          <span
            className="font-bold leading-none text-gray-800 select-none"
            style={{ fontSize: isIdiom ? "2.4rem" : "5.5rem" }}
          >
            {char.char}
          </span>
        </div>

        {/* Info rows */}
        <div className="divide-y divide-[#d6efc8] px-5 py-2">
          <InfoRow label="음" value={char.reading} />
          <InfoRow label="뜻" value={char.meaning} />
          {!isIdiom && <InfoRow label="부수" value={char.radical} />}
          {!isIdiom && <InfoRow label="획수" value={`${char.strokes}획`} />}
          {isIdiom && <InfoRow label="한자" value={char.reading} />}
        </div>
      </div>

      {/* Description */}
      {char.desc && (
        <p className="text-center text-sm font-semibold text-gray-500 max-w-xs">
          {char.desc}
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-base font-extrabold text-gray-800">{value}</span>
    </div>
  );
}
