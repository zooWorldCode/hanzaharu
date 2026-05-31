"use client";

import type { CharData } from "@/lib/lesson-data";

type LearnScreenProps = {
  char: CharData;
};

export function LearnScreen({ char }: LearnScreenProps) {
  const isIdiom = char.strokes === 0;

  return (
    <div className="flex flex-col items-center gap-5 px-6 pb-4 pt-6">
      <div className="w-full max-w-xs overflow-hidden rounded-3xl border-2 border-[#c2e8a8] bg-[#f0fdf4] shadow-sm">
        <div className="flex items-center justify-center bg-white py-8">
          <span
            className="select-none font-bold leading-none text-gray-800"
            style={{ fontSize: isIdiom ? "2.4rem" : "5.5rem" }}
          >
            {char.char}
          </span>
        </div>

        <div className="divide-y divide-[#d6efc8] px-5 py-2">
          <InfoRow label="음" value={char.reading} />
          <InfoRow label="뜻" value={char.meaning} />
          {!isIdiom && <InfoRow label="부수" value={char.radical} />}
          {!isIdiom && <InfoRow label="획수" value={`${char.strokes}획`} />}
          {isIdiom && <InfoRow label="한자" value={char.reading} />}
        </div>
      </div>

      {char.desc && (
        <p className="max-w-xs text-center text-sm font-semibold text-gray-500">
          {char.desc}
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-bold tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-base font-extrabold text-gray-800">{value}</span>
    </div>
  );
}
