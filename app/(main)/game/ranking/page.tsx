"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════════
   타입 & 데이터
══════════════════════════════════════════════════ */

const TABS = ["전체 랭킹", "친구 랭킹", "학교 랭킹"] as const;
type RankTab = (typeof TABS)[number];

type RankEntry = { rank: number; name: string; score: number };

const FULL_DATA: RankEntry[] = [
  { rank: 1, name: "한자왕",       score: 12450 },
  { rank: 2, name: "공부하는토끼", score: 9870  },
  { rank: 3, name: "지혜로운곰",   score: 8230  },
  { rank: 4, name: "닉네임",       score: 7450  },
  { rank: 5, name: "닉네임",       score: 6350  },
  { rank: 6, name: "닉네임",       score: 5860  },
  { rank: 7, name: "닉네임",       score: 4920  },
  { rank: 8, name: "닉네임",       score: 4100  },
  { rank: 9, name: "닉네임",       score: 3780  },
  { rank: 10, name: "닉네임",      score: 3210  },
];

const FRIEND_DATA: RankEntry[] = [
  { rank: 1, name: "절친한자",     score: 9120  },
  { rank: 2, name: "같이공부해",   score: 7540  },
  { rank: 3, name: "한자친구",     score: 6330  },
  { rank: 4, name: "닉네임",       score: 5210  },
  { rank: 5, name: "닉네임",       score: 4780  },
  { rank: 6, name: "닉네임",       score: 3950  },
  { rank: 7, name: "닉네임",       score: 3120  },
  { rank: 8, name: "닉네임",       score: 2880  },
  { rank: 9, name: "닉네임",       score: 2450  },
  { rank: 10, name: "닉네임",      score: 1990  },
];

const SCHOOL_DATA: RankEntry[] = [
  { rank: 1, name: "우리반최고",   score: 10800 },
  { rank: 2, name: "한자천재",     score: 8650  },
  { rank: 3, name: "열공중",       score: 7230  },
  { rank: 4, name: "닉네임",       score: 6120  },
  { rank: 5, name: "닉네임",       score: 5560  },
  { rank: 6, name: "닉네임",       score: 4730  },
  { rank: 7, name: "닉네임",       score: 3900  },
  { rank: 8, name: "닉네임",       score: 3250  },
  { rank: 9, name: "닉네임",       score: 2780  },
  { rank: 10, name: "닉네임",      score: 2100  },
];

const RANKING_DATA: Record<RankTab, RankEntry[]> = {
  "전체 랭킹": FULL_DATA,
  "친구 랭킹": FRIEND_DATA,
  "학교 랭킹": SCHOOL_DATA,
};

const MY_RANK = { rank: 25, score: 1250 };

function fmt(score: number) {
  return score.toLocaleString("ko-KR") + "P";
}

/* ══════════════════════════════════════════════════
   아바타 플레이스홀더
══════════════════════════════════════════════════ */

