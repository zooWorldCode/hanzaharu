"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════════════
   상수
══════════════════════════════════════════════════ */

const CONTENT_W = 1280;
const CONTENT_H = 720;

/* ══════════════════════════════════════════════════
   타입
══════════════════════════════════════════════════ */

type MypageRoomCanvasProps = {
  userName?: string;
  level?: number;
  coins?: number;
};

/* ══════════════════════════════════════════════════
   아이소메트릭 큐브 SVG 플레이스홀더
══════════════════════════════════════════════════ */

function IsoCubePlaceholder() {
  return (
    <svg
      viewBox="0 0 120 100"
      className="h-28 w-36 text-[#B5CFA8]"
      fill="none"
      aria-hidden
    >
      {/* 윗면 */}
      <polygon
        points="60,6 108,31 60,56 12,31"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
      {/* 오른쪽 면 */}
      <polygon
        points="108,31 108,74 60,99 60,56"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
      {/* 왼쪽 면 */}
      <polygon
        points="12,31 12,74 60,99 60,56"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5,3"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   캔버스 코너 장식
══════════════════════════════════════════════════ */

function CornerBrackets() {
  const base = "absolute h-5 w-5 border-[#A8C99A]";
  return (
    <>
      <div className={`${base} left-4 top-4 border-l-2 border-t-2`} />
      <div className={`${base} right-4 top-4 border-r-2 border-t-2`} />
      <div className={`${base} bottom-4 left-4 border-b-2 border-l-2`} />
      <div className={`${base} bottom-4 right-4 border-b-2 border-r-2`} />
    </>
  );
}

/* ══════════════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════════════ */

export function MypageRoomCanvas({
  userName = "한자 친구",
  level = 1,
}: MypageRoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    ox: 0,
    oy: 0,
  });
  const router = useRouter();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(false);

  /* 마운트 시 1280px 콘텐츠를 뷰포트 중앙에 정렬 */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, v));
    setOffset({
      x: clamp((cw - CONTENT_W) / 2, cw - CONTENT_W, 0),
      y: clamp((ch - CONTENT_H) / 2, ch - CONTENT_H, 0),
    });
  }, []);

  /* 오프셋 클램프 — 콘텐츠가 뷰포트 밖으로 완전히 벗어나지 않도록 */
  const clampOffset = useCallback((x: number, y: number) => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    return {
      x: Math.min(0, Math.max(cw - CONTENT_W, x)),
      y: Math.min(0, Math.max(ch - CONTENT_H, y)),
    };
  }, []);

  /* ── 드래그 핸들러 ── */
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.ox + dx, dragRef.current.oy + dy));
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  /* ── 토스트 ── */
  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }

  return (
    /* 바깥 래퍼 — 버튼 absolute 기준점 */
    <div className="relative flex h-[calc(100dvh-10.5rem)] flex-col px-4 pb-3">

      {/* ── 드래그 가능한 캔버스 뷰포트 ── */}
      <div
        ref={containerRef}
        className="relative flex-1 cursor-grab touch-none select-none overflow-hidden rounded-3xl border-2 border-dashed border-[#B5CFA8] bg-[#F8F5EE] active:cursor-grabbing"
        role="application"
        aria-label="캐릭터 방. 드래그로 이동"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {/* 대각선 줄무늬 배경 */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(0,0,0,0.025) 14px, rgba(0,0,0,0.025) 15px)",
          }}
        />

        {/* 코너 브래킷 장식 */}
        <CornerBrackets />

        {/* 1280 × 720 드래그 콘텐츠 */}
        <div
          className="absolute origin-top-left will-change-transform"
          style={{
            width: CONTENT_W,
            height: CONTENT_H,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex h-full flex-col items-center justify-center gap-4"
          >
            <IsoCubePlaceholder />

            <div className="text-center">
              <p className="text-base font-extrabold text-gray-500">
                캐릭터 방 일러스트 자리
              </p>
              <p className="mt-0.5 text-xs font-semibold text-gray-400">
                {userName} · Lv.{level}
              </p>
            </div>

            {/* 태그 필 */}
            <div className="flex flex-wrap justify-center gap-2">
              {["한쪽 이소메트릭", "캐릭터 + 가구 이미지 영역"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-gray-400 shadow-sm ring-1 ring-[#D4EBC5]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 준비중 토스트 */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 320 }}
              className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-gray-900/85 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur-sm"
            >
              🛠 서비스 준비 중이에요
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 플로팅 액션 버튼 — 캔버스 우하단에 오버랩 ── */}
      <div className="absolute bottom-8 right-6 z-10 flex flex-col gap-3">
        {/* 꾸미기 — primary */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push("/mypage/customize")}
          className="flex items-center gap-2 rounded-2xl bg-[#4A9B2F] px-5 py-3 text-sm font-extrabold text-white shadow-lg"
        >
          <span>👗</span>
          <span>꾸미기</span>
        </motion.button>

        {/* 상점 — secondary */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push("/mypage/shop")}
          className="flex items-center gap-2 rounded-2xl border-2 border-[#4A9B2F] bg-white px-5 py-3 text-sm font-extrabold text-[#4A9B2F] shadow-md"
        >
          <span>🏪</span>
          <span>상점</span>
        </motion.button>
      </div>
    </div>
  );
}
