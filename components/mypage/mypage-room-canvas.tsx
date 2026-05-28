"use client";

import { useCallback, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MIN_SCALE = 0.6;
const MAX_SCALE = 2.2;

type MypageRoomCanvasProps = {
  userName?: string;
  level?: number;
  coins?: number;
};

export function MypageRoomCanvas({
  userName = "한자 친구",
  level = 1,
  coins = 100,
}: MypageRoomCanvasProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  const clampScale = (value: number) =>
    Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    setScale((prev) => clampScale(prev + delta));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragState.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const dx = event.clientX - dragState.current.startX;
    const dy = event.clientY - dragState.current.startY;
    setOffset({
      x: dragState.current.originX + dx,
      y: dragState.current.originY + dy,
    });
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col px-4">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 공간</h1>
          <p className="text-sm text-gray-500">
            {userName} · Lv.{level} · 🪙 {coins}
          </p>
        </div>
        <p className="text-xs text-gray-400">확대·드래그로 꾸며요</p>
      </div>

      <div className="mb-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-full border-2"
          onClick={() => setScale((s) => clampScale(s - 0.15))}
          aria-label="축소"
        >
          <Minus className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-full border-2"
          onClick={() => setScale((s) => clampScale(s + 0.15))}
          aria-label="확대"
        >
          <Plus className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11 rounded-full border-2"
          onClick={resetView}
          aria-label="화면 초기화"
        >
          <RotateCcw className="size-5" />
        </Button>
        <span className="ml-auto flex items-center text-sm font-medium text-gray-500">
          {Math.round(scale * 100)}%
        </span>
      </div>

      <div
        className="relative flex-1 touch-none overflow-hidden rounded-3xl border-2 border-gray-200 bg-[#e8f4e1]"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        role="application"
        aria-label="집 꾸미기 공간. 드래그로 이동, 휠로 확대 축소"
      >
        <div
          className="absolute left-1/2 top-1/2 origin-center will-change-transform"
          style={{
            width: 720,
            height: 520,
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
          }}
        >
          <RoomScene />
        </div>
      </div>
    </div>
  );
}

function RoomScene() {
  return (
    <div className="relative size-full rounded-3xl bg-gradient-to-b from-sky-100 to-green-100 shadow-inner">
      <div className="absolute bottom-8 left-1/2 h-40 w-56 -translate-x-1/2 rounded-t-3xl border-4 border-amber-700 bg-amber-100">
        <div className="absolute -top-20 left-1/2 h-24 w-40 -translate-x-1/2 rounded-t-full bg-rose-300" />
        <div className="absolute bottom-0 left-4 size-10 rounded-lg bg-sky-300" />
        <div className="absolute bottom-0 right-6 size-14 rounded-full bg-yellow-300" />
      </div>

      <div className="absolute bottom-24 left-16 flex flex-col items-center">
        <span className="text-5xl" aria-hidden>
          🧒
        </span>
        <span className="mt-1 rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">
          아바타
        </span>
      </div>

      <div className="absolute right-12 top-16 rounded-2xl border-2 border-dashed border-gray-400 bg-white/60 px-4 py-3 text-center text-sm font-medium text-gray-600">
        가구 놓기
        <br />
        (터치 홀드 후 이동)
      </div>

      <span className="absolute left-10 top-12 text-4xl" aria-hidden>
        🌳
      </span>
      <span className="absolute right-20 bottom-32 text-3xl" aria-hidden>
        🪑
      </span>
      <span className="absolute left-1/3 top-20 text-2xl" aria-hidden>
        ☁️
      </span>
    </div>
  );
}
