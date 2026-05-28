"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SideNavArrowsProps = {
  showPrev: boolean;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function ArrowButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "이전 페이지" : "다음 페이지";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "pointer-events-auto flex size-14 items-center justify-center rounded-full border-2 border-gray-200 bg-white/95 text-2xl font-bold text-gray-800 shadow-md transition-transform active:scale-95",
        className,
      )}
    >
      <Icon className="size-8" strokeWidth={2.5} />
    </button>
  );
}

export function SideNavArrows({
  showPrev,
  showNext,
  onPrev,
  onNext,
}: SideNavArrowsProps) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-20 flex w-16 items-center justify-center",
          !showPrev && "hidden",
        )}
      >
        <ArrowButton direction="prev" onClick={onPrev} />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-20 flex w-16 items-center justify-center",
          !showNext && "hidden",
        )}
      >
        <ArrowButton direction="next" onClick={onNext} />
      </div>
    </>
  );
}
