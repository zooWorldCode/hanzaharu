"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════
   획 분석 유틸
══════════════════════════════════════════════════ */

type Point = { x: number; y: number };
type Stroke = Point[];
type Dir = "H" | "V" | "DR" | "DL";

function classifyStroke(stroke: Stroke): Dir {
  if (stroke.length < 2) return "H";
  const first = stroke[0];
  const last = stroke[stroke.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (adx > ady * 1.8) return "H";
  if (ady > adx * 1.8) return "V";
  if (dx >= 0) return "DR";
  return "DL";
}

/* 한자별 획 패턴 정의
   count: 정확한 획 수
   dirs:  각 획의 방향 (null 이면 방향 검사 생략)
*/
type Pattern = { count: number; dirs?: Dir[] };

const PATTERNS: Record<string, Pattern> = {
  "一": { count: 1, dirs: ["H"] },
  "二": { count: 2, dirs: ["H", "H"] },
  "三": { count: 3, dirs: ["H", "H", "H"] },
  "四": { count: 5 },
  "五": { count: 4 },
  "六": { count: 4 },
  "七": { count: 2, dirs: ["H", "V"] },
  "八": { count: 2, dirs: ["DL", "DR"] },
  "九": { count: 2 },
  "十": { count: 2, dirs: ["H", "V"] },
};

type EvalResult = { pass: boolean; msg: string; detail: string };

function evaluate(char: string, strokes: Stroke[]): EvalResult {
  const pattern = PATTERNS[char];
  if (!pattern) return { pass: false, msg: "알 수 없는 한자예요", detail: "" };

  const n = strokes.length;
  const expected = pattern.count;

  // 획 수 먼저 체크 (±1 허용)
  if (n === 0) {
    return { pass: false, msg: "아직 아무것도 쓰지 않았어요!", detail: "" };
  }
  if (Math.abs(n - expected) > 1) {
    return {
      pass: false,
      msg: `획 수가 달라요`,
      detail: `${char}은 ${expected}획이에요. 지금 ${n}획 그렸어요.`,
    };
  }

  // 방향 체크 (패턴이 있는 경우)
  if (pattern.dirs && n === expected) {
    const drawn = strokes.map(classifyStroke);
    const matchCount = drawn.filter((d, i) => d === pattern.dirs![i]).length;
    const ratio = matchCount / expected;

    if (ratio < 0.6) {
      return {
        pass: false,
        msg: `획 방향을 확인해봐요`,
        detail: `${char}의 획 방향이 달라요. 쓰는 순서를 다시 확인해봐요!`,
      };
    }
  }

  return {
    pass: true,
    msg: "정확하게 썼어요! 🎉",
    detail: `${char} — 획 수와 방향이 모두 맞아요.`,
  };
}

/* ══════════════════════════════════════════════════
   드로잉 캔버스
══════════════════════════════════════════════════ */

type CanvasState = "idle" | "drawing";

function DrawingCanvas({
  strokes,
  onStrokesChange,
  locked,
}: {
  strokes: Stroke[];
  onStrokesChange: (strokes: Stroke[]) => void;
  locked: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStroke = useRef<Stroke>([]);
  const [state, setState] = useState<CanvasState>("idle");

  // 캔버스에 모든 획 다시 그리기
  const redraw = useCallback((allStrokes: Stroke[], current: Stroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 완료된 획
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const stroke of allStrokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }

    // 현재 그리는 획
    if (current.length >= 2) {
      ctx.strokeStyle = "#57B72A";
      ctx.beginPath();
      ctx.moveTo(current[0].x, current[0].y);
      for (let i = 1; i < current.length; i++) {
        ctx.lineTo(current[i].x, current[i].y);
      }
      ctx.stroke();
    }
  }, []);

  // HiDPI 세팅
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx?.scale(dpr, dpr);
  }, []);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPos(e);
    currentStroke.current = [pt];
    setState("drawing");
    redraw(strokes, currentStroke.current);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (state !== "drawing" || locked) return;
    const pt = getPos(e);
    currentStroke.current = [...currentStroke.current, pt];
    redraw(strokes, currentStroke.current);
  }

  function onPointerUp() {
    if (state !== "drawing" || locked) return;
    const stroke = currentStroke.current;
    if (stroke.length >= 2) {
      const next = [...strokes, stroke];
      onStrokesChange(next);
      redraw(next, []);
    }
    currentStroke.current = [];
    setState("idle");
  }

  // strokes가 바뀌면 (예: 지우기) 다시 그리기
  useEffect(() => {
    redraw(strokes, []);
  }, [strokes, redraw]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "h-full w-full touch-none rounded-2xl",
        locked ? "opacity-60" : "cursor-crosshair",
      )}
      style={{ display: "block" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}

/* ══════════════════════════════════════════════════
   WritingQuestion 메인 컴포넌트
══════════════════════════════════════════════════ */

export type WritingResult = { pass: boolean };

type WritingQuestionProps = {
  char: string;
  reading: string;
  meaning: string;
  onAnswered: (result: WritingResult) => void;
};

export function WritingQuestion({ char, reading, meaning, onAnswered }: WritingQuestionProps) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [result, setResult] = useState<EvalResult | null>(null);

  function handleCheck() {
    const r = evaluate(char, strokes);
    setResult(r);
    onAnswered({ pass: r.pass });
  }

  function handleClear() {
    setStrokes([]);
    setResult(null);
  }

  const locked = result !== null;

  return (
    <div className="flex flex-col items-center gap-4 px-5 pt-4">
      <p className="text-sm font-extrabold text-gray-600">한자를 따라 써보세요</p>

      {/* 음·뜻 힌트 카드 */}
      <div className="flex w-full items-center gap-4 rounded-2xl border-2 border-[#c2e8a8] bg-[#f0fdf4] px-5 py-4">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">음</span>
          <span className="text-2xl font-extrabold text-gray-800">{reading}</span>
        </div>
        <div className="h-10 w-px bg-[#c2e8a8]" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">뜻</span>
          <span className="text-2xl font-extrabold text-gray-800">{meaning}</span>
        </div>
      </div>

      {/* 캔버스 영역 */}
      <div className="relative w-full" style={{ height: 200 }}>
        {/* 격자 배경 */}
        <div className="absolute inset-0 rounded-2xl border-2 border-gray-200 bg-[#FAFAF8]">
          {/* 가이드 십자선 */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-gray-200" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 border-t border-dashed border-gray-200" />
        </div>

        {/* 실제 캔버스 */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <DrawingCanvas strokes={strokes} onStrokesChange={setStrokes} locked={locked} />
        </div>
      </div>

      {/* 피드백 */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "w-full rounded-2xl px-4 py-3",
              result.pass ? "bg-[#f0fdf4] border-2 border-[#c2e8a8]" : "bg-[#FFFBE6] border-2 border-[#E8B84B]",
            )}
          >
            <p className={cn("font-extrabold", result.pass ? "text-[#288b1b]" : "text-[#B56012]")}>
              {result.msg}
            </p>
            {result.detail && (
              <p className="mt-0.5 text-sm text-gray-500">{result.detail}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 버튼 */}
      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={locked}
          className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-600 disabled:opacity-40"
        >
          ✕ 지우기
        </button>
        <motion.button
          type="button"
          onClick={handleCheck}
          disabled={strokes.length === 0 || locked}
          whileTap={{ scale: 0.97 }}
          className="flex-[2] rounded-2xl py-3.5 text-sm font-extrabold text-white disabled:opacity-40"
          style={{ background: "linear-gradient(180deg,#6bcf3a 0%,#57B72A 100%)", boxShadow: "0 4px 0 #3d8a1c" }}
        >
          ✓ 확인하기
        </motion.button>
      </div>
    </div>
  );
}
