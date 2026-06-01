"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════
   타입 & 데이터
══════════════════════════════════════════════════ */

type Category = "all" | "furniture" | "wallpaper" | "decor" | "character";

type ShopItem = {
  id: string;
  name: string;
  category: Exclude<Category, "all">;
  price: number;
  isNew?: boolean;
};

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "all",       label: "전체"     },
  { id: "furniture", label: "가구"     },
  { id: "wallpaper", label: "벽지/바닥" },
  { id: "decor",     label: "장식"     },
  { id: "character", label: "캐릭터"   },
];

const SHOP_ITEMS: ShopItem[] = [
  /* 가구 */
  { id: "i01", name: "조선 책상",   category: "furniture", price: 800,  isNew: true },
  { id: "i02", name: "전통 병풍",   category: "furniture", price: 600  },
  { id: "i03", name: "창호 창문",   category: "furniture", price: 500  },
  { id: "i04", name: "대나무 발",   category: "furniture", price: 700  },
  { id: "i05", name: "서안 의자",   category: "furniture", price: 450  },
  { id: "i06", name: "약장 선반",   category: "furniture", price: 950  },
  /* 벽지/바닥 */
  { id: "i07", name: "꽃잎 벽지",   category: "wallpaper", price: 400,  isNew: true },
  { id: "i08", name: "온돌 마루",   category: "wallpaper", price: 450  },
  { id: "i09", name: "황토 벽지",   category: "wallpaper", price: 350  },
  { id: "i10", name: "청색 마루",   category: "wallpaper", price: 500  },
  { id: "i11", name: "백자 타일",   category: "wallpaper", price: 600  },
  { id: "i12", name: "삼베 벽지",   category: "wallpaper", price: 300  },
  /* 장식 */
  { id: "i13", name: "등불",        category: "decor",     price: 300  },
  { id: "i14", name: "청자 항아리", category: "decor",     price: 600  },
  { id: "i15", name: "매화 화분",   category: "decor",     price: 400  },
  { id: "i16", name: "붓과 먹",     category: "decor",     price: 250  },
  { id: "i17", name: "연꽃 수반",   category: "decor",     price: 550,  isNew: true },
  { id: "i18", name: "풍경 종",     category: "decor",     price: 350  },
  /* 캐릭터 */
  { id: "i19", name: "선비 의상",   category: "character", price: 1000 },
  { id: "i20", name: "갓 모자",     category: "character", price: 800  },
  { id: "i21", name: "한복 (여)",   category: "character", price: 1200, isNew: true },
  { id: "i22", name: "도포 의상",   category: "character", price: 1000 },
];

/* ══════════════════════════════════════════════════
   카테고리 탭 내 아이콘 플레이스홀더 (소형)
══════════════════════════════════════════════════ */

