"use client";

import { motion } from "framer-motion";

type LessonShellProps = {
  stepIndex: number;
  totalSteps: number;
  onClose: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
};

export function LessonShell({
  stepIndex,
  totalSteps,
  onClose,
  onNext,
  nextLabel = "다음",
  nextDisabled = false,
  children,
}: LessonShellProps) {
  const progress = totalSteps > 0 ? (stepIndex / totalSteps) * 100 : 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex shrink-0 items-center gap-3 px-5 pt-12 pb-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="나가기"
          className="flex size-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 active:bg-gray-200"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Progress bar */}
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-[#57B72A]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom area: segment progress + next button */}
      <div className="shrink-0 px-5 pb-10 pt-3">
        {/* Segment progress bar */}
        <SegmentBar total={totalSteps} current={stepIndex} />

        {/* Next button */}
        <motion.button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          whileTap={nextDisabled ? {} : { scale: 0.97 }}
          className="mt-4 w-full rounded-2xl py-4 text-base font-extrabold text-white shadow-md transition-all disabled:opacity-40"
          style={{
            background: nextDisabled
              ? "#a3d88a"
              : "linear-gradient(180deg, #6bcf3a 0%, #57B72A 100%)",
            boxShadow: nextDisabled ? "none" : "0 4px 0 #3d8a1c",
          }}
        >
          {isLast ? "완료 🎉" : nextLabel}
        </motion.button>
      </div>
    </div>
  );
}

/* ── Segment progress bar ──────────────────────────────── */

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
