"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUserState } from "@/lib/user-state-context";

/* ══════════════════════════════════════════════════
   데이터
══════════════════════════════════════════════════ */

const RAIN_CHARS = [
  { char: "一", huneum: "한일" },
  { char: "二", huneum: "두이" },
  { char: "三", huneum: "석삼" },
  { char: "四", huneum: "넉사" },
  { char: "五", huneum: "다섯오" },
  { char: "六", huneum: "여섯육" },
  { char: "七", huneum: "일곱칠" },
  { char: "八", huneum: "여덟팔" },
  { char: "九", huneum: "아홉구" },
  { char: "十", huneum: "열십" },
  { char: "月", huneum: "달월" },
  { char: "火", huneum: "불화" },
  { char: "水", huneum: "물수" },
  { char: "木", huneum: "나무목" },
  { char: "山", huneum: "뫼산" },
  { char: "日", huneum: "날일" },
];

const LEVEL_CONFIG = [
  { interval: 3200, speed: 8 },
  { interval: 2700, speed: 7 },
  { interval: 2200, speed: 6 },
  { interval: 1800, speed: 5.5 },
  { interval: 1500, speed: 5 },
];

function getLvConf(lv: number) {
  return LEVEL_CONFIG[Math.min(lv - 1, LEVEL_CONFIG.length - 1)];
}

type Drop = {
  uid: number;
  char: string;
  huneum: string;
  x: number;        // % 위치
  duration: number; // 낙하 시간(초)
  targetY: number;  // 최종 top px
};

type PopFx = { uid: number; x: number; type: "hit" | "miss" };

let _uid = 1;
function mkDrop(lv: number, targetY: number): Drop {
  const { speed } = getLvConf(lv);
  const c = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
  return {
    uid: _uid++,
    char: c.char,
    huneum: c.huneum,
    x: 8 + Math.random() * 72,
    duration: speed + (Math.random() - 0.5) * 0.8,
    targetY,
  };
}

/* ══════════════════════════════════════════════════
   메인
══════════════════════════════════════════════════ */

