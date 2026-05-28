"use client";

import { useRef, useEffect, useCallback } from "react";
import type { CharData } from "@/lib/lesson-data";

type TraceScreenProps = {
  char: CharData;
};

export function TraceScreen({ char }: TraceScreenProps) {
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
    ctx.fillText(char.char, canvas.width / 2, canvas.height / 2);
  }, [char.char]);

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
    <div className="flex flex-col items-center gap-4 px-6 pt-4">
      <p className="text-sm font-extrabold text-gray-500 tracking-wide">
        따라 써보세요
      </p>

      {/* Guide label */}
      <p className="text-2xl font-extrabold text-[#288b1b]">{char.char}</p>

      {/* Canvas */}
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

      {/* Clear button */}
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
