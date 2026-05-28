"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TopActionConfig } from "@/lib/main-tabs";
import { useLearningType, type LearningType } from "@/lib/learning-type-context";
import { cn } from "@/lib/utils";

type TopActionBarProps = {
  config: TopActionConfig;
  onAction?: (buttonId: string) => void;
  className?: string;
};

const LEARNING_LABELS: Record<LearningType, string> = {
  meaning: "한자 뜻음",
  vocab: "한자 어휘",
  idioms: "사자성어",
};

const TYPES: LearningType[] = ["meaning", "vocab", "idioms"];

function BlueCircleButton({
  label,
  ariaLabel,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex size-12 items-center justify-center rounded-full bg-[#4D69CF] text-lg font-semibold text-white shadow-md transition-transform active:scale-95"
    >
      {label}
    </button>
  );
}

function CircleButton({
  label,
  ariaLabel,
  onClick,
}: {
  label: string;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="flex size-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-lg font-semibold shadow-sm transition-transform active:scale-95"
    >
      {label}
    </button>
  );
}

function StatusPill({ icon, value }: { icon: string; value: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-[#C9A227] px-4 py-2.5 text-sm font-bold text-white shadow-sm">
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const { learningType: selected, setLearningType } = useLearningType();

  function choose(type: LearningType) {
    setLearningType(type);
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* ── 태블릿+: 가로 pill ── */}
      <div className="hidden md:block">
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="pill"
              initial={{ maxWidth: 0, opacity: 0 }}
              animate={{ maxWidth: 260, opacity: 1 }}
              exit={{ maxWidth: 0, opacity: 0 }}
              transition={{
                maxWidth: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.12 },
              }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-0.5 whitespace-nowrap rounded-full bg-[#4D69CF] p-1.5 shadow-md">
                {TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => choose(type)}
                    className={cn(
                      "rounded-full px-3 py-2 text-[11px] font-bold transition-colors",
                      selected === type
                        ? "bg-white text-[#4D69CF]"
                        : "text-white/70 hover:text-white",
                    )}
                  >
                    {LEARNING_LABELS[type]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="메뉴 닫기"
                  className="ml-0.5 flex size-7 items-center justify-center rounded-full text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <BlueCircleButton label="☰" ariaLabel="메뉴" onClick={() => setOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 모바일: 버튼 + 아래로 드롭다운 ── */}
      <div className="md:hidden">
        <BlueCircleButton
          label={open ? "✕" : "☰"}
          ariaLabel={open ? "메뉴 닫기" : "메뉴"}
          onClick={() => setOpen((v) => !v)}
        />

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: -6, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -6, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-14 z-50 min-w-[152px] overflow-hidden rounded-2xl bg-[#4D69CF] p-1.5 shadow-xl"
            >
              {TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => choose(type)}
                  className={cn(
                    "w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                    selected === type
                      ? "bg-white text-[#4D69CF]"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {LEARNING_LABELS[type]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function TopActionBar({ config, onAction, className }: TopActionBarProps) {
  const hasHamburger = config.showStatus && config.right.some((b) => b.id === "menu");

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed top-0 left-1/2 z-40 flex w-full max-w-[1280px] -translate-x-1/2 items-center justify-between px-6 pt-4",
        className,
      )}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left */}
      <motion.div className="pointer-events-auto">
        {config.showStatus ? (
          <BlueCircleButton
            label={config.left.label}
            ariaLabel={config.left.ariaLabel}
            onClick={() => onAction?.(config.left.id)}
          />
        ) : (
          <CircleButton
            label={config.left.label}
            ariaLabel={config.left.ariaLabel}
            onClick={() => onAction?.(config.left.id)}
          />
        )}
      </motion.div>

      {/* Center status pills */}
      {config.showStatus && (
        <motion.div className="pointer-events-auto flex gap-2">
          <StatusPill icon="🔥" value={7} />
          <StatusPill icon="💰" value={320} />
        </motion.div>
      )}

      {/* Right */}
      <motion.div className="pointer-events-auto flex items-center gap-3">
        {hasHamburger ? (
          <HamburgerMenu />
        ) : (
          config.right.map((button) =>
            config.showStatus ? (
              <BlueCircleButton
                key={button.id}
                label={button.label}
                ariaLabel={button.ariaLabel}
                onClick={() => onAction?.(button.id)}
              />
            ) : (
              <CircleButton
                key={button.id}
                label={button.label}
                ariaLabel={button.ariaLabel}
                onClick={() => onAction?.(button.id)}
              />
            ),
          )
        )}
      </motion.div>
    </motion.div>
  );
}
