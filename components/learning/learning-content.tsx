"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import { useLearningType } from "@/lib/learning-type-context";
import { useUserState } from "@/lib/user-state-context";
import { cn } from "@/lib/utils";

const LessonOverlay = dynamic(
  () => import("@/components/lesson/lesson-overlay").then((mod) => mod.LessonOverlay),
  { ssr: false },
);

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
  headerHex: string;
  keywords: string;
  totalChars: number;
  learnedChars: number;
  stages: StageItem[];
  nodeChars: Record<number, string>;
};

type FlatStage = StageItem & {
  chapterNumber: number;
  chapterTitle: string;
  headerHex: string;
  nodeChar: string;
  globalIndex: number;
};

type NodeStatus = "completed" | "current" | "locked";
type LearningProgress = Record<"meaning" | "vocab" | "idioms", number>;

const COMPLETED_NODE_COLOR = "#A8D99A";
const ZIGZAG_OFFSETS = [48, 64, 48, 0, -48, -64, -48, 0];

const MEANING_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "한자의 기본 개념",
    day: 1,
    dayTitle: "한자 입문하기",
    headerHex: "#1B6B3A",
    keywords: "몸풀기로 숫자 한자를 배우고 기본 개념을 익혀요.",
    totalChars: 10,
    learnedChars: 3,
    nodeChars: { 1: "一", 2: "六", 3: "필", 4: "부", 5: "부" },
    stages: [
      { id: 1, label: "1~5", desc: "숫자 1부터 5까지 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "6~10", desc: "숫자 6부터 10까지 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "필순", desc: "한자를 바르게 쓰는 순서를 익혀요", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "부수 1-1", desc: "첫 번째 부수 묶음을 익혀요", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "부수 1-2", desc: "두 번째 부수 묶음을 익혀요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 2,
    title: "가족과 자연 표현하기",
    day: 2,
    dayTitle: "기본 명사 배우기",
    headerHex: "#0F8ECF",
    keywords: "가족과 자연을 나타내는 한자를 익히며 생활 속 낱말을 넓혀요.",
    totalChars: 10,
    learnedChars: 0,
    nodeChars: { 1: "부", 2: "부", 3: "부", 4: "구", 5: "도" },
    stages: [
      { id: 1, label: "부수 1-3", desc: "세 번째 부수 묶음을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "부수 1-4", desc: "네 번째 부수 묶음을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "부수 1-5", desc: "다섯 번째 부수 묶음을 익혀요", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "구성원리", desc: "한자가 만들어지는 원리를 익혀요", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "도전", desc: "기본 명사 한자를 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 3,
    title: "필순",
    day: 3,
    dayTitle: "획 쓰는 순서",
    headerHex: "#0D6657",
    keywords: "한자를 바르게 쓰기 위한 필순의 기본 원칙을 익혀요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "一", 2: "二", 3: "三", 4: "준", 5: "전" },
    stages: [
      { id: 1, label: "원칙", desc: "필순의 기본 원칙을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "가로", desc: "가로획 쓰는 순서를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "세로", desc: "세로획 쓰는 순서를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "꺾기", desc: "꺾는 획 순서를 익혀요", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "도전", desc: "필순을 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 4,
    title: "부수 1-1",
    day: 4,
    dayTitle: "부수 입문",
    headerHex: "#7C3AED",
    keywords: "한자의 뿌리인 부수를 익히며 한자 구조를 이해해요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "人", 2: "木", 3: "水", 4: "火", 5: "전" },
    stages: [
      { id: 1, label: "人부", desc: "사람 인 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "木부", desc: "나무 목 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "水부", desc: "물 수 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "火부", desc: "불 화 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도전", desc: "부수 1-1을 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 5,
    title: "부수 1-2",
    day: 5,
    dayTitle: "부수 기초",
    headerHex: "#B56012",
    keywords: "자주 쓰이는 부수를 계속 익히며 어휘력을 키워요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "土", 2: "金", 3: "山", 4: "日", 5: "전" },
    stages: [
      { id: 1, label: "土부", desc: "흙 토 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "金부", desc: "쇠 금 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "山부", desc: "산 산 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "日부", desc: "날 일 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도전", desc: "부수 1-2를 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 6,
    title: "부수 1-3",
    day: 6,
    dayTitle: "부수 심화",
    headerHex: "#8B1414",
    keywords: "다양한 부수를 익히며 한자 읽기 실력을 높여요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "口", 2: "手", 3: "心", 4: "目", 5: "전" },
    stages: [
      { id: 1, label: "口부", desc: "입 구 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "手부", desc: "손 수 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "心부", desc: "마음 심 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "目부", desc: "눈 목 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도전", desc: "부수 1-3을 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 7,
    title: "부수 1-4",
    day: 7,
    dayTitle: "부수 활용",
    headerHex: "#0F8ECF",
    keywords: "부수를 활용해 새로운 한자를 유추하는 능력을 키워요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "言", 2: "足", 3: "車", 4: "食", 5: "전" },
    stages: [
      { id: 1, label: "言부", desc: "말씀 언 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "足부", desc: "발 족 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "車부", desc: "수레 차 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "食부", desc: "밥 식 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도전", desc: "부수 1-4를 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 8,
    title: "부수 1-5",
    day: 8,
    dayTitle: "부수 완성",
    headerHex: "#5B3FA6",
    keywords: "기초 부수 학습을 마무리하며 핵심 부수를 정리해요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "力", 2: "刀", 3: "弓", 4: "戶", 5: "전" },
    stages: [
      { id: 1, label: "力부", desc: "힘 력 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "刀부", desc: "칼 도 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "弓부", desc: "활 궁 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "戶부", desc: "지게 호 부수를 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도전", desc: "부수 1-5를 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 9,
    title: "구성원리",
    day: 9,
    dayTitle: "한자 만들기",
    headerHex: "#1B6B3A",
    keywords: "상형·지사·회의·형성 등 한자가 만들어지는 원리를 익혀요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "象", 2: "指", 3: "會", 4: "形", 5: "전" },
    stages: [
      { id: 1, label: "상형", desc: "물체 모양을 본뜬 상형자를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "지사", desc: "기호로 뜻을 나타낸 지사자를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "회의", desc: "뜻을 합쳐 만든 회의자를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "형성", desc: "소리와 뜻을 합친 형성자를 배워요", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "도전", desc: "구성원리를 종합해서 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 10,
    title: "도전",
    day: 10,
    dayTitle: "종합 도전",
    headerHex: "#C9A227",
    keywords: "지금까지 배운 모든 내용을 종합해서 실력을 확인해요.",
    totalChars: 0,
    learnedChars: 0,
    nodeChars: { 1: "總", 2: "합", 3: "확", 4: "인", 5: "전" },
    stages: [
      { id: 1, label: "총복습", desc: "전체 내용을 복습해요", reward: { xp: 15, coins: 8 } },
      { id: 2, label: "실전", desc: "실전 문제를 풀어봐요", reward: { xp: 20, coins: 12 } },
      { id: 3, label: "고득점", desc: "어려운 문제에 도전해요", reward: { xp: 25, coins: 15 } },
      { id: 4, label: "마스터", desc: "마스터 레벨에 도전해요", reward: { xp: 30, coins: 20 } },
      { id: 5, label: "완료", desc: "모든 과정을 완료해요", reward: { xp: 50, coins: 30 } },
    ],
  },
];

const VOCAB_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "가족과 친척",
    day: 1,
    dayTitle: "가족 어휘",
    headerHex: "#7C3AED",
    keywords: "부모, 형제, 자매처럼 가족과 친척을 나타내는 한자 어휘를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "父母", 2: "兄弟", 3: "姉妹", 4: "祖父", 5: "親戚" },
    stages: [
      { id: 1, label: "부모", desc: "父母의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "형제", desc: "兄弟의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "자매", desc: "姉妹의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "조부", desc: "祖父의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "친척", desc: "親戚의 글자 풀이와 뜻을 익혀요", reward: { xp: 15, coins: 8 } },
    ],
  },
  {
    number: 2,
    title: "학교와 공부",
    day: 2,
    dayTitle: "학교 어휘",
    headerHex: "#0F8ECF",
    keywords: "학교, 교실, 숙제처럼 공부와 학교생활에 쓰는 한자 어휘를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "學校", 2: "敎室", 3: "宿題", 4: "試驗", 5: "發表" },
    stages: [
      { id: 1, label: "학교", desc: "學校의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "교실", desc: "敎室의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "숙제", desc: "宿題의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "시험", desc: "試驗의 글자 풀이와 뜻을 익혀요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "발표", desc: "發表의 글자 풀이와 뜻을 익혀요", reward: { xp: 15, coins: 8 } },
    ],
  },
  {
    number: 3,
    title: "가족과 친척",
    day: 3,
    dayTitle: "가족 어휘",
    headerHex: "#7C3AED",
    keywords: "부모·형제·자매 등 가족과 친척을 나타내는 한자 단어를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "父母", 2: "兄弟", 3: "姉妹", 4: "祖父", 5: "親戚" },
    stages: [
      { id: 1, label: "부모", desc: "아버지와 어머니, 父母를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "형제", desc: "형과 동생, 兄弟를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "자매", desc: "언니와 여동생, 姉妹를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "조부", desc: "할아버지, 祖父를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "친척", desc: "가족과 혈연으로 이어진 사람들, 親戚을 배워요", reward: { xp: 15, coins: 8 } },
    ],
  },
  {
    number: 4,
    title: "학교와 공부",
    day: 4,
    dayTitle: "학교 어휘",
    headerHex: "#0F8ECF",
    keywords: "학교·교실·숙제 등 학교생활에서 자주 쓰는 한자 단어를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "學校", 2: "敎室", 3: "宿題", 4: "試驗", 5: "發表" },
    stages: [
      { id: 1, label: "학교", desc: "공부하는 곳, 學校를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "교실", desc: "수업하는 방, 敎室을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "숙제", desc: "집에서 하는 공부, 宿題를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "시험", desc: "실력을 확인하는 試驗을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "발표", desc: "여러 사람 앞에서 말하는 發表를 배워요", reward: { xp: 15, coins: 8 } },
    ],
  },
  {
    number: 5,
    title: "장소와 길찾기",
    day: 5,
    dayTitle: "장소 어휘",
    headerHex: "#B56012",
    keywords: "입구·출구·공원 등 장소를 나타내는 한자 단어를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "入口", 2: "出口", 3: "階段", 4: "公園", 5: "圖書" },
    stages: [
      { id: 1, label: "입구", desc: "들어가는 곳, 入口를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "출구", desc: "나가는 곳, 出口를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "계단", desc: "층을 오르내리는 階段을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "공원", desc: "쉬고 노는 公園을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "도서관", desc: "책을 읽는 圖書館을 배워요", reward: { xp: 15, coins: 8 } },
    ],
  },
  {
    number: 6,
    title: "시간과 날짜",
    day: 6,
    dayTitle: "시간 어휘",
    headerHex: "#1B6B3A",
    keywords: "아침·저녁·오늘·내일 등 시간과 날짜를 나타내는 한자 단어를 배워요.",
    totalChars: 5,
    learnedChars: 0,
    nodeChars: { 1: "朝", 2: "夕", 3: "今日", 4: "明日", 5: "週末" },
    stages: [
      { id: 1, label: "아침", desc: "하루가 시작되는 朝를 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "저녁", desc: "하루가 끝나는 夕을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "오늘", desc: "지금 이 날, 今日을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "내일", desc: "다음 날, 明日을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "주말", desc: "한 주의 끝, 週末을 배워요", reward: { xp: 15, coins: 8 } },
    ],
  },
];

const IDIOMS_CHAPTERS: ChapterItem[] = [
  {
    number: 1,
    title: "사자성어 입문",
    day: 1,
    dayTitle: "기초 단계",
    headerHex: "#5B3FA6",
    keywords: "자주 쓰이는 쉬운 사자성어로 뜻과 쓰임을 익혀요.",
    totalChars: 4,
    learnedChars: 1,
    nodeChars: { 1: "일", 2: "백", 3: "십", 4: "언", 5: "복" },
    stages: [
      { id: 1, label: "일석이조", desc: "하나로 두 가지 이득을 얻는 뜻을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 2, label: "백발백중", desc: "매우 뛰어난 실력을 뜻하는 표현을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 3, label: "십중팔구", desc: "거의 틀림없다는 뜻의 표현을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 4, label: "언행일치", desc: "말과 행동이 같다는 뜻의 표현을 배워요", reward: { xp: 10, coins: 5 } },
      { id: 5, label: "복습", desc: "기초 사자성어를 다시 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 2,
    title: "사자성어 중급",
    day: 2,
    dayTitle: "중급 단계",
    headerHex: "#B56012",
    keywords: "조금 더 깊은 뜻을 가진 사자성어로 사고력을 넓혀요.",
    totalChars: 4,
    learnedChars: 0,
    nodeChars: { 1: "각", 2: "오", 3: "와", 4: "호", 5: "복" },
    stages: [
      { id: 1, label: "각주구검", desc: "융통성 없이 고집하는 상황을 배워요", reward: { xp: 15, coins: 8 } },
      { id: 2, label: "오리무중", desc: "방향을 잡지 못하는 상황을 배워요", reward: { xp: 15, coins: 8 } },
      { id: 3, label: "와신상담", desc: "목표를 위해 참고 노력하는 뜻을 배워요", reward: { xp: 15, coins: 8 } },
      { id: 4, label: "호사다마", desc: "좋은 일에 방해가 많다는 뜻을 배워요", reward: { xp: 15, coins: 8 } },
      { id: 5, label: "복습", desc: "중급 사자성어를 다시 확인해요", reward: { xp: 25, coins: 15 } },
    ],
  },
  {
    number: 3,
    title: "사자성어 심화",
    day: 3,
    dayTitle: "심화 단계",
    headerHex: "#8B1414",
    keywords: "이야기와 교훈이 담긴 사자성어로 표현력을 키워요.",
    totalChars: 4,
    learnedChars: 0,
    nodeChars: { 1: "어", 2: "호", 3: "새", 4: "권", 5: "복" },
    stages: [
      { id: 1, label: "어부지리", desc: "제삼자가 이익을 얻는 상황을 배워요", reward: { xp: 20, coins: 12 } },
      { id: 2, label: "호가호위", desc: "남의 힘을 빌려 으스대는 뜻을 배워요", reward: { xp: 20, coins: 12 } },
      { id: 3, label: "새옹지마", desc: "좋고 나쁜 일을 미리 알 수 없다는 뜻을 배워요", reward: { xp: 20, coins: 12 } },
      { id: 4, label: "권토중래", desc: "실패 뒤 다시 일어서는 뜻을 배워요", reward: { xp: 20, coins: 12 } },
      { id: 5, label: "복습", desc: "심화 사자성어를 다시 확인해요", reward: { xp: 30, coins: 20 } },
    ],
  },
];

const CHAPTERS_MAP = {
  meaning: MEANING_CHAPTERS.slice(0, 2),
  vocab: VOCAB_CHAPTERS.slice(0, 2),
  idioms: IDIOMS_CHAPTERS.slice(0, 2),
} as const;

const CATEGORY_LABELS = {
  meaning: "한자 뜻음",
  vocab: "한자 어휘",
  idioms: "사자성어",
} as const;

function flattenStages(chapters: ChapterItem[]): FlatStage[] {
  const result: FlatStage[] = [];
  let globalIndex = 0;

  for (const chapter of chapters) {
    for (const stage of chapter.stages) {
      result.push({
        ...stage,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        headerHex: chapter.headerHex,
        nodeChar: chapter.nodeChars[stage.id] ?? stage.label[0],
        globalIndex,
      });
      globalIndex += 1;
    }
  }

  return result;
}

function getStatus(index: number, currentIndex: number): NodeStatus {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "current";
  return "locked";
}

function RoadNode({
  stage,
  status,
  zigzagX,
  stageNum,
  isSelected,
  useStageNumber,
  onClick,
}: {
  stage: FlatStage;
  status: NodeStatus;
  zigzagX: number;
  stageNum: number;
  isSelected: boolean;
  useStageNumber: boolean;
  onClick: () => void;
}) {
  const isLocked = status === "locked";
  const isCurrent = status === "current";
  const isCompleted = status === "completed";

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ transform: `translateX(${zigzagX}px)` }}
    >
      <button
        type="button"
        onClick={isLocked ? undefined : onClick}
        className={cn(
          "relative flex size-16 items-center justify-center rounded-full text-xl font-extrabold shadow-lg transition-transform",
          isLocked ? "cursor-default bg-gray-200 text-gray-400" : "cursor-pointer text-white active:scale-95",
          isSelected && !isLocked && "ring-4 ring-white ring-offset-2",
          isCurrent && "scale-105",
        )}
        style={{
          backgroundColor: isLocked
            ? undefined
            : isCompleted
              ? COMPLETED_NODE_COLOR
              : stage.headerHex,
        }}
      >
        {isLocked ? (
          <span className={cn("font-extrabold tracking-wide", useStageNumber ? "text-lg" : "text-[10px]")}>
            {useStageNumber ? stageNum : "잠금"}
          </span>
        ) : isCompleted ? (
          <span className={cn("font-extrabold tracking-wide", useStageNumber ? "text-lg" : "text-[10px]")}>
            {useStageNumber ? stageNum : "완료"}
          </span>
        ) : (
          <span className="text-lg leading-none">{useStageNumber ? stageNum : stage.nodeChar}</span>
        )}
      </button>

      <p className={cn("mt-2 text-center text-xs font-bold", isLocked ? "text-gray-400" : "text-gray-700")}>
        {useStageNumber ? stage.label : `${stageNum}. ${stage.label}`}
      </p>
    </div>
  );
}

function RoadMap({
  stages,
  currentIndex,
  selectedIndex,
  onSelect,
  onStartStage,
  useStageNumber,
  compact = false,
}: {
  stages: FlatStage[];
  currentIndex: number;
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
  onStartStage: (stage: FlatStage) => void;
  useStageNumber: boolean;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative flex flex-col items-center", compact ? "gap-8 px-4 py-6" : "gap-10 px-8 py-10")}>
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-0 -translate-x-1/2 border-l-2 border-dashed border-[#D4EBC5]"
        style={{ height: "100%" }}
      />

      {stages.map((stage, index) => (
        <RoadNode
          key={`${stage.chapterNumber}-${stage.id}`}
          stage={stage}
          status={getStatus(index, currentIndex)}
          zigzagX={ZIGZAG_OFFSETS[index % ZIGZAG_OFFSETS.length]}
          stageNum={index + 1}
          isSelected={selectedIndex === index}
          useStageNumber={useStageNumber}
          onClick={() => {
            onSelect(index);
            onStartStage(stage);
          }}
        />
      ))}
    </div>
  );
}

function LeftPanel({
  chapter,
  learnedCount,
  selectedStage,
  onStart,
  tickets,
  coins,
}: {
  chapter: ChapterItem;
  learnedCount: number;
  selectedStage: FlatStage | null;
  onStart: () => void;
  tickets: number;
  coins: number;
}) {
  const progressPct = chapter.totalChars > 0 ? Math.round((learnedCount / chapter.totalChars) * 100) : 0;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-4">
      <div className="shrink-0 rounded-3xl p-5 text-white shadow-lg" style={{ backgroundColor: chapter.headerHex }}>
        <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">CHAPTER {chapter.day}</p>
        <h2 className="mt-1 text-xl font-extrabold leading-snug">{chapter.title}</h2>
        <p className="mt-1 text-xs font-bold opacity-80">{chapter.dayTitle}</p>
        <p className="mt-3 text-xs leading-relaxed opacity-80">{chapter.keywords}</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white/80 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="shrink-0 text-xs font-bold opacity-70">{progressPct}%</span>
        </div>
        <p className="mt-1 text-[11px] opacity-60">
          {learnedCount} / {chapter.totalChars}개 학습
        </p>
      </div>

      {selectedStage ? (
        <div className="shrink-0 rounded-3xl border border-[#D4EBC5] bg-white p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-extrabold text-[#4A9B2F]">
            <span className="inline-block size-1.5 rounded-full bg-[#57B72A]" />
            이어서 학습하기
          </p>

          <div className="flex items-start gap-3">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow"
              style={{ backgroundColor: selectedStage.headerHex }}
            >
              {selectedStage.nodeChar}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base font-extrabold text-gray-900">
                {selectedStage.globalIndex + 1}. {selectedStage.label}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-500">{selectedStage.desc}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#E8F5E0] px-2.5 py-1 text-[11px] font-bold text-[#4A9B2F]">5문제</span>
            <span className="rounded-full bg-[#E8F5E0] px-2.5 py-1 text-[11px] font-bold text-[#4A9B2F]">약 5분</span>
            <span className="rounded-full bg-[#FFFBE6] px-2.5 py-1 text-[11px] font-bold text-[#C9A227]">기초</span>
          </div>

          <div className="mt-2 flex gap-2">
            <span className="text-xs font-bold text-[#7C3AED]">티켓 보상 +1</span>
            <span className="text-xs font-bold text-[#C9A227]">코인 +15</span>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-4 w-full rounded-2xl bg-[#4A9B2F] py-3 text-sm font-extrabold text-white shadow transition-transform active:scale-[0.98]"
          >
            학습 시작하기
          </button>
        </div>
      ) : (
        <div className="shrink-0 rounded-3xl border border-dashed border-[#D4EBC5] p-5 text-center text-sm text-[#4A9B2F]/60">
          로드맵에서 스테이지를 선택해 주세요.
        </div>
      )}

      <div className="shrink-0 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#F3F0FF] p-4 text-center">
          <p className="text-xs font-bold text-gray-500">보유 티켓</p>
          <p className="mt-2 text-2xl font-extrabold text-[#7C3AED]">티켓 {tickets}</p>
        </div>
        <div className="rounded-2xl bg-[#FFFBE6] p-4 text-center">
          <p className="text-xs font-bold text-gray-500">보유 코인</p>
          <p className="mt-2 text-2xl font-extrabold text-[#C9A227]">코인 {coins}</p>
        </div>
      </div>

    </div>
  );
}

export function LearningContent() {
  const { learningType } = useLearningType();
  const { tickets, coins, addTickets, addCoins } = useUserState();
  const chapters = CHAPTERS_MAP[learningType];
  const rewardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mobileSelected, setMobileSelected] = useState<FlatStage | null>(null);
  const [lessonKey, setLessonKey] = useState<string | null>(null);
  const [progressByType, setProgressByType] = useState<LearningProgress>({
    meaning: 0,
    vocab: 0,
    idioms: 0,
  });
  const [learnedCountByType, setLearnedCountByType] = useState<LearningProgress>({
    meaning: 0,
    vocab: 0,
    idioms: 0,
  });
  const [tabletSelectedIndex, setTabletSelectedIndex] = useState<number | null>(0);
  const [showReward, setShowReward] = useState(false);

  const flatStages = useMemo(() => flattenStages(chapters), [chapters]);
  const useStageNumber = learningType === "meaning";
  const currentFlatIndex = progressByType[learningType];
  const learnedCount = learnedCountByType[learningType];
  const tabletSelected = useMemo(
    () => (tabletSelectedIndex !== null ? flatStages[tabletSelectedIndex] ?? null : null),
    [flatStages, tabletSelectedIndex],
  );
  const activeChapter = chapters[0];
  const tabletChapter = useMemo(
    () =>
      tabletSelected
        ? chapters.find((chapter) => chapter.number === tabletSelected.chapterNumber) ?? chapters[0]
        : chapters[0],
    [chapters, tabletSelected],
  );
  const activeProgressPct = activeChapter.totalChars > 0 ? Math.round((Math.min(learnedCount, activeChapter.totalChars) / activeChapter.totalChars) * 100) : 0;

  function getChapterLearnedCount(chapter: ChapterItem) {
    const chapterIndex = chapters.findIndex((item) => item.number === chapter.number);
    if (chapterIndex < 0) return 0;

    const chapterStart = chapters
      .slice(0, chapterIndex)
      .reduce((sum, item) => sum + item.stages.length, 0);

    return Math.max(0, Math.min(learnedCount - chapterStart, chapter.stages.length));
  }

  const tabletChapterLearnedCount = getChapterLearnedCount(tabletChapter);

  function buildLessonKey(stage: FlatStage) {
    return `${learningType}_${stage.chapterNumber}_${stage.id}`;
  }

  useEffect(() => {
    setMobileSelected(null);
    setTabletSelectedIndex(progressByType[learningType]);
  }, [learningType, progressByType]);

  useEffect(() => {
    return () => {
      if (rewardTimerRef.current) {
        clearTimeout(rewardTimerRef.current);
      }
    };
  }, []);

  function handleLessonComplete() {
    const nextIndex = Math.min(currentFlatIndex + 1, Math.max(flatStages.length - 1, 0));

    addTickets(1);
    addCoins(15);
    setShowReward(true);
    setProgressByType((prev) => ({ ...prev, [learningType]: nextIndex }));
    setLearnedCountByType((prev) => ({
      ...prev,
      [learningType]: Math.min(prev[learningType] + 1, flatStages.length),
    }));
    setTabletSelectedIndex(nextIndex);

    if (rewardTimerRef.current) {
      clearTimeout(rewardTimerRef.current);
    }

    rewardTimerRef.current = setTimeout(() => {
      setShowReward(false);
      rewardTimerRef.current = null;
    }, 2200);
  }

  function startLesson(key: string) {
    setMobileSelected(null);
    setLessonKey(key);
  }

  return (
    <>
      <div className="md:hidden">
        <div className="pb-8 pt-2">
          <div className="mx-4 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex h-20 items-end justify-between overflow-hidden bg-[#F0F9E8] px-6 pb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#4A9B2F]/50">
                  {CATEGORY_LABELS[learningType]}
                </p>
                <p className="mt-1 text-sm font-bold text-[#4A9B2F]/70">Ch.{activeChapter.day}</p>
              </div>
              <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#4A9B2F]">
                {activeChapter.dayTitle}
              </div>
            </div>

            <div className="p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Chapter {activeChapter.number}</p>
              <h2 className="mt-0.5 text-lg font-extrabold text-gray-900">{activeChapter.title}</h2>
              <p className="mt-1 text-xs text-gray-500">{activeChapter.keywords}</p>

              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-[#D4EBC5]">
                  <div
                    className="h-full rounded-full bg-[#57B72A] transition-all duration-300"
                    style={{ width: `${activeProgressPct}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>
                    {learnedCount} / {activeChapter.totalChars}개 학습
                  </span>
                  <span>{activeProgressPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {flatStages[currentFlatIndex] && (() => {
            const stage = flatStages[currentFlatIndex];

            return (
              <div className="mx-4 mt-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-[#4A9B2F]">
                  <span className="inline-block size-1.5 rounded-full bg-[#57B72A]" />
                  이어서 학습하기
                </p>

                <div className="flex gap-3">
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white shadow"
                    style={{ backgroundColor: stage.headerHex }}
                  >
                    {stage.nodeChar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-gray-900">
                      {stage.globalIndex + 1}. {stage.label}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{stage.desc}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">약 5분</span>
                  <span className="flex items-center gap-1">쓰기</span>
                  <span className="flex items-center gap-1">퀴즈</span>
                </div>

                <button
                  type="button"
                  onClick={() => startLesson(buildLessonKey(stage))}
                  className="mt-3 w-full rounded-2xl bg-[#4A9B2F] py-3 text-sm font-extrabold text-white shadow transition-transform active:scale-[0.98]"
                >
                  학습 시작하기
                </button>
              </div>
            );
          })()}

          <h3 className="mx-4 mt-6 text-base font-extrabold text-gray-900">학습 경로</h3>
          <div className="relative mx-2 mt-2 min-h-[980px] overflow-hidden rounded-[28px] bg-[#EDF7E6]">
            <div className="pb-[220px]">
              <RoadMap
                stages={flatStages}
                currentIndex={currentFlatIndex}
                selectedIndex={tabletSelectedIndex}
                onSelect={setTabletSelectedIndex}
                onStartStage={(stage) => startLesson(buildLessonKey(stage))}
                useStageNumber={useStageNumber}
                compact
              />
            </div>

            <div className="absolute bottom-4 left-4 flex w-[132px] flex-col gap-2.5">
              <div className="rounded-2xl bg-[#F3F0FF] px-4 py-3 text-left shadow-sm">
                <p className="text-xs font-bold text-gray-500">보유 티켓</p>
                <p className="mt-1.5 text-[2rem] leading-none font-extrabold text-[#7C3AED]">{tickets}</p>
              </div>
              <div className="rounded-2xl bg-[#FFFBE6] px-4 py-3 text-left shadow-sm">
                <p className="text-xs font-bold text-gray-500">보유 코인</p>
                <p className="mt-1.5 text-[2rem] leading-none font-extrabold text-[#C9A227]">{coins}</p>
              </div>
            </div>
          </div>
        </div>

        {mobileSelected && (
          <>
            <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMobileSelected(null)} />

            <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white px-5 pb-10 pt-3 shadow-2xl">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

              <button
                type="button"
                onClick={() => setMobileSelected(null)}
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-500"
                aria-label="닫기"
              >
                ×
              </button>

              <div className="flex flex-col items-center text-center">
                <div
                  className="flex size-16 items-center justify-center rounded-full text-3xl font-extrabold text-white shadow-md"
                  style={{ backgroundColor: mobileSelected.headerHex }}
                >
                  {mobileSelected.nodeChar}
                </div>
                <h3 className="mt-3 text-xl font-extrabold text-gray-900">
                  {mobileSelected.globalIndex + 1}. {mobileSelected.label}
                </h3>
                <p className="mt-1 px-2 text-sm text-gray-500">{mobileSelected.desc}</p>
              </div>

              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl bg-[#F4FAF0] px-4 py-3">
                  <span className="text-sm font-bold text-gray-700">보상</span>
                  <div className="flex gap-3 text-sm font-bold text-gray-700">
                    <span className="text-[#7C3AED]">티켓 보상 +1</span>
                    <span className="text-[#C9A227]">코인 +15</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F4FAF0] px-4 py-3">
                  <span className="text-sm font-bold text-gray-700">예상 시간</span>
                  <span className="text-sm font-bold text-gray-700">5분</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F4FAF0] px-4 py-3">
                  <span className="text-sm font-bold text-gray-700">학습 방법</span>
                  <span className="text-sm font-bold text-gray-700">쓰기, 퀴즈</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  startLesson(buildLessonKey(mobileSelected));
                }}
                className="mt-5 w-full rounded-2xl bg-[#4A9B2F] py-4 text-base font-extrabold text-white transition-transform active:scale-[0.98]"
              >
                학습 시작하기
              </button>
            </div>
          </>
        )}
      </div>

      <div className="hidden md:flex" style={{ height: "calc(100dvh - 80px)" }}>
        <aside className="w-72 shrink-0 overflow-hidden border-r border-[#D4EBC5] bg-[#F4FAF0]">
          <LeftPanel
            chapter={tabletChapter}
            learnedCount={tabletChapterLearnedCount}
            selectedStage={tabletSelected}
            onStart={() => {
              if (tabletSelected) {
                startLesson(buildLessonKey(tabletSelected));
              }
            }}
            tickets={tickets}
            coins={coins}
          />
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#EDF7E6]">
          <div className="sticky top-0 z-10 bg-[#EDF7E6]/90 px-6 py-3 backdrop-blur">
            <p className="text-xs font-bold text-[#4A9B2F]">
              다음 단계까지 남은 스테이지 {Math.max(flatStages.length - currentFlatIndex - 1, 0)}개
            </p>
          </div>

          <RoadMap
            stages={flatStages}
            currentIndex={currentFlatIndex}
            selectedIndex={tabletSelectedIndex}
            onSelect={setTabletSelectedIndex}
            onStartStage={(stage) => startLesson(buildLessonKey(stage))}
            useStageNumber={useStageNumber}
          />
        </main>
      </div>

      {lessonKey && (
        <LessonOverlay
          key={lessonKey}
          lessonKey={lessonKey}
          onClose={() => setLessonKey(null)}
          onComplete={handleLessonComplete}
        />
      )}

      {showReward && (
        <div className="fixed bottom-32 left-1/2 z-50 -translate-x-1/2 rounded-3xl bg-white px-6 py-4 shadow-2xl">
          <p className="mb-3 text-center text-base font-extrabold text-gray-900">학습 완료</p>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-[#7C3AED]">티켓 +1</span>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-[#C9A227]">코인 +15</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
