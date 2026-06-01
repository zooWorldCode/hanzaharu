"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MatchGame } from "@/components/game/match-game";
import { RainGame  } from "@/components/game/rain-game";
import { useUserState } from "@/lib/user-state-context";

/* ══════════════════════════════════════════════════
   일러스트 컴포넌트
══════════════════════════════════════════════════ */

function MatchIllustration({ large = false }: { large?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`rotate-[-8deg] rounded-2xl bg-white/90 shadow-md ${large ? "px-5 py-3" : "px-3 py-2"}`}>
        <div className={`flex gap-1 font-extrabold text-[#3D9A2B] ${large ? "text-3xl" : "text-xl"}`}>
          <span>日</span><span className="opacity-40">|</span><span>月</span>
        </div>
      </div>
    </div>
  );
}

function LightningIllustration({ large = false }: { large?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <span className={`drop-shadow-lg ${large ? "text-8xl" : "text-6xl"}`}>⚡</span>
      <span className={`absolute -right-1 top-2 opacity-40 ${large ? "text-5xl" : "text-3xl"}`}>⚡</span>
    </div>
  );
}

function ConnectIllustration({ large = false }: { large?: boolean }) {
  const sz = large ? "size-16 text-3xl" : "size-11 text-xl";
  const szSm = large ? "size-16 text-xl" : "size-11 text-sm";
  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center rounded-full bg-white/90 font-extrabold text-[#C17D10] shadow-md ${sz}`}>
        火
      </div>
      <div className="flex flex-col gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`rounded-full bg-white/60 ${large ? "h-1.5 w-8" : "h-1 w-5"}`} />
        ))}
      </div>
      <div className={`flex items-center justify-center rounded-full bg-white/90 font-extrabold text-[#C17D10] shadow-md ${szSm}`}>
        물
      </div>
    </div>
  );
}

