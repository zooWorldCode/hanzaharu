"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ExamSession } from "@/components/test/exam-session";
import { XP_PER_LEVEL, useUserState } from "@/lib/user-state-context";

const TOTAL_STEPS = 7;
const EXAM_END_HOUR = 12;

function requiredLevel(step: number) {
  return step;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const now = new Date();
      const end = new Date();

      end.setHours(EXAM_END_HOUR, 0, 0, 0);
      if (end <= now) end.setDate(end.getDate() + 1);

      const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

const CIRCLE_SIZE = 48;
const STEM_H = 12;
const NODE_W = 52;
const MOBILE_NODE_GAP = "clamp(0.5rem, 1.8vw, 1rem)";
const DESKTOP_NODE_GAP = "clamp(0.75rem, 3vw, 2.75rem)";
const BAR_H = 10;
const SCROLL_CONTENT_W = `calc(${NODE_W * TOTAL_STEPS}px + (${TOTAL_STEPS - 1} * ${MOBILE_NODE_GAP}))`;

function StepNode({
  step,
  userLevel,
  currentStep,
  completedSteps,
}: {
  step: number;
  userLevel: number;
  currentStep: number;
  completedSteps: number[];
}) {
  const completed = completedSteps.includes(step);
  const active = step === currentStep;
  const levelLocked = !completed && !active && userLevel < requiredLevel(step);

  if (completed) {
    return (
      <div className="flex flex-col items-center">
        <div
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          className="flex items-center justify-center rounded-full bg-[#A8D99A] shadow-md"
        >
          <span className="text-base font-bold text-white">완료</span>
        </div>
        <div style={{ height: STEM_H }} />
      </div>
    );
  }

  if (active) {
    return (
      <div className="flex flex-col items-center">
        <motion.div
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          className="flex items-center justify-center rounded-full bg-[#C9A227] shadow-lg"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <span className="text-base font-bold text-white">{step}</span>
        </motion.div>
        <div style={{ height: STEM_H, width: 10 }} className="rounded-b-full bg-[#C9A227]" />
      </div>
    );
  }

  if (levelLocked) {
    return (
      <div className="flex flex-col items-center">
        <div
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
          className="flex flex-col items-center justify-center rounded-full border-2 border-[#7C3AED]/30 bg-[#F3F0FF]"
        >
          <span className="text-[9px] font-bold text-[#7C3AED]">Lv.{requiredLevel(step)}</span>
          <span className="text-[10px] font-bold text-[#7C3AED]/50">필요</span>
        </div>
        <div style={{ height: STEM_H }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        className="flex items-center justify-center rounded-full border-2 border-[#D4EBC5] bg-white"
      >
        <span className="text-sm font-bold text-gray-300">{step}</span>
      </div>
      <div style={{ height: STEM_H }} />
    </div>
  );
}

function StepTrack({
  totalWidth,
  fluid = false,
  userLevel,
  currentStep,
  completedSteps,
}: {
  totalWidth: number | string;
  fluid?: boolean;
  userLevel: number;
  currentStep: number;
  completedSteps: number[];
}) {
  const filledPct = Math.min(
    100,
    Math.max(0, ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100),
  );

  return (
    <div className="relative w-full" style={{ width: totalWidth }}>
      <div
        className={fluid ? "grid w-full grid-cols-7 items-end" : "flex items-end"}
        style={fluid ? undefined : { gap: MOBILE_NODE_GAP }}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className="flex flex-col items-center"
            style={fluid ? undefined : { width: NODE_W, flexShrink: 0 }}
          >
            <StepNode
              step={step}
              userLevel={userLevel}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-full bg-gray-200"
        style={{
          height: BAR_H,
          marginLeft: CIRCLE_SIZE / 2,
          width: `calc(100% - ${CIRCLE_SIZE}px)`,
        }}
      >
        <motion.div
          className="h-full rounded-full bg-[#57B72A]"
          initial={{ width: 0 }}
          animate={{ width: `${filledPct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function MobileStepProgress({
  userLevel,
  currentStep,
  completedSteps,
}: {
  userLevel: number;
  currentStep: number;
  completedSteps: number[];
}) {
  return (
    <div className="mb-3 rounded-2xl border border-dashed border-gray-300 bg-white/70 py-4">
      <p className="mb-3 px-4 text-sm font-bold text-gray-700">시험 진행 단계</p>
      <div
        className="overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" } as never}
      >
        <StepTrack
          totalWidth={SCROLL_CONTENT_W}
          userLevel={userLevel}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
      </div>
    </div>
  );
}

function DesktopStepProgress({
  userLevel,
  currentStep,
  completedSteps,
}: {
  userLevel: number;
  currentStep: number;
  completedSteps: number[];
}) {
  return (
    <div className="mb-4 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-4">
      <p className="mb-3 text-sm font-bold text-gray-700">시험 진행 단계</p>
      <StepTrack
        totalWidth="100%"
        fluid
        userLevel={userLevel}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
          <span className="text-lg">{icon}</span>
        </div>
        <p className="mt-2 text-sm font-bold text-gray-900">{title}</p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function TestContent() {
  const timeLeft = useCountdown();
  const [examStarted, setExamStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { level, xpInLevel, title } = useUserState();

  const xpPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
  const isExamLocked = level < requiredLevel(currentStep);

  function handlePassed() {
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    setExamStarted(false);
  }

  return (
    <AnimatePresence mode="wait">
      {examStarted ? (
        <motion.div
          key="exam"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22 }}
        >
          <ExamSession onBack={() => setExamStarted(false)} onPassed={handlePassed} />
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.22 }}
        >
          <div className="min-h-screen px-4 pt-3 pb-5 md:pt-6 md:pb-5">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] p-4 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-white/20 text-xl font-extrabold">
                    {level}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold opacity-70">현재 레벨</p>
                    <p className="text-lg font-extrabold">Lv.{level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold opacity-70">칭호</p>
                  <p className="text-base font-extrabold">{title}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px] font-bold opacity-70">
                  <span>XP {xpInLevel} / {XP_PER_LEVEL}</span>
                  <span>다음 레벨까지 {XP_PER_LEVEL - xpInLevel} XP</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    className="h-full rounded-full bg-white/80"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <InfoCard icon="⏰" title="오늘 시험">
                <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-[#F0F9E8] md:size-28">
                  <p className="text-base font-extrabold tracking-wide text-[#4A9B2F] md:text-lg">
                    {timeLeft}
                  </p>
                </div>
              </InfoCard>

              <InfoCard icon="🎁" title="시험 보상">
                <div className="mx-auto flex size-24 flex-col items-center justify-center rounded-full bg-[#FFFBE6] md:size-28">
                  <span className="text-xs font-bold text-[#C9A227]">코인 +50</span>
                  <span className="mt-0.5 text-xs font-bold text-[#4A9B2F]">XP +50</span>
                  <span className="mt-0.5 text-xs font-bold text-[#7C3AED]">새 칭호</span>
                </div>
              </InfoCard>
            </div>

            <div className="md:hidden">
              <MobileStepProgress
                userLevel={level}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            <div className="hidden md:block">
              <DesktopStepProgress
                userLevel={level}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            <motion.div
              className="rounded-3xl bg-white p-5 shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#E8F5E0] py-3">
                  <span className="text-4xl font-extrabold text-[#4A9B2F]">{currentStep}</span>
                  <span className="mt-1 text-[10px] font-semibold text-gray-500">시험 단계</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#57B72A]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#3d8a1c]">
                      기초 과정
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">STEP {currentStep}</span>
                  </div>
                  <h2 className="mt-1 text-xl font-extrabold text-gray-900">숫자 시험 {currentStep}</h2>
                  <p className="mt-1 text-sm leading-snug text-gray-500">
                    현재 단계의 한자를 시험으로 확인하고
                    <br />
                    합격하면 다음 스텝으로 이동해요.
                  </p>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-[#D4EBC5] bg-gray-50 py-3">
                <div className="flex flex-col items-center gap-1 px-1">
                  <span className="text-[11px] text-gray-400">보상</span>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-[#C9A227]">코인 +50</span>
                    <span className="text-sm font-bold text-[#4A9B2F]">XP +50</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-1">
                  <span className="text-[11px] text-gray-400">제한 시간</span>
                  <span className="text-sm font-bold text-gray-700">약 5분</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-1">
                  <span className="text-[11px] text-gray-400">문제 수</span>
                  <span className="text-sm font-bold text-gray-700">총 10문제</span>
                </div>
              </div>

              {isExamLocked ? (
                <div className="w-full rounded-2xl bg-[#F3F0FF] py-4 text-center">
                  <p className="text-base font-extrabold text-[#7C3AED]">잠금 · Lv.{requiredLevel(currentStep)} 필요</p>
                  <p className="mt-0.5 text-xs text-[#7C3AED]/70">
                    게임이나 학습으로 XP를 모아 레벨을 올려주세요.
                  </p>
                </div>
              ) : (
                <motion.button
                  type="button"
                  className="w-full rounded-2xl bg-[#4A9B2F] py-4 text-lg font-extrabold text-white shadow-md"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setExamStarted(true)}
                >
                  시험 시작
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
