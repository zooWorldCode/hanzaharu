"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { WritingQuestion, type WritingResult } from "@/components/test/writing-question";
import { useUserState } from "@/lib/user-state-context";

/* ══════════════════════════════════════════════════
   문제 타입 정의
══════════════════════════════════════════════════ */

type ChoiceQ = {
  kind: "choice";
  type: "reading" | "meaning" | "char" | "dialogue" | "image";
  prompt: string;
  display?: string;
  emoji?: string;
  dialogue?: { speaker: string; line: string }[];
  choices: string[];
  answer: string;
  hint: string;
};

type WriteQ = {
  kind: "write";
  char: string;
  reading: string;
  meaning: string;
};

type ExamQuestion = ChoiceQ | WriteQ;

/* ══════════════════════════════════════════════════
   시험 문제 13개 (5가지 유형)
══════════════════════════════════════════════════ */

const EXAM_QUESTIONS: ExamQuestion[] = [
  /* ── 유형 1: 한자 보고 음/뜻 고르기 ── */
  {
    kind: "choice", type: "reading",
    prompt: "이 한자의 음(읽는 방법)은?",
    display: "一",
    choices: ["일", "이", "삼", "사"],
    answer: "일", hint: "一(일) — 하나",
  },
  {
    kind: "choice", type: "reading",
    prompt: "이 한자의 음(읽는 방법)은?",
    display: "七",
    choices: ["오", "육", "칠", "팔"],
    answer: "칠", hint: "七(칠) — 일곱",
  },
  {
    kind: "choice", type: "meaning",
    prompt: "이 한자의 뜻은?",
    display: "五",
    choices: ["넷", "다섯", "여섯", "일곱"],
    answer: "다섯", hint: "五(오) — 다섯",
  },
  {
    kind: "choice", type: "meaning",
    prompt: "이 한자의 뜻은?",
    display: "十",
    choices: ["여덟", "아홉", "열", "열하나"],
    answer: "열", hint: "十(십) — 열",
  },

  /* ── 유형 2: 필기 인식 ── */
  { kind: "write", char: "一", reading: "일", meaning: "하나" },
  { kind: "write", char: "三", reading: "삼", meaning: "셋" },
  { kind: "write", char: "十", reading: "십", meaning: "열" },

  /* ── 유형 3: 음+뜻 보고 한자 고르기 ── */
  {
    kind: "choice", type: "char",
    prompt: "음과 뜻에 맞는 한자를 고르세요",
    display: "팔 · 여덟",
    choices: ["六", "七", "八", "九"],
    answer: "八", hint: "八(팔) — 여덟",
  },

  /* ── 유형 4: 대화문 빈칸 채우기 ── */
  {
    kind: "choice", type: "dialogue",
    prompt: "대화를 읽고 빈칸에 알맞은 한자를 고르세요",
    choices: ["一", "二", "三", "四"],
    answer: "三", hint: "셋 = 三(삼)",
    dialogue: [
      { speaker: "선생님", line: "책상 위에 사과가 몇 개 있나요?" },
      { speaker: "민준",   line: "사과가 ___ 개 있어요. (셋)" },
    ],
  },
  {
    kind: "choice", type: "dialogue",
    prompt: "대화를 읽고 빈칸에 알맞은 한자를 고르세요",
    choices: ["七", "八", "九", "十"],
    answer: "十", hint: "열 = 十(십)",
    dialogue: [
      { speaker: "지아", line: "오늘 계단 몇 칸 올라갔어?" },
      { speaker: "현우", line: "나는 ___ 칸 올라갔어. (열)" },
    ],
  },

  /* ── 유형 5: 이미지 보고 한자 고르기 ── */
  {
    kind: "choice", type: "image",
    prompt: "그림과 가장 관련 있는 한자를 고르세요",
    emoji: "🖐️",
    choices: ["三", "四", "五", "六"],
    answer: "五", hint: "손가락 다섯 개 → 五(오)",
  },
  {
    kind: "choice", type: "image",
    prompt: "그림과 가장 관련 있는 한자를 고르세요",
    emoji: "👀",
    choices: ["一", "二", "三", "四"],
    answer: "二", hint: "눈이 두 개 → 二(이)",
  },
];