function RainIllustration({ large = false }: { large?: boolean }) {
  const heights = large ? [20, 30, 16, 26, 20, 30, 14] : [14, 20, 12, 18, 14, 20, 10];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`rounded-2xl bg-white/90 font-extrabold text-[#5C4FC7] shadow-md ${large ? "px-6 py-2 text-4xl" : "px-4 py-1.5 text-2xl"}`}>
        水
      </div>
      <div className="flex items-end gap-1.5">
        {heights.map((h, i) => (
          <div key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   게임 데이터
══════════════════════════════════════════════════ */

type Game = {
  id: string;
  title: string;
  desc: string;
  detail: string;
  color: string;
  level: string;
  players: string;
  time: string;
  coins: number;
  xp: number;
  isPopular?: boolean;
  isNew?: boolean;
  comingSoon?: boolean;  // 서비스 준비중
  Illustration: React.ComponentType<{ large?: boolean }>;
};

const GAMES: Game[] = [
  {
    id: "match",
    title: "한자 짝맞추기",
    desc: "같은 한자를 찾아요",
    detail: "카드를 뒤집어 같은 한자를 찾는 메모리 게임이에요. 최대한 빠르게, 적은 횟수로 클리어해 보세요!",
    color: "#3D9A2B",
    level: "초급",
    players: "1인",
    time: "3~5분",
    coins: 30,
    xp: 15,
    isPopular: true,
    Illustration: MatchIllustration,
  },
  {
    id: "rain",
    title: "한자 비",
    desc: "떨어지는 한자 잡기",
    detail: "하늘에서 한자가 비처럼 내려와요! 훈음을 빠르게 타이핑해서 한자 비를 막으세요. 땅에 닿으면 목숨을 잃어요.",
    color: "#1B6B3A",
    level: "중급",
    players: "1인",
    time: "무제한",
    coins: 60,
    xp: 30,
    isNew: true,
    Illustration: RainIllustration,
  },
  {
    id: "connect",
    title: "뜻 잇기",
    desc: "한자와 뜻을 연결",
    detail: "왼쪽 한자와 오른쪽 뜻을 선으로 이어 주세요. 모두 연결하면 다음 라운드로 넘어가요!",
    color: "#E5E7EB",
    level: "초급",
    players: "1인",
    time: "3~4분",
    coins: 30,
    xp: 15,
    comingSoon: true,
    Illustration: ConnectIllustration,
  },
  {
    id: "more",
    title: "더 많은 게임",
    desc: "곧 추가될 예정이에요",
    detail: "",
    color: "#E5E7EB",
    level: "",
    players: "",
    time: "",
    coins: 0,
    xp: 0,
    comingSoon: true,
    Illustration: () => <span className="text-4xl opacity-30">🎮</span>,
  },
];

/* ══════════════════════════════════════════════════
   통계 데이터
══════════════════════════════════════════════════ */

const STATS = [
  { icon: "🏆", value: "1,240", label: "최고 점수", color: "#C9A227" },
  { icon: "▶",  value: "37판",  label: "플레이 수",  color: "#4A9B2F" },
  { icon: "📊", value: "12위",  label: "내 랭킹",    color: "#5C4FC7" },
];

/* ══════════════════════════════════════════════════
   게임 카드
══════════════════════════════════════════════════ */

function GameCard({ game, index, onClick }: { game: Game; index: number; onClick: () => void }) {
  const { Illustration } = game;

  /* ── 서비스 준비중 카드 ── */
  if (game.comingSoon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
        className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4"
      >
        {/* 일러스트 (흑백) */}
        <div className="flex h-[72px] items-center justify-center opacity-25 grayscale md:h-24">
          <Illustration />
        </div>

        {/* 제목 필 */}
        <div className="rounded-2xl bg-white/70 py-2.5 text-center">
          <p className="text-[15px] font-extrabold leading-tight text-gray-400">{game.title}</p>
        </div>

        {/* 준비중 안내 */}
        <p className="mt-2 text-center text-[11px] leading-tight text-gray-400">
          서비스 준비중입니다
        </p>
      </motion.div>
    );
  }

  /* ── 일반 카드 ── */
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex flex-col overflow-hidden rounded-3xl p-4 text-left shadow-lg active:brightness-95"
      style={{ backgroundColor: game.color }}
    >
      {/* 배지 */}
      {game.isPopular && (
        <div className="absolute left-3 top-3 rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-extrabold text-white backdrop-blur-sm">
          인기
        </div>
      )}
      {game.isNew && (
        <div className="absolute left-3 top-3 rounded-full bg-[#C9A227] px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow">
          NEW
        </div>
      )}

      {/* 일러스트 */}
      <div className="flex h-[72px] items-center justify-center md:h-24">
        <Illustration />
      </div>

      {/* 제목 필 */}
      <div className="rounded-2xl bg-white/90 py-2.5 text-center shadow-sm">
        <p className="text-[15px] font-extrabold leading-tight text-gray-900">{game.title}</p>
      </div>

      {/* 설명 */}
      <p className="mt-2 text-center text-[11px] leading-tight text-white/85">{game.desc}</p>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════
   게임 상세 바텀시트
══════════════════════════════════════════════════ */

function GameDetailSheet({ game, onClose, onPlay }: { game: Game; onClose: () => void; onPlay: () => void }) {
  const { Illustration } = game;

  const infoRows = [
    { icon: "⭐", label: "난이도", value: game.level },
    { icon: "⏱",  label: "소요 시간", value: game.time },
    { icon: "👤", label: "플레이어", value: game.players },
    { icon: "🎫", label: "입장권", value: "티켓 1장" },
    { icon: "🏆", label: "성공 보상", value: `💰 +50코인 · ⭐ +XP` },
  ];

  return (
    <>
      {/* 배경 딤 */}
      <motion.div
        key="dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* 시트 */}
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-3xl bg-white shadow-2xl"
      >
        {/* 컬러 헤더 */}
        <div
          className="relative flex flex-col items-center pb-6 pt-4"
          style={{ backgroundColor: game.color }}
        >
          {/* 핸들 */}
          <div className="mb-3 h-1 w-10 rounded-full bg-white/40" />

          {/* 닫기 */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white"
            aria-label="닫기"
          >
            ×
          </button>

          {/* 일러스트 */}
          <div className="flex h-24 items-center justify-center">
            <Illustration large />
          </div>

          {/* 배지 */}
          <div className="mt-2 flex gap-2">
            {game.isPopular && (
              <span className="rounded-full bg-white/25 px-3 py-0.5 text-xs font-extrabold text-white backdrop-blur-sm">인기</span>
            )}
            {game.isNew && (
              <span className="rounded-full bg-[#C9A227] px-3 py-0.5 text-xs font-extrabold text-white shadow">NEW</span>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="px-5 pb-10 pt-5">
          <h2 className="text-xl font-extrabold text-gray-900">{game.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{game.detail}</p>

          {/* 정보 행 */}
          <div className="mt-4 space-y-2.5">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-xl bg-[#F4FAF0] px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <span>{row.icon}</span>
                  {row.label}
                </span>
                <span className="text-sm font-extrabold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>

          {/* 시작 버튼 */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={onPlay}
            className="mt-5 w-full rounded-2xl py-4 text-base font-extrabold text-white shadow"
            style={{ backgroundColor: game.color }}
          >
            ▶ 게임 시작
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════════════ */

export function GameContent() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeGame,   setActiveGame  ] = useState<string | null>(null);
  const [noTicketWarning, setNoTicketWarning] = useState(false);
  const { tickets, spendTicket } = useUserState();

  function handlePlay(game: Game) {
    setSelectedGame(null);
    const ok = spendTicket();
    if (!ok) {
      setNoTicketWarning(true);
      setTimeout(() => setNoTicketWarning(false), 2500);
      return;
    }
    setActiveGame(game.id);
  }

  return (
    <div className="px-4 pb-16 pt-2">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <h1 className="text-2xl font-extrabold text-gray-900">한자 놀이터</h1>
        <p className="mt-0.5 text-sm text-gray-500">놀면서 배우는 한자 게임을 즐겨봐요 🎮</p>
      </motion.div>

      {/* 티켓 현황 바 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex items-center justify-between rounded-2xl bg-[#F3F0FF] px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🎫</span>
          <div>
            <p className="text-sm font-extrabold text-[#7C3AED]">보유 티켓 {tickets}장</p>
            <p className="text-[11px] text-[#7C3AED]/60">게임 1판 = 티켓 1장 소모</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`text-lg ${i <= tickets ? "opacity-100" : "opacity-20"}`}>🎫</span>
          ))}
        </div>
      </motion.div>

      {/* 게임 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            index={i}
            onClick={() => setSelectedGame(game)}
          />
        ))}
      </div>

      {/* 스탯 바 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="mt-4 grid grid-cols-3 divide-x divide-[#D4EBC5] overflow-hidden rounded-2xl border border-[#D4EBC5] bg-white shadow-sm"
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-4">
            <span className="text-xl" style={{ color: stat.color }}>{stat.icon}</span>
            <p className="mt-1 text-base font-extrabold text-gray-900">{stat.value}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* 상세 바텀시트 */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailSheet
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
            onPlay={() => handlePlay(selectedGame)}
          />
        )}
      </AnimatePresence>

      {/* 티켓 없음 경고 */}
      <AnimatePresence>
        {noTicketWarning && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-3xl bg-white px-6 py-5 shadow-2xl text-center"
          >
            <p className="text-3xl">🎫</p>
            <p className="mt-2 text-base font-extrabold text-gray-900">티켓이 없어요!</p>
            <p className="mt-1 text-sm text-gray-500">학습을 완료하면 티켓을 받을 수 있어요</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 게임 화면 ── */}
      <AnimatePresence>
        {activeGame === "match" && (
          <MatchGame key="match" onClose={() => setActiveGame(null)} />
        )}
        {activeGame === "rain" && (
          <RainGame key="rain" onClose={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
