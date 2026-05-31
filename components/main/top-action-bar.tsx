"use client";

import { useState } from "react";

import type { TopActionConfig } from "@/lib/main-tabs";
import { useLearningType, type LearningType } from "@/lib/learning-type-context";
import { useUserState } from "@/lib/user-state-context";
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

function GreenCircleButton({
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
      className="flex size-12 items-center justify-center rounded-full bg-[#4A9B2F] text-lg font-semibold text-white shadow-md transition-transform active:scale-95"
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

function StatusPill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-[#D4EBC5]">
      <span className={tone}>{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function LearningMenu() {
  const [open, setOpen] = useState(false);
  const { learningType, setLearningType } = useLearningType();

  function choose(type: LearningType) {
    setLearningType(type);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="hidden md:block">
        {open ? (
          <div className="overflow-hidden">
            <div className="flex items-center gap-1 whitespace-nowrap rounded-full bg-[#4A9B2F] p-1.5 shadow-md">
              {TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => choose(type)}
                  className={cn(
                    "rounded-full px-3 py-2 text-[11px] font-bold transition-colors",
                    learningType === type
                      ? "bg-white text-[#4A9B2F]"
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
                className="ml-1 flex size-7 items-center justify-center rounded-full text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <GreenCircleButton label="≡" ariaLabel="메뉴" onClick={() => setOpen(true)} />
        )}
      </div>

      <div className="md:hidden">
        <GreenCircleButton
          label={open ? "×" : "≡"}
          ariaLabel={open ? "메뉴 닫기" : "메뉴"}
          onClick={() => setOpen((value) => !value)}
        />

        {open && (
          <div className="absolute right-0 top-14 z-50 min-w-[152px] overflow-hidden rounded-2xl bg-[#4A9B2F] p-1.5 shadow-xl">
            {TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => choose(type)}
                className={cn(
                  "w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                  learningType === type
                    ? "bg-white text-[#4A9B2F]"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                {LEARNING_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TopActionBar({ config, onAction, className }: TopActionBarProps) {
  const useGreen = config.showStatus || config.showGreenStyle;
  const hasLearningMenu = config.showStatus && config.right.some((button) => button.id === "menu");
  const showStatusPills = config.showStatus && config.showStatusPills !== false;
  const { tickets, coins } = useUserState();

  return (
    <div
      className={cn(
        "pointer-events-none fixed left-1/2 top-0 z-40 w-full max-w-[1280px] -translate-x-1/2 px-6 pt-4 pb-5",
        "bg-[#F4FAF0]/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="relative flex items-start justify-between">
        <div className="pointer-events-auto shrink-0">
          {useGreen ? (
            <GreenCircleButton
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
        </div>

        {showStatusPills ? (
          <div className="pointer-events-auto absolute left-1/2 top-0 flex -translate-x-1/2 gap-2">
            <StatusPill label="티켓" value={tickets} tone="text-[#7C3AED]" />
            <StatusPill label="코인" value={coins} tone="text-[#C9A227]" />
          </div>
        ) : config.centerTitle ? (
          <div className="pointer-events-none absolute left-1/2 top-0 flex h-12 -translate-x-1/2 items-center">
            <h1 className="text-xl font-extrabold text-gray-900">{config.centerTitle}</h1>
          </div>
        ) : null}

        <div className="pointer-events-auto flex shrink-0 items-center gap-3">
          {hasLearningMenu ? (
            <LearningMenu />
          ) : (
            config.right.map((button) =>
              useGreen ? (
                <GreenCircleButton
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
        </div>
      </div>

      {/* 헤더 하단 페이드 — 콘텐츠와 자연스럽게 연결 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-[#F4FAF0]/60 to-transparent"
      />
    </div>
  );
}
