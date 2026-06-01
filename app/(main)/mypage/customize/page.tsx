"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════
   타입 & 데이터
══════════════════════════════════════════════════ */

type Mode = "room" | "character";

type ItemData = {
  id: string;
  preview: string;       // hex color 또는 emoji
  previewType: "color" | "emoji";
  price: number;         // 0 = 보유중
};

/* ── 룸 카테고리 ── */
const ROOM_CATS = [
  { id: "floor",     label: "바닥", icon: "🪵" },
  { id: "wallpaper", label: "벽지", icon: "🖼"  },
  { id: "furniture", label: "가구", icon: "🪑"  },
  { id: "decor",     label: "소품", icon: "🏺"  },
] as const;
type RoomCat = (typeof ROOM_CATS)[number]["id"];

/* ── 캐릭터 카테고리 ── */
const CHAR_CATS = [
  { id: "outfit",     label: "의상",    icon: "👘" },
  { id: "hat",        label: "모자",    icon: "🎩" },
  { id: "accessory",  label: "악세서리", icon: "💍" },
  { id: "background", label: "배경",    icon: "🌄" },
] as const;
type CharCat = (typeof CHAR_CATS)[number]["id"];

/* ── 룸 아이템 ── */
const ROOM_ITEMS: Record<RoomCat, ItemData[]> = {
  floor: [
    { id: "f1", preview: "#C4A882", previewType: "color", price: 0    },
    { id: "f2", preview: "#D9CEAD", previewType: "color", price: 800  },
    { id: "f3", preview: "#8E9E6E", previewType: "color", price: 800  },
    { id: "f4", preview: "#6B5040", previewType: "color", price: 800  },
    { id: "f5", preview: "#E8DCC8", previewType: "color", price: 1200 },
    { id: "f6", preview: "#A07850", previewType: "color", price: 1200 },
  ],
  wallpaper: [
    { id: "w1", preview: "#F5EDD8", previewType: "color", price: 0    },
    { id: "w2", preview: "#D4E8D4", previewType: "color", price: 800  },
    { id: "w3", preview: "#D4DEEE", previewType: "color", price: 800  },
    { id: "w4", preview: "#EED8D8", previewType: "color", price: 800  },
    { id: "w5", preview: "#E8E4CC", previewType: "color", price: 1200 },
    { id: "w6", preview: "#D8CCE8", previewType: "color", price: 1200 },
  ],
  furniture: [
    { id: "fu1", preview: "🪑", previewType: "emoji", price: 0    },
    { id: "fu2", preview: "🛋",  previewType: "emoji", price: 1500 },
    { id: "fu3", preview: "🪞", previewType: "emoji", price: 1200 },
    { id: "fu4", preview: "📚", previewType: "emoji", price: 1000 },
    { id: "fu5", preview: "🪴", previewType: "emoji", price: 800  },
    { id: "fu6", preview: "🕰",  previewType: "emoji", price: 1000 },
  ],
  decor: [
    { id: "d1", preview: "🏺", previewType: "emoji", price: 0   },
    { id: "d2", preview: "🕯",  previewType: "emoji", price: 400 },
    { id: "d3", preview: "🎋", previewType: "emoji", price: 600 },
    { id: "d4", preview: "🪆", previewType: "emoji", price: 800 },
    { id: "d5", preview: "🎐", previewType: "emoji", price: 800 },
    { id: "d6", preview: "🌸", previewType: "emoji", price: 600 },
  ],
};