const TOTAL = EXAM_QUESTIONS.length;
const EXAM_SECONDS = 5 * 60;

/* ══════════════════════════════════════════════════
   타이머 훅
══════════════════════════════════════════════════ */
function useExamTimer(onTimeUp: () => void) {
  const [sec, setSec] = useState(EXAM_SECONDS);
  const ref = useRef(sec);
  ref.current = sec;

  useEffect(() => {
    const id = setInterval(() => {
      if (ref.current <= 1) { clearInterval(id); setSec(0); onTimeUp(); }
      else setSec((s) => s - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [onTimeUp]);

  return {
    display: `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`,
    ratio: sec / EXAM_SECONDS,
    urgent: sec <= 60,
  };
}

/* ══════════════════════════════════════════════════
   객관식 공통 버튼
══════════════════════════════════════════════════ */
function ChoiceBtn({
  label, selected, isAnswer, locked, onClick, large = false,
}: {
  label: string; selected: boolean; isAnswer: boolean; locked: boolean; onClick: () => void; large?: boolean;
}) {
  let cls = "border-[#D4EBC5] bg-white text-gray-900";
  if (locked) {
    if (isAnswer)       cls = "border-[#57B72A] bg-[#f0fdf4] text-[#288b1b]";
    else if (selected)  cls = "border-[#C9A227] bg-[#FFFBE6] text-[#B56012]";
    else                cls = "border-[#D4EBC5] bg-gray-50 text-gray-300";
  }
  return (
    <motion.button
      type="button"
      whileTap={locked ? {} : { scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-2xl border-2 font-extrabold shadow-sm transition-colors",
        large ? "py-5 text-3xl" : "py-4 text-xl",
        cls,
      )}
    >
      {label}
      {locked && isAnswer  && <span className="ml-1.5 text-base">✓</span>}
      {locked && selected && !isAnswer && <span className="ml-1.5 text-base">✗</span>}
    </motion.button>
  );
}

function FeedbackLine({ selected, answer, hint }: { selected: string; answer: string; hint: string }) {
  const ok = selected === answer;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className={cn("text-sm font-extrabold", ok ? "text-[#288b1b]" : "text-[#B56012]")}
    >
      {ok ? "🎉 정답이에요!" : `❌ 정답은 "${answer}" — ${hint}`}
    </motion.p>
  );
}

/* ══════════════════════════════════════════════════
   문제 화면들
══════════════════════════════════════════════════ */

function QuestionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-3xl border-2 border-[#c2e8a8] bg-[#f0fdf4] shadow-sm">
      {children}
    </div>
  );
}

function CharDisplayScreen({ q, selected, onPick }: { q: ChoiceQ; selected: string | null; onPick: (c: string) => void }) {
  const locked = selected !== null;
  const isChar = q.type === "char";
  return (
    <div className="flex flex-col items-center gap-5 px-5 pt-4">
      <p className="text-sm font-extrabold text-gray-600">{q.prompt}</p>
      <QuestionCard>
        <div className="flex items-center justify-center py-10">
          <span className="select-none font-bold leading-none text-gray-900"
            style={{ fontSize: isChar ? "1.6rem" : "6rem" }}>
            {q.display}
          </span>
        </div>
      </QuestionCard>
      {locked && <FeedbackLine selected={selected!} answer={q.answer} hint={q.hint} />}
      <div className="grid w-full grid-cols-2 gap-3">
        {q.choices.map((c) => (
          <ChoiceBtn key={c} label={c} selected={selected === c} isAnswer={c === q.answer}
            locked={locked} onClick={() => onPick(c)} large={isChar} />
        ))}
      </div>
    </div>
  );
}

function DialogueScreen({ q, selected, onPick }: { q: ChoiceQ; selected: string | null; onPick: (c: string) => void }) {
  const locked = selected !== null;
  return (
    <div className="flex flex-col items-center gap-5 px-5 pt-4">
      <p className="text-sm font-extrabold text-gray-600">{q.prompt}</p>
      <QuestionCard>
        <div className="flex flex-col gap-3 px-5 py-5">
          {q.dialogue?.map((line, i) => (
            <div key={i} className={cn("flex gap-2", i % 2 === 1 ? "flex-row-reverse" : "flex-row")}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-base shadow-sm">
                {i % 2 === 0 ? "👩‍🏫" : "🧒"}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm font-bold leading-snug",
                i % 2 === 0 ? "rounded-tl-none bg-white text-gray-700 shadow-sm" : "rounded-tr-none bg-[#57B72A] text-white",
              )}>
                <span className="text-[11px] font-semibold opacity-60">{line.speaker}</span>
                <p>
                  {line.line.includes("___") ? (
                    <>
                      {line.line.split("___")[0]}
                      <span className="inline-block min-w-[2rem] rounded-lg border-b-2 border-dashed border-current px-1 text-center">
                        {locked ? q.answer : "　"}
                      </span>
                      {line.line.split("___")[1]}
                    </>
                  ) : line.line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </QuestionCard>
      {locked && <FeedbackLine selected={selected!} answer={q.answer} hint={q.hint} />}
      <div className="grid w-full grid-cols-4 gap-2">
        {q.choices.map((c) => (
          <ChoiceBtn key={c} label={c} selected={selected === c} isAnswer={c === q.answer}
            locked={locked} onClick={() => onPick(c)} large />
        ))}
      </div>
    </div>
  );
}

function ImageScreen({ q, selected, onPick }: { q: ChoiceQ; selected: string | null; onPick: (c: string) => void }) {
  const locked = selected !== null;
  return (
    <div className="flex flex-col items-center gap-5 px-5 pt-4">
      <p className="text-sm font-extrabold text-gray-600">{q.prompt}</p>
      <QuestionCard>
        <div className="flex items-center justify-center py-10">
          <span className="text-8xl">{q.emoji}</span>
        </div>
      </QuestionCard>
      {locked && <FeedbackLine selected={selected!} answer={q.answer} hint={q.hint} />}
      <div className="grid w-full grid-cols-4 gap-2">
        {q.choices.map((c) => (
          <ChoiceBtn key={c} label={c} selected={selected === c} isAnswer={c === q.answer}
            locked={locked} onClick={() => onPick(c)} large />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   결과 화면
══════════════════════════════════════════════════ */

type AnswerRecord = { passed: boolean } | null;

const TYPE_LABEL: Record<string, string> = {
  reading: "음 읽기", meaning: "뜻 찾기", char: "한자 찾기",
  dialogue: "대화문", image: "이미지", write: "필기",
};

// 시험 1회 통과 보상 정보
const EXAM_REWARD = {
  coins: 50,
  xp: 50,
  itemName: "백의한복",
  itemEmoji: "👘",
  newTitle: "한자초보",
};

function ResultScreen({
  answers, onRetry, onBack,
}: { answers: AnswerRecord[]; onRetry: () => void; onBack: () => void }) {
  const correct = answers.filter((a) => a?.passed).length;
  const passed = correct >= Math.ceil(TOTAL * 0.7);
  const { addCoins, addXP } = useUserState();
  const rewardGiven = useRef(false);

  useEffect(() => {
    if (rewardGiven.current) return;

    rewardGiven.current = true;
    addXP(EXAM_REWARD.xp);
    if (passed) addCoins(EXAM_REWARD.coins);
  }, [passed, addCoins, addXP]);

  return (
    <div className="flex min-h-screen flex-col bg-white px-5 py-8">
      <div className="mb-6 text-center">
        <motion.div className="mb-3 text-6xl"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, delay: 0.15 }}>
          {passed ? "🎉" : "😢"}
        </motion.div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          {passed ? "시험 통과!" : "아쉽네요..."}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {passed ? "훌륭해요! 다음 스텝에 도전해봐요" : "조금 더 공부하고 다시 도전해봐요"}
        </p>
      </div>

      <div className="mb-5 rounded-3xl border-2 border-[#c2e8a8] bg-[#f0fdf4] p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-500">최종 점수</span>
          <span className={cn("text-3xl font-extrabold", passed ? "text-[#288b1b]" : "text-[#B56012]")}>
            {correct} / {TOTAL}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white">
          <motion.div className="h-full rounded-full"
            style={{ background: passed ? "linear-gradient(to right,#57B72A,#a3d88a)" : "linear-gradient(to right,#B56012,#C9A227)" }}
            initial={{ width: 0 }} animate={{ width: `${(correct / TOTAL) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
        {passed && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-bold text-gray-500">획득 보상</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#fff6df] px-3 py-1.5 text-sm font-bold text-[#b87917] ring-1 ring-[#f4dfa8]">
                💰 +{EXAM_REWARD.coins} 코인
              </span>
              <span className="rounded-full bg-[#f0fdf4] px-3 py-1.5 text-sm font-bold text-[#288b1b] ring-1 ring-[#cfe8bf]">
                ⭐ +{EXAM_REWARD.xp} XP
              </span>
            </div>
            {/* 보상 아이템 */}
            <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#F3F0FF] p-3">
              <p className="mb-2 text-xs font-bold text-[#7C3AED]">🎁 보상 아이템</p>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm text-2xl">
                  {EXAM_REWARD.itemEmoji}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">{EXAM_REWARD.itemName}</p>
                  <p className="text-[11px] text-gray-500">마이룸 · 캐릭터 꾸미기에 사용</p>
                </div>
              </div>
            </div>
            {/* 칭호 */}
            <div className="rounded-2xl border border-[#C9A227]/30 bg-[#FFFBE6] p-3">
              <p className="mb-1 text-xs font-bold text-[#C9A227]">🏅 획득 칭호</p>
              <p className="text-base font-extrabold text-gray-900">{EXAM_REWARD.newTitle}</p>
              <p className="text-[11px] text-gray-500">마이페이지에서 칭호를 변경할 수 있어요</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 space-y-2">
        {EXAM_QUESTIONS.map((q, i) => {
          const rec = answers[i];
          const ok = rec?.passed ?? false;
          const label = q.kind === "write"
            ? `필기 — ${q.char}(${q.reading})`
            : `${TYPE_LABEL[q.type]} — ${(q as ChoiceQ).answer}`;
          return (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-[#D4EBC5] bg-white px-4 py-3 shadow-sm">
              <span className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                ok ? "bg-[#57B72A]/15 text-[#57B72A]" : "bg-[#FFFBE6] text-[#B56012]",
              )}>{ok ? "✓" : "✗"}</span>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                {TYPE_LABEL[q.kind === "write" ? "write" : q.type]}
              </span>
              <span className="flex-1 text-sm font-bold text-gray-700">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {!passed && (
          <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onRetry}
            className="w-full rounded-2xl bg-[#4A9B2F] py-4 text-base font-extrabold text-white shadow-md">
            다시 도전하기
          </motion.button>
        )}
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={onBack}
          className="w-full rounded-2xl border-2 border-[#D4EBC5] bg-white py-4 text-base font-bold text-gray-700">
          시험 목록으로
        </motion.button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   세그먼트 바
══════════════════════════════════════════════════ */
function SegmentBar({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="h-2 flex-1 rounded-full"
          animate={{ backgroundColor: i < current ? "#57B72A" : i === current ? "#a3d88a" : "#e5e7eb" }}
          transition={{ duration: 0.3 }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   메인 ExamSession
══════════════════════════════════════════════════ */

export function ExamSession({
  onBack,
  onPassed,
}: {
  onBack: () => void;
  onPassed?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>(Array(TOTAL).fill(null));
  // 객관식 선택 값
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null);
  // 필기 완료 여부
  const [writeAnswered, setWriteAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleTimeUp = useCallback(() => setFinished(true), []);
  const { display: timerDisplay, ratio: timerRatio, urgent } = useExamTimer(handleTimeUp);

  const q = EXAM_QUESTIONS[index];
  const isLast = index === TOTAL - 1;

  // 다음 버튼 비활성 조건
  const nextDisabled =
    q.kind === "choice" ? choiceSelected === null :
    q.kind === "write"  ? !writeAnswered : false;

  function recordAndNext(passed: boolean) {
    const next = [...answers];
    next[index] = { passed };
    setAnswers(next);
    if (isLast) { setFinished(true); return; }
    setIndex((i) => i + 1);
    setChoiceSelected(null);
    setWriteAnswered(false);
  }

  function pickChoice(c: string) {
    if (choiceSelected !== null) return;
    setChoiceSelected(c);
    const q_ = q as ChoiceQ;
    // 1초 뒤 자동 이동
    setTimeout(() => recordAndNext(c === q_.answer), 1000);
  }

  function handleWriteAnswered(result: WritingResult) {
    setWriteAnswered(true);
    // 필기는 수동으로 다음 눌러야 이동
    const next = [...answers];
    next[index] = { passed: result.pass };
    setAnswers(next);
  }

  function goNext() {
    if (nextDisabled) return;
    if (q.kind === "write") {
      if (isLast) { setFinished(true); return; }
      setIndex((i) => i + 1);
      setWriteAnswered(false);
      setChoiceSelected(null);
    }
  }

  function handleRetry() {
    setIndex(0);
    setAnswers(Array(TOTAL).fill(null));
    setChoiceSelected(null);
    setWriteAnswered(false);
    setFinished(false);
  }

  if (finished) {
    return (
      <ResultScreen
        answers={answers}
        onRetry={handleRetry}
        onBack={() => {
          const correct = answers.filter((a) => a?.passed).length;
          const passed = correct >= Math.ceil(TOTAL * 0.7);
          if (passed) {
            onPassed?.();
          }
          onBack();
        }}
      />
    );
  }

  const progress = (index / TOTAL) * 100;
  const typeLabel = q.kind === "write" ? "필기" : TYPE_LABEL[q.type] ?? "";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* 상단 바 */}
      <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-12">
        <button type="button" aria-label="나가기" onClick={onBack}
          className="flex size-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 active:bg-gray-200">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <motion.div className="h-full rounded-full bg-[#57B72A]"
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
        <span className="shrink-0 text-xs font-bold text-gray-400">{index + 1} / {TOTAL}</span>
      </div>

      {/* 타이머 */}
      <div className="mx-5 mb-3 flex items-center gap-2 rounded-2xl border border-[#D4EBC5] bg-gray-50 px-4 py-2">
        <span className="text-xs font-bold text-gray-400">남은 시간</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <motion.div className="h-full rounded-full"
            style={{ background: urgent ? "#C9A227" : "#57B72A" }}
            animate={{ width: `${timerRatio * 100}%` }} transition={{ duration: 0.9, ease: "linear" }} />
        </div>
        <span className={cn("shrink-0 text-sm font-extrabold tabular-nums", urgent ? "text-[#C9A227]" : "text-gray-700")}>
          {timerDisplay}
        </span>
      </div>

      {/* 문제 유형 뱃지 */}
      <div className="mx-5 mb-2 flex items-center gap-2">
        <span className="rounded-full bg-[#4A9B2F]/10 px-3 py-0.5 text-[11px] font-bold text-[#4A9B2F]">
          한자 뜻음 · Ch.1 Stage 1~2
        </span>
        <span className="rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-bold text-gray-500">
          {typeLabel}
        </span>
      </div>

      {/* 문제 영역 */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}>

            {q.kind === "choice" && (q.type === "reading" || q.type === "meaning" || q.type === "char") && (
              <CharDisplayScreen q={q} selected={choiceSelected} onPick={pickChoice} />
            )}
            {q.kind === "choice" && q.type === "dialogue" && (
              <DialogueScreen q={q} selected={choiceSelected} onPick={pickChoice} />
            )}
            {q.kind === "choice" && q.type === "image" && (
              <ImageScreen q={q} selected={choiceSelected} onPick={pickChoice} />
            )}
            {q.kind === "write" && (
              <WritingQuestion
                char={q.char} reading={q.reading} meaning={q.meaning}
                onAnswered={handleWriteAnswered}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 바 */}
      <div className="shrink-0 px-5 pb-10 pt-3">
        <SegmentBar total={TOTAL} current={index} />
        {/* 필기 문제일 때만 수동 다음 버튼 (객관식은 자동 이동) */}
        {q.kind === "write" && (
          <motion.button type="button" onClick={goNext} disabled={nextDisabled}
            whileTap={nextDisabled ? {} : { scale: 0.97 }}
            className="mt-4 w-full rounded-2xl py-4 text-base font-extrabold text-white shadow-md transition-all disabled:opacity-40"
            style={{
              background: nextDisabled ? "#a3d88a" : "linear-gradient(180deg,#6bcf3a 0%,#57B72A 100%)",
              boxShadow: nextDisabled ? "none" : "0 4px 0 #3d8a1c",
            }}>
            {isLast ? "완료 🎉" : "다음"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