export function RainGame({ onClose }: { onClose: () => void }) {
  const [drops,  setDrops ] = useState<Drop[]>([]);
  const [input,  setInput ] = useState("");
  const [lives,  setLives ] = useState(3);
  const [score,  setScore ] = useState(0);
  const [combo,  setCombo ] = useState(0);
  const [level,  setLevel ] = useState(1);
  const [over,   setOver  ] = useState(false);
  const [gameH,  setGameH ] = useState(0);
  const [flash,  setFlash ] = useState(false);
  const [pops,   setPops  ] = useState<PopFx[]>([]);
  const [noTicket, setNoTicket] = useState(false);
  const rewardGiven = useRef(false);
  const { addCoins, addXP, spendTicket } = useUserState();

  const gameRef    = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const doneRef    = useRef(new Set<number>());
  const overRef    = useRef(false);
  const lvRef      = useRef(1);
  const comboRef   = useRef(0);
  const popUid     = useRef(1000);

  useEffect(() => { overRef.current = over; }, [over]);
  useEffect(() => { lvRef.current = level; }, [level]);
  useEffect(() => { comboRef.current = combo; }, [combo]);

  /* 높이 측정 */
  useEffect(() => {
    const m = () => { if (gameRef.current) setGameH(gameRef.current.clientHeight); };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  /* 드롭 스폰 */
  useEffect(() => {
    if (over || gameH === 0) return;

    // 첫 드롭 즉시
    setDrops(p => [...p, mkDrop(lvRef.current, gameH + 90)]);

    let last = Date.now();
    const id = setInterval(() => {
      if (overRef.current) return;
      const now = Date.now();
      if (now - last >= getLvConf(lvRef.current).interval) {
        last = now;
        setDrops(p => p.length >= 7 ? p : [...p, mkDrop(lvRef.current, gameH + 90)]);
      }
    }, 400);
    return () => clearInterval(id);
  }, [over, gameH]);

  /* 레벨업 (15초) */
  useEffect(() => {
    if (over) return;
    const id = setInterval(() => setLevel(l => Math.min(l + 1, 5)), 15000);
    return () => clearInterval(id);
  }, [over]);

  /* 게임 오버 감지 + 보상 지급 */
  useEffect(() => {
    if (lives <= 0) {
      setOver(true);
      if (!rewardGiven.current) {
        rewardGiven.current = true;
        const earnedCoins = Math.min(50, Math.floor(score / 2));
        const earnedXP    = Math.min(25, Math.floor(score / 4));
        addCoins(earnedCoins);
        addXP(earnedXP);
      }
    }
  }, [lives, score, addCoins, addXP]);

  /* 입력 포커스 유지 */
  useEffect(() => { if (!over) inputRef.current?.focus(); });

  /* 입력 처리 */
  function handleChange(val: string) {
    setInput(val);
    const hit = drops.find(d => d.huneum === val);
    if (!hit) return;

    doneRef.current.add(hit.uid);
    setDrops(p => p.filter(d => d.uid !== hit.uid));
    setScore(s => s + 10 + comboRef.current * 3);
    setCombo(c => c + 1);
    setInput("");

    const pid = popUid.current++;
    setPops(p => [...p, { uid: pid, x: hit.x, type: "hit" }]);
    setTimeout(() => setPops(p => p.filter(s => s.uid !== pid)), 500);
  }

  /* 바닥 충돌 */
  function handleBottom(uid: number, x: number) {
    if (doneRef.current.has(uid)) return;
    setDrops(p => p.filter(d => d.uid !== uid));
    setCombo(0);
    setFlash(true);
    setTimeout(() => setFlash(false), 250);
    setLives(l => Math.max(0, l - 1));

    const pid = popUid.current++;
    setPops(p => [...p, { uid: pid, x, type: "miss" }]);
    setTimeout(() => setPops(p => p.filter(s => s.uid !== pid)), 500);
  }

  /* 재시작 */
  function restart() {
    const ok = spendTicket();
    if (!ok) {
      setNoTicket(true);
      return;
    }
    rewardGiven.current = false;
    doneRef.current = new Set();
    setDrops([]);
    setInput("");
    setLives(3);
    setScore(0);
    setCombo(0);
    setLevel(1);
    setOver(false);
    setFlash(false);
    setPops([]);
    setNoTicket(false);
  }

  const target = input.length > 0 ? drops.find(d => d.huneum.startsWith(input)) : null;

  /* ── 렌더 ── */
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#081408" }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pb-2 pt-14 shrink-0">
        <button type="button" onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-white/10 text-lg text-white"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-white">한자 비</span>
          <span className="rounded-full bg-[#C9A227]/20 px-2 py-0.5 text-[11px] font-bold text-[#C9A227]">
            Lv.{level}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3].map(i => (
            <span key={i} className={`text-base ${i <= lives ? "opacity-100" : "opacity-20"}`}>❤️</span>
          ))}
        </div>
      </div>

      {/* 점수 / 콤보 */}
      <div className="flex items-center justify-between px-4 pb-1.5 shrink-0">
        <span className="text-sm font-extrabold text-[#57B72A]">점수 {score}</span>
        <AnimatePresence mode="wait">
          {combo > 1 && (
            <motion.span
              key={combo}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-extrabold text-[#C9A227]"
            >
              🔥 {combo}콤보!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* 게임 영역 */}
      <div
        ref={gameRef}
        className="relative flex-1 overflow-hidden transition-colors duration-200"
        style={{ background: flash ? "#1a0808" : "#0D1A0D" }}
      >
        {/* 낙하 드롭 */}
        {drops.map(drop => (
          <motion.div
            key={drop.uid}
            style={{ position: "absolute", left: `${drop.x}%`, transform: "translateX(-50%)" }}
            initial={{ top: -90 }}
            animate={{ top: drop.targetY }}
            transition={{ duration: drop.duration, ease: "linear" }}
            onAnimationComplete={() => handleBottom(drop.uid, drop.x)}
            className="flex flex-col items-center"
          >
            <div
              className="flex min-w-[56px] flex-col items-center justify-center rounded-2xl px-3 py-2 shadow-lg"
              style={{
                background: "#1B6B3A",
                boxShadow: target?.uid === drop.uid
                  ? "0 0 0 2px #C9A227, 0 4px 16px #C9A22755"
                  : undefined,
              }}
            >
              <span className="text-2xl font-extrabold leading-none text-white">{drop.char}</span>
              <span className="mt-0.5 text-[10px] font-bold text-white/55">{drop.huneum}</span>
            </div>
            {/* 꼬리 */}
            <div className="h-3 w-2 rounded-b-full opacity-40" style={{ background: "#1B6B3A" }} />
          </motion.div>
        ))}

        {/* 이펙트 */}
        <AnimatePresence>
          {pops.map(p => (
            <motion.div
              key={p.uid}
              initial={{ opacity: 1, scale: 0.6 }}
              animate={{ opacity: 0, scale: p.type === "hit" ? 2 : 1.4, y: p.type === "hit" ? -24 : 0 }}
              transition={{ duration: 0.45 }}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                ...(p.type === "hit" ? { top: "35%" } : { bottom: 4 }),
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
              className="select-none text-xl"
            >
              {p.type === "hit" ? "✨" : "💧"}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 바닥선 */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#57B72A]/20" />
      </div>

      {/* 입력 */}
      <div className="shrink-0 px-4 py-4" style={{ background: "#081408" }}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => handleChange(e.target.value)}
            placeholder="훈음 입력 (예: 석삼, 달월)"
            disabled={over}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            className="w-full rounded-2xl px-4 py-3.5 text-center text-base font-bold text-white placeholder-white/25 outline-none ring-2 ring-[#57B72A]/30 focus:ring-[#57B72A] transition-all"
            style={{ background: "#1B2B1B" }}
          />
          {target && input.length > 0 && (
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl font-extrabold text-[#C9A227]">
              {target.char}
            </div>
          )}
        </div>
        <p className="mt-1.5 text-center text-[11px] text-white/25">
          한자의 훈음을 입력해서 한자 비를 막으세요
        </p>
      </div>

      {/* 게임 오버 */}
      <AnimatePresence>
        {over && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              <div className="text-5xl">☔</div>
              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">게임 오버</h2>
              <p className="mt-1 text-sm text-gray-500">한자 비를 다 막지 못했어요</p>

              <div className="mt-4 rounded-2xl bg-[#F4FAF0] py-4">
                <p className="text-3xl font-extrabold text-[#4A9B2F]">{score}점</p>
                <p className="mt-0.5 text-xs text-gray-400">최종 점수</p>
              </div>

              {/* 점수 기반 보상 */}
              <div className="mt-3 flex justify-center gap-3">
                <span className="rounded-full bg-[#FFFBE6] px-3 py-1.5 text-sm font-bold text-[#C9A227]">
                  💰 +{Math.min(50, Math.floor(score / 2))} 코인
                </span>
                <span className="rounded-full bg-[#E8F5E0] px-3 py-1.5 text-sm font-bold text-[#4A9B2F]">
                  ⭐ +{Math.min(25, Math.floor(score / 4))} XP
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {noTicket ? (
                  <div className="rounded-2xl bg-[#FEF3C7] px-4 py-3 text-center">
                    <p className="text-sm font-bold text-[#B45309]">🎫 티켓이 없어요</p>
                    <p className="text-xs text-[#B45309]/70 mt-0.5">학습을 완료하면 티켓을 받을 수 있어요</p>
                  </div>
                ) : (
                  <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={restart}
                    className="w-full rounded-2xl bg-[#4A9B2F] py-3.5 text-sm font-extrabold text-white shadow"
                  >
                    🎫 티켓 1장 사용 · 다시 도전하기
                  </motion.button>
                )}
                <button type="button" onClick={onClose}
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