function SmallPlaceholder() {
  return (
    <div className="size-8 overflow-hidden rounded-lg bg-gray-100">
      <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden>
        <rect x="1" y="1" width="30" height="30" fill="none" stroke="#D1D5DB" strokeWidth="2" />
        <line x1="1" y1="1" x2="31" y2="31" stroke="#D1D5DB" strokeWidth="2" />
        <line x1="31" y1="1" x2="1" y2="31" stroke="#D1D5DB" strokeWidth="2" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   아이템 이미지 플레이스홀더 (대형)
══════════════════════════════════════════════════ */

function ItemImagePlaceholder() {
  return (
    <div className="aspect-square w-full overflow-hidden bg-gray-100">
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <rect x="1" y="1" width="98" height="98" fill="none" stroke="#D1D5DB" strokeWidth="2.5" />
        <line x1="1" y1="1" x2="99" y2="99" stroke="#D1D5DB" strokeWidth="2.5" />
        <line x1="99" y1="1" x2="1" y2="99" stroke="#D1D5DB" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   카테고리 탭바 (언더라인 스타일)
══════════════════════════════════════════════════ */

function CategoryTabs({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="flex overflow-x-auto border-b-2 border-[#E3F1D9] [scrollbar-width:none]">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.id)}
          className={cn(
            "-mb-0.5 flex shrink-0 flex-col items-center gap-2 border-b-2 px-5 py-3 transition-colors",
            active === cat.id
              ? "border-gray-800 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600",
          )}
        >
          <SmallPlaceholder />
          <span className="whitespace-nowrap text-[11px] font-bold">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   아이템 카드
══════════════════════════════════════════════════ */

function ItemCard({
  item,
  onBuy,
}: {
  item: ShopItem;
  onBuy: (item: ShopItem) => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={() => onBuy(item)}
      className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E3F1D9] transition-shadow hover:shadow-md active:brightness-95"
    >
      {/* NEW 뱃지 */}
      {item.isNew && (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-[#4A9B2F] px-1.5 py-0.5 text-[9px] font-extrabold text-white shadow">
          NEW
        </div>
      )}

      {/* 아이템명 */}
      <div className="px-2 pt-2 pb-1">
        <p className="truncate text-[11px] font-bold text-gray-700">{item.name}</p>
      </div>

      {/* 이미지 플레이스홀더 */}
      <ItemImagePlaceholder />

      {/* 가격 */}
      <div className="flex items-center gap-1.5 px-2 py-2">
        <div className="size-3 shrink-0 rounded-full bg-[#C9A227]" />
        <span className="text-[12px] font-bold text-gray-700">
          {item.price.toLocaleString("ko-KR")}
        </span>
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════
   하단 배너 — 더 많은 아이템
══════════════════════════════════════════════════ */

function MoreItemsBanner() {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#E3F1D9]">
      <div className="flex items-center gap-4 px-5 py-5">
        {/* 보물상자 SVG */}
        <svg
          viewBox="0 0 80 64"
          className="h-16 w-20 shrink-0 text-[#C9A227]"
          fill="none"
          aria-hidden
        >
          {/* 뚜껑 (열림) */}
          <path
            d="M8 34 C8 34 8 10 40 10 C72 10 72 34 72 34"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* 몸통 */}
          <rect x="6" y="34" width="68" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="#FFFBEB" />
          {/* 잠금 */}
          <rect x="33" y="40" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* 동전 더미 왼쪽 */}
          <ellipse cx="22" cy="58" rx="10" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="#FEF3C7" />
          <ellipse cx="22" cy="55" rx="10" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="#FEF3C7" />
          {/* 동전 더미 오른쪽 */}
          <ellipse cx="58" cy="58" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="#FEF3C7" />
          <ellipse cx="58" cy="55" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" fill="#FEF3C7" />
        </svg>
        <div>
          <p className="text-base font-extrabold text-gray-700">더 많은 아이템을</p>
          <p className="text-base font-extrabold text-gray-700">모아보세요!</p>
          <p className="mt-1 text-xs text-gray-400">학습을 완료하면 코인을 받아요</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   구매 토스트
══════════════════════════════════════════════════ */

function PurchaseToast({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}
      className="fixed bottom-32 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-gray-900/90 px-6 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-sm"
    >
      🛠 서비스 준비 중이에요
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   메인 페이지
══════════════════════════════════════════════════ */

export default function ShopPage() {
  const [activeCat, setActiveCat] = useState<Category>("all");
  const [toast, setToast]         = useState<string | null>(null);

  const filtered =
    activeCat === "all"
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((i) => i.category === activeCat);

  function handleBuy(item: ShopItem) {
    setToast(item.name);
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="pb-32 pt-1">

      {/* ── 카테고리 탭 (카드 안) ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#D4EBC5]"
      >
        <CategoryTabs active={activeCat} onSelect={setActiveCat} />
      </motion.div>

      {/* ── 아이템 그리드 ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCat}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-4 grid grid-cols-3 gap-3"
        >
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} onBuy={handleBuy} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── 더 많은 아이템 배너 ── */}
      <div className="mx-4">
        <MoreItemsBanner />
      </div>

      {/* ── 구매 토스트 ── */}
      <AnimatePresence>
        {toast && <PurchaseToast name={toast} />}
      </AnimatePresence>
    </div>
  );
}