/* ── 캐릭터 아이템 ── */
const CHAR_ITEMS: Record<CharCat, ItemData[]> = {
  outfit: [
    { id: "o1", preview: "👘", previewType: "emoji", price: 0    },
    { id: "o2", preview: "🥻", previewType: "emoji", price: 1000 },
    { id: "o3", preview: "🎽", previewType: "emoji", price: 1000 },
    { id: "o4", preview: "🧥", previewType: "emoji", price: 1000 },
  ],
  hat: [
    { id: "h1", preview: "🎩", previewType: "emoji", price: 0    },
    { id: "h2", preview: "👒", previewType: "emoji", price: 800  },
    { id: "h3", preview: "🪖", previewType: "emoji", price: 1000 },
    { id: "h4", preview: "👑", previewType: "emoji", price: 2000 },
  ],
  accessory: [
    { id: "a1", preview: "💍", previewType: "emoji", price: 0   },
    { id: "a2", preview: "📿", previewType: "emoji", price: 800 },
    { id: "a3", preview: "🕶",  previewType: "emoji", price: 600 },
    { id: "a4", preview: "🧣", previewType: "emoji", price: 800 },
  ],
  background: [
    { id: "bg1", preview: "#F5EDD8", previewType: "color", price: 0    },
    { id: "bg2", preview: "#D4E8D4", previewType: "color", price: 1000 },
    { id: "bg3", preview: "#D4DEEE", previewType: "color", price: 1000 },
    { id: "bg4", preview: "#F0D0E0", previewType: "color", price: 1200 },
  ],
};

const DEFAULT_ROOM_SEL: Record<RoomCat, string> = {
  floor: "f1", wallpaper: "w1", furniture: "fu1", decor: "d1",
};
const DEFAULT_CHAR_SEL: Record<CharCat, string> = {
  outfit: "o1", hat: "h1", accessory: "a1", background: "bg1",
};

/* ══════════════════════════════════════════════════
   룸 미리보기
══════════════════════════════════════════════════ */

