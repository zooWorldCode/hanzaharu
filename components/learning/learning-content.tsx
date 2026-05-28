"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useLearningType } from "@/lib/learning-type-context";
import { LessonOverlay } from "@/components/lesson/lesson-overlay";
import styles from "./learning-content.module.css";

const HEADER_HEIGHT = 130;
const FIXED_HEADER_TOP = 106;

/* ── 챕터 데이터 타입 ──────────────────────────────────── */

type StageItem = {
  id: number;
  label: string;
  desc: string;
  reward: { xp: number; coins: number };
};

type ChapterItem = {
  number: number;
  title: string;
  day: number;
  dayTitle: string;
  headerClassName: string;
  labelClassName: string;
  subLabelClassName: string;
  borderClassName: string;
  stages: StageItem[];
};

/* ── 한자 뜻음 ─────────────────────────────────────────── */

const MEANING_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "기초를 위한 숫자 익히기",
    day: 1,
    dayTitle: "숫자 배우기",
    headerClassName: "bg-[#8B1414]",
    labelClassName: "text-red-200/70",
    subLabelClassName: "text-red-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "1-5", desc: "숫자 1부터 5까지 익히기", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "6-10", desc: "숫자 6부터 10까지 익히기", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "복습", desc: "숫자 복습 퀴즈", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "읽기", desc: "숫자 읽기 연습", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "도전", desc: "숫자 종합 도전", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 2,
    title: "주변 사물 표현하기",
    day: 2,
    dayTitle: "기본 명사 배우기",
    headerClassName: "bg-[#0F8ECF]",
    labelClassName: "text-sky-100/80",
    subLabelClassName: "text-sky-50",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "가족", desc: "가족 관련 단어 배우기", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "장소", desc: "장소 관련 단어 배우기", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "동물", desc: "동물 관련 단어 배우기", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "사물", desc: "사물 관련 단어 배우기", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "도전", desc: "명사 종합 도전", reward: { xp: 25, coins: 15 } },
    ],
  },
];

/* ── 한자 어휘 ─────────────────────────────────────────── */

const VOCAB_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "요일 한자 배우기",
    day: 1,
    dayTitle: "요일",
    headerClassName: "bg-[#1B6B3A]",
    labelClassName: "text-green-200/70",
    subLabelClassName: "text-green-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "月", desc: "月 — 달 월, 월요일", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "火", desc: "火 — 불 화, 화요일", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "水", desc: "水 — 물 수, 수요일", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "木", desc: "木 — 나무 목, 목요일", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "복습", desc: "요일 한자 종합 복습", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 2,
    title: "가족 한자 배우기",
    day: 2,
    dayTitle: "가족",
    headerClassName: "bg-[#0D6657]",
    labelClassName: "text-teal-200/70",
    subLabelClassName: "text-teal-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "父", desc: "父 — 아버지 부", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "母", desc: "母 — 어머니 모", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "兄", desc: "兄 — 형 형", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "弟", desc: "弟 — 아우 제", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "복습", desc: "가족 한자 종합 복습", reward: { xp: 25, coins: 15 } },
    ],
  },
];

/* ── 사자성어 ──────────────────────────────────────────── */

const IDIOMS_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "사자성어 — 하",
    day: 1,
    dayTitle: "하 단계",
    headerClassName: "bg-[#5B3FA6]",
    labelClassName: "text-purple-200/70",
    subLabelClassName: "text-purple-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "일석이조", desc: "一石二鳥 — 돌 하나로 새 두 마리", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "백발백중", desc: "百發百中 — 백 번 쏘아 백 번 맞힘", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "십중팔구", desc: "十中八九 — 열에 여덟아홉은 그러함", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "언행일치", desc: "言行一致 — 말과 행동이 일치함", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "복습", desc: "하 단계 사자성어 종합 복습", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 2,
    title: "사자성어 — 중",
    day: 2,
    dayTitle: "중 단계",
    headerClassName: "bg-[#B56012]",
    labelClassName: "text-amber-200/70",
    subLabelClassName: "text-amber-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "각주구검", desc: "刻舟求劍 — 융통성 없이 어리석음", reward: { xp: 15, coins: 8 } },
      { id: 2, label: "오리무중", desc: "五里霧中 — 방향을 잡지 못함", reward: { xp: 15, coins: 8 } },
      { id: 3, label: "와신상담", desc: "臥薪嘗膽 — 복수를 위해 고통을 참음", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "호사다마", desc: "好事多魔 — 좋은 일엔 방해가 많음", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "복습", desc: "중 단계 사자성어 종합 복습", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 3,
    title: "사자성어 — 상",
    day: 3,
    dayTitle: "상 단계",
    headerClassName: "bg-[#8B1414]",
    labelClassName: "text-red-200/70",
    subLabelClassName: "text-red-100",
    borderClassName: "border-white/20",
    stages: [
      { id: 1, label: "어부지리", desc: "漁父之利 — 제삼자가 이익을 챙김", reward: { xp: 20, coins: 12 } },
      { id: 2, label: "호가호위", desc: "狐假虎威 — 남의 권세를 빌려 위세 부림", reward: { xp: 20, coins: 12 } },
      { id: 3, label: "새옹지마", desc: "塞翁之馬 — 길흉화복은 예측 불가", reward: { xp: 20, coins: 12 } },
      { id: 4, label: "권토중래", desc: "捲土重來 — 실패 후 다시 일어남", reward: { xp: 20, coins: 12 } },
      { id: 5, label: "복습", desc: "상 단계 사자성어 종합 복습", reward: { xp: 30, coins: 20 } },
    ],
  },
];

