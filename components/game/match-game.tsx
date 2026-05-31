"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserState } from "@/lib/user-state-context";

/* ══════════════════════════════════════════════════
   한자 데이터 (learning stage1 의 一~六)
══════════════════════════════════════════════════ */

const GAME_CHARS = [
  { pairId: 0, char: "一", meaning: "하나", emoji: "1️⃣" },
  { pairId: 1, char: "二", meaning: "둘",   emoji: "2️⃣" },
  { pairId: 2, char: "三", meaning: "셋",   emoji: "3️⃣" },
  { pairId: 3, char: "四", meaning: "넷",   emoji: "4️⃣" },
  { pairId: 4, char: "五", meaning: "다섯", emoji: "5️⃣" },
  { pairId: 5, char: "六", meaning: "여섯", emoji: "6️⃣" },
];

const PREVIEW_SECS = 3;
const PLAY_SECS    = 30;

/* ══════════════════════════════════════════════════
   타입
══════════════════════════════════════════════════ */

type CardItem = {
  id: number;
  pairId: number;
  type: "hanja" | "emoji";
  content: string;
  meaning: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Phase = "preview" | "playing" | "success" | "fail";

/* ══════════════════════════════════════════════════
   유틸
══════════════════════════════════════════════════ */

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildCards(): CardItem[] {
  const raw = GAME_CHARS.flatMap((c) => [
    { pairId: c.pairId, type: "hanja" as const, content: c.char,  meaning: c.meaning },
    { pairId: c.pairId, type: "emoji" as const, content: c.emoji, meaning: c.meaning },
  ]);
  return shuffle(raw).map((c, i) => ({ ...c, id: i, isFlipped: true, isMatched: false }));
}

/* ══════════════════════════════════════════════════
   카드 컴포넌트
══════════════════════════════════════════════════ */

function MemoryCard({
  card,
  isSelected,
  isShaking,
  onClick,
}: {
  card: CardItem;
  isSelected: boolean;
  isShaking: boolean;
  onClick: () => void;
}) {
  return (
    /* perspective wrapper */
    <div
      className="aspect-[3/4] relative cursor-pointer select-none"
      style={{ perspective: 600 }}
      onClick={onClick}
    >
      {/* 3-D flip container */}
      <motion.div
        className="w-full h-full"
        animate={{
          rotateY: card.isFlipped ? 0 : 180,
          x: isShaking ? [0, -5, 5, -5, 5, 0] : 0,
        }}
        transition={{
          rotateY: { duration: 0.38, ease: "easeInOut" },
          x:       { duration: 0.45 },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ── 앞면 ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          {card.type === "hanja" ? (
            <div className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1 rounded-2xl transition-colors",
              card.isMatched ? "bg-[#57B72A]" : "bg-[#3D9A2B]",
            )}>
              <span className="text-[26px] font-extrabold text-white leading-none">
                {card.content}
              </span>
              <span className="text-[9px] font-bold text-white/65">{card.meaning}</span>
            </div>
          ) : (
            <div className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-colors",
              card.isMatched
                ? "bg-[#F0F9E8] border-[#57B72A]"
                : "bg-[#FFFBE6] border-[#C9A227]",
            )}>
              <span className="text-[26px] leading-none">{card.content}</span>
              <span className="text-[9px] font-bold text-[#B56012]">{card.meaning}</span>
            </div>
          )}
        </div>

        {/* ── 뒷면 ── */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#D4EBC5] shadow"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-3xl font-extrabold text-[#4A9B2F]/20 select-none">漢</span>
        </div>
      </motion.div>

      {/* 선택 링 */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-[3px] ring-[#C9A227] ring-offset-1" />
      )}

      {/* 매치 체크 배지 */}
      {card.isMatched && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full bg-[#57B72A] text-[10px] font-extrabold text-white shadow"
        >
          ✓
        </motion.div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   메인 게임 컴포넌트
══════════════════════════════════════════════════ */

export function MatchGame({ onClose }: { onClose: () => void }) {
  const [cards,       setCards      ] = useState<CardItem[]>(buildCards);
  const [phase,       setPhase      ] = useState<Phase>("preview");
  const [prevCount,   setPrevCount  ] = useState(PREVIEW_SECS);
  const [timeLeft,    setTimeLeft   ] = useState(PLAY_SECS);
  const [selected,    setSelected   ] = useState<number[]>([]); // card ids
  const [matched,     setMatched    ] = useState(0);
  const [isLocked,    setIsLocked   ] = useState(false);
  const [shakingIds,  setShakingIds ] = useState<number[]>([]);
  const [noTicket,    setNoTicket   ] = useState(false);
  const rewardGiven = useRef(false);
  const { addCoins, addXP, spendTicket } = useUserState();

  /* ── 미리보기 카운트다운 ── */
  useEffect(() => {
    if (phase !== "preview") return;
    if (prevCount <= 0) {
      // 카드 전부 뒤집기
      const t = setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
        setPhase("playing");
      }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPrevCount(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, prevCount]);

  /* ── 플레이 타이머 ── */
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) { setPhase("fail"); return; }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  /* ── 카드 클릭 ── */
  const handleCardClick = useCallback((cardId: number) => {
    if (phase !== "playing" || isLocked) return;

    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;
      return prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    });

    setSelected(prev => {
      const card = cards.find(c => c.id === cardId);
      if (!card || card.isFlipped || card.isMatched) return prev;

      if (prev.length === 0) return [cardId];

      const firstId = prev[0];
      if (firstId === cardId) return prev; // 같은 카드 재클릭 무시

      /* 두 번째 카드 선택 → 매치 판정 */
      setIsLocked(true);
      const newCards = cards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
      const first  = newCards.find(c => c.id === firstId)!;
      const second = newCards.find(c => c.id === cardId)!;

      if (first.pairId === second.pairId && first.type !== second.type) {
        /* ✅ 매치 성공 */
        const updated = newCards.map(c =>
          c.id === firstId || c.id === cardId ? { ...c, isMatched: true } : c
        );
        setCards(updated);
        const newMatched = matched + 1;
        setMatched(newMatched);
        setIsLocked(false);
        if (newMatched >= 6) setTimeout(() => setPhase("success"), 500);
      } else {
        /* ❌ 매치 실패 — 흔들고 뒤집기 */
        setCards(newCards);
        setShakingIds([firstId, cardId]);
        setTimeout(() => {
          setCards(cc => cc.map(c =>
            (c.id === firstId || c.id === cardId) && !c.isMatched
              ? { ...c, isFlipped: false }
              : c
          ));
          setShakingIds([]);
          setIsLocked(false);
        }, 750);
      }
      return [];
    });
  }, [phase, isLocked, cards, matched]);

  /* ── 성공 시 보상 지급 (1회) ── */
  useEffect(() => {
    if (phase === "success" && !rewardGiven.current) {
      rewardGiven.current = true;
      const coins = timeLeft >= 20 ? 50 : timeLeft >= 10 ? 35 : 20;
      const xp    = timeLeft >= 20 ? 25 : timeLeft >= 10 ? 18 : 12;
      addCoins(coins);
      addXP(xp);
    }
  }, [phase, addCoins, addXP, timeLeft]);

  /* ── 재시작 ── */
  function handleRestart() {
    const ok = spendTicket();
    if (!ok) {
      setNoTicket(true);
      return;
    }
    rewardGiven.current = false;
    setCards(buildCards());
    setPhase("preview");
    setPrevCount(PREVIEW_SECS);
    setTimeLeft(PLAY_SECS);
    setSelected([]);
    setMatched(0);
    setIsLocked(false);
    setShakingIds([]);
  }

  /* ── 파생 값 ── */
  const timeTaken   = PLAY_SECS - timeLeft;
  const coinsEarned = timeLeft >= 20 ? 50 : timeLeft >= 10 ? 35 : 20;
  const xpEarned    = timeLeft >= 20 ? 25 : timeLeft >= 10 ? 18 : 12;
  const timerPct    = (timeLeft / PLAY_SECS) * 100;
  const timerColor  = timeLeft > 15 ? "#57B72A" : timeLeft > 7 ? "#C9A227" : "#C9821A";

  /* ══════════════════════════════════════════════
     렌더
  ══════════════════════════════════════════════ */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#F4FAF0]"
    >
      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between px-4 pb-3 pt-14">
        <button
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full bg-white text-xl text-gray-500 shadow-sm"
          aria-label="뒤로"
        >
          ←
        </button>
        <h1 className="text-base font-extrabold text-gray-900">한자 짝맞추기</h1>
        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F5E0] text-sm font-extrabold text-[#4A9B2F]">
          {matched}/6
        </div>
      </div>

      {/* ── 타이머 / 미리보기 바 ── */}
      <div className="px-4 pb-3">
        {phase === "preview" ? (
          /* 미리보기 상태: 카운트다운 크게 표시 */
          <div className="rounded-2xl bg-[#4A9B2F] px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-extrabold text-white">📌 위치를 기억하세요!</span>
            <motion.span
              key={prevCount}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="text-xl font-extrabold text-white tabular-nums"
            >
              {prevCount}
            </motion.span>
          </div>
        ) : (
          /* 플레이 상태: 진행 바 */
          <>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500">{matched}쌍 매치됨</span>
              <span className="text-sm font-extrabold tabular-nums" style={{ color: timerColor }}>
                {timeLeft}초
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#D4EBC5]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: timerColor }}
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.9, ease: "linear" }}
              />
            </div>
          </>
        )}
      </div>

      {/* ── 카드 그리드 ── */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="grid w-full max-w-sm grid-cols-4 gap-2">
          {cards.map(card => (
            <MemoryCard
              key={card.id}
              card={card}
              isSelected={selected[0] === card.id}
              isShaking={shakingIds.includes(card.id)}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>
      </div>

      {/* 하단 여백 (탭바 공간) */}
      <div className="h-6" />


      {/* ══════════════════════════════════════════
          결과 오버레이 — 성공
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-[3px] px-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <motion.div
                initial={{ rotate: -15, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="text-5xl"
              >
                🎉
              </motion.div>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">성공!</h2>
              <p className="mt-1 text-sm text-gray-500">
                {timeTaken}초 만에 모두 찾았어요
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#FFFBE6] p-3">
                  <p className="text-lg font-extrabold text-[#C9A227]">💰 +{coinsEarned}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">코인 획득</p>
                </div>
                <div className="rounded-2xl bg-[#E8F5E0] p-3">
                  <p className="text-lg font-extrabold text-[#4A9B2F]">⭐ +{xpEarned}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">XP 획득</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {noTicket ? (
                  <div className="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-center">
                    <p className="text-sm font-bold text-[#B45309]">🎫 티켓이 없어요</p>
                    <p className="text-xs text-[#B45309]/70 mt-0.5">학습을 완료하면 티켓을 받을 수 있어요</p>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRestart}
                    className="w-full rounded-2xl bg-[#4A9B2F] py-3.5 text-sm font-extrabold text-white shadow"
                  >
                    🎫 티켓 1장 사용 · 다시 하기
                  </motion.button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border-2 border-gray-200 py-3.5 text-sm font-bold text-gray-600"
                >
                  게임 목록으로
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          결과 오버레이 — 실패
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "fail" && (
          <motion.div
            key="fail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-[3px] px-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="text-5xl">⏰</div>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">시간 초과!</h2>
              <p className="mt-1 text-sm text-gray-500">
                {matched}쌍 찾았어요 · 조금만 더 빠르게!
              </p>

              {/* 진행 상황 요약 */}
              <div className="mt-4 rounded-2xl bg-[#F4FAF0] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">매치 성공</span>
                  <span className="text-sm font-extrabold text-[#4A9B2F]">{matched} / 6</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#D4EBC5]">
                  <div
                    className="h-full rounded-full bg-[#57B72A]"
                    style={{ width: `${(matched / 6) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {noTicket ? (
                  <div className="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-center">
                    <p className="text-sm font-bold text-[#B45309]">🎫 티켓이 없어요</p>
                    <p className="text-xs text-[#B45309]/70 mt-0.5">학습을 완료하면 티켓을 받을 수 있어요</p>
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRestart}
                    className="w-full rounded-2xl bg-[#4A9B2F] py-3.5 text-sm font-extrabold text-white shadow"
                  >
                    🎫 티켓 1장 사용 · 다시 도전하기
                  </motion.button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-2xl border-2 border-gray-200 py-3.5 text-sm font-bold text-gray-600"
                >
                  게임 목록으로
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
