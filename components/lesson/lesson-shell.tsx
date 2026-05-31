"use client";

import { motion } from "framer-motion";

type LessonShellProps = {
  stepIndex: number;
  totalSteps: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
};

export function LessonShell({
  stepIndex,
  totalSteps,
  onClose,
  onPrev,
  onNext,
  nextLabel = "다음",
  nextDisabled = false,
  children,
}: LessonShellProps) {
  const progress = totalSteps > 0 ? (stepIndex / totalSteps) * 100 : 0;
  const isLast = stepIndex === totalSteps - 1;
  const prevDisabled = stepIndex === 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex size-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:bg-gray-200"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M14 4L4 14M4 4l10 10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-[#57B72A]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>

      <div className="shrink-0 px-5 pb-10 pt-3">
        <SegmentBar total={totalSteps} current={stepIndex} />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={onPrev}
            disabled={prevDisabled}
            whileTap={prevDisabled ? {} : { scale: 0.97 }}
            className="rounded-2xl border border-[#D4EBC5] bg-white py-4 text-base font-extrabold text-[#4A9B2F] shadow-sm transition-all disabled:opacity-40"
          >
            이전
          </motion.button>

          <motion.button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            whileTap={nextDisabled ? {} : { scale: 0.97 }}
            className="rounded-2xl py-4 text-base font-extrabold text-white shadow-md transition-all disabled:opacity-40"
            style={{
              background: nextDisabled
                ? "#a3d88a"
                : "linear-gradient(180deg, #6bcf3a 0%, #57B72A 100%)",
              boxShadow: nextDisabled ? "none" : "0 4px 0 #3d8a1c",
            }}
          >
            {isLast ? "완료" : nextLabel}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function SegmentBar({ total, current }: { total: number; current: number }) {
  if (total === 0) return null;

  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-2 flex-1 rounded-full"
          animate={{
            backgroundColor:
              i < current ? "#57B72A" : i === current ? "#a3d88a" : "#e5e7eb",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}