function AvatarCircle({ size }: { size: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full text-gray-300">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="5" />
        <line x1="18" y1="18" x2="82" y2="82" stroke="currentColor" strokeWidth="7" />
        <line x1="82" y1="18" x2="18" y2="82" stroke="currentColor" strokeWidth="7" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   포디엄 카드
══════════════════════════════════════════════════ */

const PODIUM_CONFIG: Record<1 | 2 | 3, { mobileH: string; tabletH: string; avatarSize: number; order: number }> = {
  1: { mobileH: "h-52",  tabletH: "md:h-64", avatarSize: 64, order: 2 },
  2: { mobileH: "h-40",  tabletH: "md:h-52", avatarSize: 52, order: 1 },
  3: { mobileH: "h-[136px]", tabletH: "md:h-44", avatarSize: 48, order: 3 },
};

function PodiumCard({ entry, rank }: { entry: RankEntry; rank: 1 | 2 | 3 }) {
  const cfg = PODIUM_CONFIG[rank];

  return (
    <div
      className="flex flex-col items-center"
      style={{ order: cfg.order, flex: rank === 1 ? "0 0 38%" : "0 0 29%" }}
    >
      {/* 왕관 (1위만) */}
      {rank === 1 && (
        <div className="mb-1 text-2xl leading-none">👑</div>
      )}

      {/* 순위 뱃지 */}
      <div className="z-10 mb-[-14px] flex size-8 items-center justify-center rounded-full border-2 border-gray-400 bg-white text-sm font-extrabold text-gray-700 shadow-sm">
        {rank}
      </div>

      {/* 카드 바디 */}
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#D4EBC5] bg-white pt-6 pb-3 shadow-sm",
          cfg.mobileH,
          cfg.tabletH,
        )}
      >
        <AvatarCircle size={cfg.avatarSize} />
        <div className="px-1 text-center">
          <p className="text-[12px] font-extrabold leading-tight text-gray-900">{entry.name}</p>
          <p className="mt-0.5 text-[11px] font-bold text-[#C9A227]">{fmt(entry.score)}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   포디엄 (TOP 3)
══════════════════════════════════════════════════ */

function Podium({ top3 }: { top3: RankEntry[] }) {
  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-2">
      <PodiumCard rank={2} entry={second} />
      <PodiumCard rank={1} entry={first} />
      <PodiumCard rank={3} entry={third} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   순위 리스트 행 (4위~)
══════════════════════════════════════════════════ */

function RankRow({ entry, index }: { entry: RankEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className="flex items-center gap-3 border-b border-[#EEF5E8] py-3 last:border-none"
    >
      <span className="w-6 text-center text-sm font-extrabold text-gray-500">{entry.rank}</span>
      <AvatarCircle size={38} />
      <span className="flex-1 text-sm font-bold text-gray-900">{entry.name}</span>
      <span className="text-sm font-extrabold text-gray-800">{fmt(entry.score)}</span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   내 순위 바 (하단 고정)
══════════════════════════════════════════════════ */

function MyRankBar() {
  return (
    <div className="fixed bottom-[68px] left-1/2 z-30 w-full max-w-[1280px] -translate-x-1/2 border-t-2 border-[#D4EBC5] bg-white/97 px-4 py-2.5 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <div className="rounded-full bg-[#4A9B2F] px-3 py-1 text-xs font-extrabold text-white">
          내 순위
        </div>
        <span className="text-sm font-extrabold text-gray-900">{MY_RANK.rank}등</span>
        <AvatarCircle size={32} />
        <span className="text-sm font-bold text-gray-700">나</span>
        <span className="ml-auto text-sm font-extrabold text-[#C9A227]">{fmt(MY_RANK.score)}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   메인 페이지
══════════════════════════════════════════════════ */

export default function GameRankingPage() {
  const [activeTab, setActiveTab] = useState<RankTab>("전체 랭킹");
  const data = RANKING_DATA[activeTab];
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="px-4 pb-[156px] pt-2">
      {/* 탭 바 */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mb-4 flex rounded-xl bg-gray-200 p-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-all",
              activeTab === tab
                ? "bg-gray-700 text-white shadow"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* 타이머 */}
      <p className="mb-5 text-center text-sm font-semibold text-gray-500">
        👑 이번 주 남은 시간 : 3일 14시간
      </p>

      {/* 반응형 레이아웃: 모바일=세로 / 태블릿=2열 */}
      <div className="md:grid md:grid-cols-2 md:gap-6">
        {/* 포디엄 */}
        <motion.div
          key={activeTab + "-podium"}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 border-[#D4EBC5] bg-white p-4 shadow-sm"
        >
          <Podium top3={top3 as [RankEntry, RankEntry, RankEntry]} />
        </motion.div>

        {/* 4위~ 리스트 */}
        <motion.div
          key={activeTab + "-list"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="mt-3 rounded-2xl border-2 border-[#D4EBC5] bg-white px-4 shadow-sm md:mt-0"
        >
          {rest.map((entry, i) => (
            <RankRow key={entry.rank} entry={entry} index={i} />
          ))}
        </motion.div>
      </div>

      {/* 내 순위 고정 바 */}
      <MyRankBar />
    </div>
  );
}