function RoomPreview({ sel }: { sel: Record<RoomCat, string> }) {
  const floor = ROOM_ITEMS.floor.find((i) => i.id === sel.floor)?.preview ?? "#C4A882";
  const wall  = ROOM_ITEMS.wallpaper.find((i) => i.id === sel.wallpaper)?.preview ?? "#F5EDD8";
  const furn  = ROOM_ITEMS.furniture.find((i) => i.id === sel.furniture)?.preview ?? "🪑";
  const dec   = ROOM_ITEMS.decor.find((i) => i.id === sel.decor)?.preview ?? "🏺";

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#D4EBC5]"
      style={{ aspectRatio: "16/9", backgroundColor: wall }}
    >
      {/* 바닥 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[38%]"
        style={{ backgroundColor: floor }}
      />
      {/* 가구 */}
      <span className="absolute bottom-[36%] left-1/2 -translate-x-1/2 text-5xl">
        {furn}
      </span>
      {/* 소품 */}
      <span className="absolute bottom-[36%] right-[14%] text-3xl">{dec}</span>
      {/* 배경 나무 */}
      <span className="absolute bottom-[36%] left-[10%] text-3xl">🌿</span>
      {/* 벽 액자 */}
      <span className="absolute right-6 top-4 text-2xl">🖼</span>
      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   캐릭터 미리보기
══════════════════════════════════════════════════ */

function CharPreview({ sel }: { sel: Record<CharCat, string> }) {
  const bg      = CHAR_ITEMS.background.find((i) => i.id === sel.background)?.preview ?? "#F5EDD8";
  const hat     = CHAR_ITEMS.hat.find((i) => i.id === sel.hat)?.preview ?? "🎩";
  const outfit  = CHAR_ITEMS.outfit.find((i) => i.id === sel.outfit)?.preview ?? "👘";
  const acc     = CHAR_ITEMS.accessory.find((i) => i.id === sel.accessory)?.preview ?? "💍";

  return (
    <div className="flex justify-center">
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-[#D4EBC5]"
        style={{ width: 200, height: 240, backgroundColor: bg }}
      >
        {/* 간단한 diagonal 패턴 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px)",
          }}
        />
        <div className="relative flex flex-col items-center gap-0.5">
          <span className="text-2xl">{hat}</span>
          <span className="text-6xl">🧒</span>
          <span className="text-xl">{outfit}</span>
          <span className="mt-1 text-sm">{acc}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   카테고리 탭바
══════════════════════════════════════════════════ */

function CategoryBar<T extends string>({
  categories,
  active,
  onSelect,
}: {
  categories: readonly { id: T; label: string; icon: string }[];
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex shrink-0 flex-col items-center gap-1 rounded-2xl px-5 py-2.5 transition-colors",
            active === cat.id
              ? "bg-[#4A9B2F] text-white shadow-md"
              : "bg-white text-gray-500 shadow-sm ring-1 ring-[#D4EBC5]",
          )}
        >
          <span className="text-xl">{cat.icon}</span>
          <span className="text-[11px] font-bold">{cat.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   아이템 카드
══════════════════════════════════════════════════ */

function ItemCard({
  item,
  selected,
  onSelect,
}: {
  item: ItemData;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onSelect}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-colors",
        selected ? "border-[#4A9B2F]" : "border-[#E3F1D9]",
      )}
    >
      {/* 미리보기 영역 */}
      <div className="aspect-square w-full overflow-hidden rounded-t-xl">
        {item.previewType === "color" ? (
          <div className="h-full w-full" style={{ backgroundColor: item.preview }} />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#F8F6F0] text-4xl">
            {item.preview}
          </div>
        )}
      </div>

      {/* 가격 */}
      <div className="px-1 py-1.5 text-center">
        {item.price === 0 ? (
          <span className="text-[11px] font-extrabold text-[#4A9B2F]">보유중</span>
        ) : (
          <span className="text-[11px] font-bold text-[#C9A227]">
            🪙 {item.price.toLocaleString("ko-KR")}
          </span>
        )}
      </div>

      {/* 선택 체크 */}
      {selected && (
        <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[#4A9B2F] shadow">
          <span className="text-[10px] font-extrabold text-white">✓</span>
        </div>
      )}
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════
   메인 페이지
══════════════════════════════════════════════════ */

export default function CustomizePage() {
  const [mode, setMode]         = useState<Mode>("room");
  const [roomCat, setRoomCat]   = useState<RoomCat>("floor");
  const [charCat, setCharCat]   = useState<CharCat>("outfit");
  const [roomSel, setRoomSel]   = useState(DEFAULT_ROOM_SEL);
  const [charSel, setCharSel]   = useState(DEFAULT_CHAR_SEL);

  const currentItems =
    mode === "room"
      ? ROOM_ITEMS[roomCat]
      : CHAR_ITEMS[charCat];

  const isSelected = (itemId: string) =>
    mode === "room" ? roomSel[roomCat] === itemId : charSel[charCat] === itemId;

  function selectItem(itemId: string) {
    if (mode === "room") {
      setRoomSel((prev) => ({ ...prev, [roomCat]: itemId }));
    } else {
      setCharSel((prev) => ({ ...prev, [charCat]: itemId }));
    }
  }

  return (
    <div className="px-4 pb-32 pt-2">

      {/* ── 모드 스위처 ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-4 flex rounded-xl bg-gray-200 p-1"
      >
        {(["room", "character"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-sm font-bold transition-all",
              mode === m ? "bg-gray-700 text-white shadow" : "text-gray-500",
            )}
          >
            {m === "room" ? "룸 꾸미기" : "캐릭터 꾸미기"}
          </button>
        ))}
      </motion.div>

      {/* ── 미리보기 ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="mb-4"
        >
          {mode === "room" ? (
            <RoomPreview sel={roomSel} />
          ) : (
            <CharPreview sel={charSel} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── 카테고리 탭 ── */}
      <div className="mb-4">
        <AnimatePresence mode="wait">
          {mode === "room" ? (
            <motion.div
              key="room-cats"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <CategoryBar
                categories={ROOM_CATS}
                active={roomCat}
                onSelect={setRoomCat}
              />
            </motion.div>
          ) : (
            <motion.div
              key="char-cats"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
            >
              <CategoryBar
                categories={CHAR_CATS}
                active={charCat}
                onSelect={setCharCat}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 아이템 그리드 ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${mode}-${mode === "room" ? roomCat : charCat}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          {currentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              selected={isSelected(item.id)}
              onSelect={() => selectItem(item.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
