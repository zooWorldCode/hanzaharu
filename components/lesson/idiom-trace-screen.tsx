"use client";

import { useRef, useEffect, useCallback } from "react";

type IdiomTraceScreenProps = {
  traceChar: string;     // "百"
  traceHuneum: string;   // "일백"
  traceReading: string;  // "백"
  traceMeaning: string;  // "100, 백"
  traceIndex: number;    // 1
  traceTotal: number;    // 3 (고유 글자 수)
};

export function IdiomTraceScreen({
  traceChar,
  traceHuneum,
  traceReading,
  traceMeaning,
  traceIndex,
  traceTotal,
}: IdiomTraceScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${canvas.width * 0.68}px 'Noto Serif SC', serif`;
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(traceChar, canvas.width / 2, canvas.height / 2);
  }, [traceChar]);

  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    lastPos.current = getPos(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e);
    ctx.strokeStyle = "#57B72A";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const onPointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-3">
      {/* 진행 표시 */}
      <p className="text-[11px] font-bold tracking-widest text-gray-400">
        따라써보세요 · {traceIndex} / {traceTotal}
      </p>

      {/* 글자 정보 칩 */}
      <div className="flex items-center gap-2 rounded-2xl bg-[#F0F9E8] px-5 py-2.5">
        <span className="text-2xl font-extrabold text-[#2D7A1F]">{traceChar}</span>
        <span className="text-gray-300">·</span>
        <div className="text-sm">
          <span className="font-bold text-gray-600">{traceHuneum} </span>
          <span className="font-extrabold text-[#4A9B2F]">{traceReading}</span>
        </div>
        <span className="text-gray-300">·</span>
        <span className="text-sm text-gray-500">{traceMeaning}</span>
      </div>

      {/* 캔버스 */}
      <div className="w-full max-w-[300px]">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full touch-none rounded-3xl border-2 border-[#c2e8a8] bg-white shadow-sm"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>

      <button
        type="button"
        onClick={drawGuide}
        className="text-sm font-bold text-gray-400 underline underline-offset-2 active:text-gray-600"
      >
        다시 쓰기
      </button>
    </div>
  );
}