const CHAPTERS_MAP = {
  meaning: MEANING_CHAPTERS,
  vocab: VOCAB_CHAPTERS,
  idioms: IDIOMS_CHAPTERS,
} as const;

/* ── 컴포넌트 ──────────────────────────────────────────── */

type SelectedStage = StageItem & { chapterNumber: number };

export function LearningContent() {
  const { learningType } = useLearningType();
  const chapters = CHAPTERS_MAP[learningType];

  const [selected, setSelected] = useState<SelectedStage | null>(null);
  const [lessonKey, setLessonKey] = useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  // 학습 타입이 바뀌면 상태 초기화
  useEffect(() => {
    chapterRefs.current = [];
    setActiveChapterIndex(0);
    setSelected(null);
  }, [learningType]);

  useEffect(() => {
    const handleScroll = () => {
      let next = 0;
      chapterRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= window.innerHeight / 2) next = i;
      });
      setActiveChapterIndex((cur) => (cur === next ? cur : next));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [learningType]);

  const activeChapter = chapters[activeChapterIndex] ?? chapters[0];

  return (
    <>
      {/* Clip overlay behind fixed header */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 bg-gray-50"
        style={{ height: FIXED_HEADER_TOP + HEADER_HEIGHT + 12 }}
        aria-hidden
      />

      {/* Fixed chapter header */}
      <div
        className="fixed left-1/2 z-30 w-full max-w-[1280px] -translate-x-1/2 px-6"
        style={{ top: FIXED_HEADER_TOP }}
      >
        <div
          className={`rounded-3xl px-6 py-5 shadow-lg ${activeChapter.headerClassName}`}
          style={{ minHeight: HEADER_HEIGHT }}
        >
          <p className={`text-xs font-bold uppercase tracking-widest ${activeChapter.labelClassName}`}>
            Chapter {activeChapter.number}
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-white">{activeChapter.title}</h2>
          <div className={`mt-3 border-t pt-3 ${activeChapter.borderClassName}`}>
            <p className={`text-sm font-semibold ${activeChapter.subLabelClassName}`}>
              Day {activeChapter.day} · {activeChapter.dayTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Stage map */}
      <div className={`mx-auto max-w-[1280px] px-6 ${styles.contentWrap}`}>
        {chapters.map((chapter, chapterIndex) => (
          <section
            key={`${learningType}-${chapter.number}`}
            ref={(el) => {
              chapterRefs.current[chapterIndex] = el;
            }}
            className={styles.chapter}
          >
            {chapter.stages.map((stage) => (
              <div key={stage.id} className={styles.stageSlot}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelected({ ...stage, chapterNumber: chapter.number })}
                  className={styles.stageButton}
                  aria-label={`${chapter.title} ${stage.label} 시작`}
                >
                  <span className={styles.stageShadow} />
                  <span className={styles.stageEdge} />
                  <span className={styles.stageFront} />
                  <span className={styles.stageInnerGlow} />
                  <span className={styles.stageContent}>
                    <span className={styles.stageIndex}>STAGE {stage.id}</span>
                    <span className={styles.stageLabel}>{stage.label}</span>
                  </span>
                </motion.button>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Stage info panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/10"
              onClick={() => setSelected(null)}
            />

            <div className="pointer-events-none fixed inset-x-0 bottom-[120px] z-50">
              <div className="mx-auto max-w-[1280px] px-6">
                <motion.div
                  key="panel"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 380 }}
                  className="pointer-events-auto rounded-[28px] border border-[#d6efc8] bg-white p-4 shadow-2xl shadow-[#7bc742]/15"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-gray-900">
                        Chapter {selected.chapterNumber} · Stage {selected.id}
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-[#288b1b]">{selected.label}</p>
                      <p className="mt-1 truncate text-xs text-gray-500">{selected.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      aria-label="닫기"
                      className="shrink-0 text-base leading-none text-gray-300 active:text-gray-500"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-4 flex gap-2">
                    <span className="rounded-full bg-[#f2fbeb] px-3 py-1.5 text-xs font-bold text-[#288b1b] ring-1 ring-[#cfe8bf]">
                      +{selected.reward.xp} XP
                    </span>
                    <span className="rounded-full bg-[#fff6df] px-3 py-1.5 text-xs font-bold text-[#b87917] ring-1 ring-[#f4dfa8]">
                      +{selected.reward.coins} 코인
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-2xl bg-[#57B72A] py-3 text-sm font-extrabold text-white shadow-sm shadow-[#57B72A]/30 transition-transform active:scale-[0.98]"
                    onClick={() => {
                      const key = `${learningType}_${selected.chapterNumber}_${selected.id}`;
                      setSelected(null);
                      setLessonKey(key);
                    }}
                  >
                    시작하기
                  </button>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Lesson overlay */}
      <AnimatePresence>
        {lessonKey && (
          <LessonOverlay
            key={lessonKey}
            lessonKey={lessonKey}
            onClose={() => setLessonKey(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
