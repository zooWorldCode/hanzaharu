export type CharData = {
  char: string;      // "一" or "일석이조"
  reading: string;   // "일" or "一石二鳥"
  meaning: string;   // "하나" or "돌 하나로 새 두 마리"
  radical: string;   // "一"
  strokes: number;   // 1  (0 for idioms)
  emoji: string;     // "1️⃣"
  desc: string;      // short beginner description
};

export type LessonMode = "learn-trace-quiz" | "learn-quiz" | "quiz-only";

export type LessonEntry = {
  mode: LessonMode;
  chars: CharData[];
};

/* ── distractor pool for quiz wrong answers ───────────── */
export const DISTRACTOR_POOL: CharData[] = [
  { char: "人", reading: "인", meaning: "사람", radical: "人", strokes: 2, emoji: "🧑", desc: "" },
  { char: "山", reading: "산", meaning: "산", radical: "山", strokes: 3, emoji: "⛰️", desc: "" },
  { char: "日", reading: "일", meaning: "해", radical: "日", strokes: 4, emoji: "☀️", desc: "" },
  { char: "金", reading: "금", meaning: "금/쇠", radical: "金", strokes: 8, emoji: "🥇", desc: "" },
  { char: "土", reading: "토", meaning: "흙", radical: "土", strokes: 3, emoji: "🪨", desc: "" },
  { char: "年", reading: "년", meaning: "해/년", radical: "干", strokes: 6, emoji: "📅", desc: "" },
  { char: "大", reading: "대", meaning: "큰", radical: "大", strokes: 3, emoji: "🔠", desc: "" },
  { char: "小", reading: "소", meaning: "작은", radical: "小", strokes: 3, emoji: "🔡", desc: "" },
];

const IDIOM_DISTRACTOR_POOL: CharData[] = [
  { char: "마이동풍", reading: "馬耳東風", meaning: "남의 말을 듣지 않음", radical: "-", strokes: 0, emoji: "🌬️", desc: "" },
  { char: "청출어람", reading: "靑出於藍", meaning: "제자가 스승을 능가함", radical: "-", strokes: 0, emoji: "🎓", desc: "" },
  { char: "과유불급", reading: "過猶不及", meaning: "지나침은 미치지 못함과 같음", radical: "-", strokes: 0, emoji: "⚖️", desc: "" },
  { char: "우공이산", reading: "愚公移山", meaning: "끈기 있게 노력하면 이룸", radical: "-", strokes: 0, emoji: "🏔️", desc: "" },
];

/* ── lesson entries ────────────────────────────────────── */

const LESSONS: Record<string, LessonEntry> = {

  /* ── 한자 뜻음 Ch1 ─────────────────────────────────── */

  "meaning_1_1": {
    mode: "learn-trace-quiz",
    chars: [
      { char: "一", reading: "일", meaning: "하나", radical: "一", strokes: 1, emoji: "1️⃣", desc: "숫자 1을 나타내는 한자예요" },
      { char: "二", reading: "이", meaning: "둘", radical: "二", strokes: 2, emoji: "2️⃣", desc: "숫자 2를 나타내는 한자예요" },
      { char: "三", reading: "삼", meaning: "셋", radical: "一", strokes: 3, emoji: "3️⃣", desc: "숫자 3을 나타내는 한자예요" },
      { char: "四", reading: "사", meaning: "넷", radical: "囗", strokes: 5, emoji: "4️⃣", desc: "숫자 4를 나타내는 한자예요" },
      { char: "五", reading: "오", meaning: "다섯", radical: "二", strokes: 4, emoji: "5️⃣", desc: "숫자 5를 나타내는 한자예요" },
    ],
  },

  "meaning_1_2": {
    mode: "learn-trace-quiz",
    chars: [
      { char: "六", reading: "육", meaning: "여섯", radical: "八", strokes: 4, emoji: "6️⃣", desc: "숫자 6을 나타내는 한자예요" },
      { char: "七", reading: "칠", meaning: "일곱", radical: "一", strokes: 2, emoji: "7️⃣", desc: "숫자 7을 나타내는 한자예요" },
      { char: "八", reading: "팔", meaning: "여덟", radical: "八", strokes: 2, emoji: "8️⃣", desc: "숫자 8을 나타내는 한자예요" },
      { char: "九", reading: "구", meaning: "아홉", radical: "乙", strokes: 2, emoji: "9️⃣", desc: "숫자 9를 나타내는 한자예요" },
      { char: "十", reading: "십", meaning: "열", radical: "十", strokes: 2, emoji: "🔟", desc: "숫자 10을 나타내는 한자예요" },
    ],
  },

  "meaning_1_3": {
    mode: "quiz-only",
    chars: [
      { char: "一", reading: "일", meaning: "하나", radical: "一", strokes: 1, emoji: "1️⃣", desc: "" },
      { char: "二", reading: "이", meaning: "둘", radical: "二", strokes: 2, emoji: "2️⃣", desc: "" },
      { char: "三", reading: "삼", meaning: "셋", radical: "一", strokes: 3, emoji: "3️⃣", desc: "" },
      { char: "四", reading: "사", meaning: "넷", radical: "囗", strokes: 5, emoji: "4️⃣", desc: "" },
      { char: "五", reading: "오", meaning: "다섯", radical: "二", strokes: 4, emoji: "5️⃣", desc: "" },
      { char: "六", reading: "육", meaning: "여섯", radical: "八", strokes: 4, emoji: "6️⃣", desc: "" },
      { char: "七", reading: "칠", meaning: "일곱", radical: "一", strokes: 2, emoji: "7️⃣", desc: "" },
      { char: "八", reading: "팔", meaning: "여덟", radical: "八", strokes: 2, emoji: "8️⃣", desc: "" },
      { char: "九", reading: "구", meaning: "아홉", radical: "乙", strokes: 2, emoji: "9️⃣", desc: "" },
      { char: "十", reading: "십", meaning: "열", radical: "十", strokes: 2, emoji: "🔟", desc: "" },
    ],
  },

  "meaning_1_4": { mode: "quiz-only", chars: [] }, // same as 복습
  "meaning_1_5": { mode: "quiz-only", chars: [] }, // 도전

  /* ── 한자 뜻음 Ch2 ─────────────────────────────────── */

  "meaning_2_1": {
    mode: "learn-trace-quiz",
    chars: [
      { char: "父", reading: "부", meaning: "아버지", radical: "父", strokes: 4, emoji: "👨", desc: "아버지를 뜻하는 한자예요" },
      { char: "母", reading: "모", meaning: "어머니", radical: "母", strokes: 5, emoji: "👩", desc: "어머니를 뜻하는 한자예요" },
      { char: "兄", reading: "형", meaning: "형/오빠", radical: "儿", strokes: 5, emoji: "👦", desc: "형이나 오빠를 뜻하는 한자예요" },
      { char: "弟", reading: "제", meaning: "동생", radical: "弓", strokes: 7, emoji: "👶", desc: "남동생을 뜻하는 한자예요" },
      { char: "子", reading: "자", meaning: "아이", radical: "子", strokes: 3, emoji: "🧒", desc: "아이를 뜻하는 한자예요" },
    ],
  },
  "meaning_2_2": {
    mode: "learn-trace-quiz",
    chars: [
      { char: "山", reading: "산", meaning: "산", radical: "山", strokes: 3, emoji: "⛰️", desc: "산을 뜻하는 한자예요" },
      { char: "川", reading: "천", meaning: "내/강", radical: "川", strokes: 3, emoji: "🌊", desc: "강이나 내를 뜻하는 한자예요" },
      { char: "日", reading: "일", meaning: "해/날", radical: "日", strokes: 4, emoji: "☀️", desc: "해와 날을 뜻하는 한자예요" },
      { char: "月", reading: "월", meaning: "달", radical: "月", strokes: 4, emoji: "🌙", desc: "달을 뜻하는 한자예요" },
      { char: "年", reading: "년", meaning: "해/년", radical: "干", strokes: 6, emoji: "📅", desc: "한 해를 뜻하는 한자예요" },
    ],
  },
  "meaning_2_3": { mode: "quiz-only", chars: [] },
  "meaning_2_4": { mode: "quiz-only", chars: [] },
  "meaning_2_5": { mode: "quiz-only", chars: [] },

  /* ── 한자 어휘 Ch1 (요일) ──────────────────────────── */

  "vocab_1_1": {
    mode: "learn-trace-quiz",
    chars: [{ char: "月", reading: "월", meaning: "달", radical: "月", strokes: 4, emoji: "🌙", desc: "달을 뜻해요. 월요일에 쓰여요" }],
  },
  "vocab_1_2": {
    mode: "learn-trace-quiz",
    chars: [{ char: "火", reading: "화", meaning: "불", radical: "火", strokes: 4, emoji: "🔥", desc: "불을 뜻해요. 화요일에 쓰여요" }],
  },
  "vocab_1_3": {
    mode: "learn-trace-quiz",
    chars: [{ char: "水", reading: "수", meaning: "물", radical: "水", strokes: 4, emoji: "💧", desc: "물을 뜻해요. 수요일에 쓰여요" }],
  },
  "vocab_1_4": {
    mode: "learn-trace-quiz",
    chars: [{ char: "木", reading: "목", meaning: "나무", radical: "木", strokes: 4, emoji: "🌳", desc: "나무를 뜻해요. 목요일에 쓰여요" }],
  },
  "vocab_1_5": {
    mode: "quiz-only",
    chars: [
      { char: "月", reading: "월", meaning: "달", radical: "月", strokes: 4, emoji: "🌙", desc: "" },
      { char: "火", reading: "화", meaning: "불", radical: "火", strokes: 4, emoji: "🔥", desc: "" },
      { char: "水", reading: "수", meaning: "물", radical: "水", strokes: 4, emoji: "💧", desc: "" },
      { char: "木", reading: "목", meaning: "나무", radical: "木", strokes: 4, emoji: "🌳", desc: "" },
    ],
  },

  /* ── 한자 어휘 Ch2 (가족) ──────────────────────────── */

  "vocab_2_1": {
    mode: "learn-trace-quiz",
    chars: [{ char: "父", reading: "부", meaning: "아버지", radical: "父", strokes: 4, emoji: "👨", desc: "아버지를 뜻하는 한자예요" }],
  },
  "vocab_2_2": {
    mode: "learn-trace-quiz",
    chars: [{ char: "母", reading: "모", meaning: "어머니", radical: "母", strokes: 5, emoji: "👩", desc: "어머니를 뜻하는 한자예요" }],
  },
  "vocab_2_3": {
    mode: "learn-trace-quiz",
    chars: [{ char: "兄", reading: "형", meaning: "형/오빠", radical: "儿", strokes: 5, emoji: "👦", desc: "형이나 오빠를 뜻하는 한자예요" }],
  },
  "vocab_2_4": {
    mode: "learn-trace-quiz",
    chars: [{ char: "弟", reading: "제", meaning: "동생", radical: "弓", strokes: 7, emoji: "👶", desc: "남동생을 뜻하는 한자예요" }],
  },
  "vocab_2_5": {
    mode: "quiz-only",
    chars: [
      { char: "父", reading: "부", meaning: "아버지", radical: "父", strokes: 4, emoji: "👨", desc: "" },
      { char: "母", reading: "모", meaning: "어머니", radical: "母", strokes: 5, emoji: "👩", desc: "" },
      { char: "兄", reading: "형", meaning: "형/오빠", radical: "儿", strokes: 5, emoji: "👦", desc: "" },
      { char: "弟", reading: "제", meaning: "동생", radical: "弓", strokes: 7, emoji: "👶", desc: "" },
    ],
  },

  /* ── 사자성어 Ch1 (하) ─────────────────────────────── */

  "idioms_1_1": {
    mode: "learn-quiz",
    chars: [{ char: "일석이조", reading: "一石二鳥", meaning: "돌 하나로 새 두 마리", radical: "-", strokes: 0, emoji: "🐦", desc: "한 가지로 두 가지 이득을 얻어요" }],
  },
  "idioms_1_2": {
    mode: "learn-quiz",
    chars: [{ char: "백발백중", reading: "百發百中", meaning: "백 번 쏘아 백 번 맞힘", radical: "-", strokes: 0, emoji: "🎯", desc: "실력이 매우 뛰어남을 뜻해요" }],
  },
  "idioms_1_3": {
    mode: "learn-quiz",
    chars: [{ char: "십중팔구", reading: "十中八九", meaning: "열에 여덟아홉은 그러함", radical: "-", strokes: 0, emoji: "📊", desc: "거의 틀림없다는 뜻이에요" }],
  },
  "idioms_1_4": {
    mode: "learn-quiz",
    chars: [{ char: "언행일치", reading: "言行一致", meaning: "말과 행동이 일치함", radical: "-", strokes: 0, emoji: "🤝", desc: "말한 대로 행동해요" }],
  },
  "idioms_1_5": {
    mode: "quiz-only",
    chars: [
      { char: "일석이조", reading: "一石二鳥", meaning: "돌 하나로 새 두 마리", radical: "-", strokes: 0, emoji: "🐦", desc: "" },
      { char: "백발백중", reading: "百發百中", meaning: "백 번 쏘아 백 번 맞힘", radical: "-", strokes: 0, emoji: "🎯", desc: "" },
      { char: "십중팔구", reading: "十中八九", meaning: "열에 여덟아홉은 그러함", radical: "-", strokes: 0, emoji: "📊", desc: "" },
      { char: "언행일치", reading: "言行一致", meaning: "말과 행동이 일치함", radical: "-", strokes: 0, emoji: "🤝", desc: "" },
    ],
  },

  /* ── 사자성어 Ch2 (중) ─────────────────────────────── */

  "idioms_2_1": {
    mode: "learn-quiz",
    chars: [{ char: "각주구검", reading: "刻舟求劍", meaning: "융통성 없이 어리석음", radical: "-", strokes: 0, emoji: "🗡️", desc: "상황이 바뀌었는데 옛 방법만 고집해요" }],
  },
  "idioms_2_2": {
    mode: "learn-quiz",
    chars: [{ char: "오리무중", reading: "五里霧中", meaning: "방향을 잡지 못함", radical: "-", strokes: 0, emoji: "🌫️", desc: "무슨 일인지 전혀 알 수 없어요" }],
  },
  "idioms_2_3": {
    mode: "learn-quiz",
    chars: [{ char: "와신상담", reading: "臥薪嘗膽", meaning: "복수를 위해 고통을 참음", radical: "-", strokes: 0, emoji: "💪", desc: "목표를 위해 고생을 참고 노력해요" }],
  },
  "idioms_2_4": {
    mode: "learn-quiz",
    chars: [{ char: "호사다마", reading: "好事多魔", meaning: "좋은 일엔 방해가 많음", radical: "-", strokes: 0, emoji: "😤", desc: "좋은 일을 할 때 어려움도 많아요" }],
  },
  "idioms_2_5": {
    mode: "quiz-only",
    chars: [
      { char: "각주구검", reading: "刻舟求劍", meaning: "융통성 없이 어리석음", radical: "-", strokes: 0, emoji: "🗡️", desc: "" },
      { char: "오리무중", reading: "五里霧中", meaning: "방향을 잡지 못함", radical: "-", strokes: 0, emoji: "🌫️", desc: "" },
      { char: "와신상담", reading: "臥薪嘗膽", meaning: "복수를 위해 고통을 참음", radical: "-", strokes: 0, emoji: "💪", desc: "" },
      { char: "호사다마", reading: "好事多魔", meaning: "좋은 일엔 방해가 많음", radical: "-", strokes: 0, emoji: "😤", desc: "" },
    ],
  },

  /* ── 사자성어 Ch3 (상) ─────────────────────────────── */

  "idioms_3_1": {
    mode: "learn-quiz",
    chars: [{ char: "어부지리", reading: "漁父之利", meaning: "제삼자가 이익을 챙김", radical: "-", strokes: 0, emoji: "🎣", desc: "다른 두 사람이 싸울 때 제삼자가 이득을 봐요" }],
  },
  "idioms_3_2": {
    mode: "learn-quiz",
    chars: [{ char: "호가호위", reading: "狐假虎威", meaning: "남의 권세를 빌려 위세 부림", radical: "-", strokes: 0, emoji: "🦊", desc: "남의 힘을 빌려 뽐내는 것이에요" }],
  },
  "idioms_3_3": {
    mode: "learn-quiz",
    chars: [{ char: "새옹지마", reading: "塞翁之馬", meaning: "길흉화복은 예측 불가", radical: "-", strokes: 0, emoji: "🐴", desc: "좋고 나쁜 일은 미리 알 수 없어요" }],
  },
  "idioms_3_4": {
    mode: "learn-quiz",
    chars: [{ char: "권토중래", reading: "捲土重來", meaning: "실패 후 다시 일어남", radical: "-", strokes: 0, emoji: "🔄", desc: "한 번 실패해도 다시 도전해요" }],
  },
  "idioms_3_5": {
    mode: "quiz-only",
    chars: [
      { char: "어부지리", reading: "漁父之利", meaning: "제삼자가 이익을 챙김", radical: "-", strokes: 0, emoji: "🎣", desc: "" },
      { char: "호가호위", reading: "狐假虎威", meaning: "남의 권세를 빌려 위세 부림", radical: "-", strokes: 0, emoji: "🦊", desc: "" },
      { char: "새옹지마", reading: "塞翁之馬", meaning: "길흉화복은 예측 불가", radical: "-", strokes: 0, emoji: "🐴", desc: "" },
      { char: "권토중래", reading: "捲土重來", meaning: "실패 후 다시 일어남", radical: "-", strokes: 0, emoji: "🔄", desc: "" },
    ],
  },
};

/* ── Step generation ───────────────────────────────────── */

export type Step =
  | { type: "learn"; char: CharData }
  | { type: "trace"; char: CharData }
  | { type: "quiz"; char: CharData; choices: string[]; answer: string };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeQuizStep(char: CharData, pool: CharData[]): Step {
  const distractors = shuffle(pool.filter((c) => c.char !== char.char)).slice(0, 3);
  const choices = shuffle([char, ...distractors]).map((c) => c.char);
  return { type: "quiz", char, choices, answer: char.char };
}

export function buildSteps(entry: LessonEntry): Step[] {
  const { mode, chars } = entry;
  if (chars.length === 0) return [];

  const isIdiom = chars[0].strokes === 0;
  const pool = isIdiom ? IDIOM_DISTRACTOR_POOL : DISTRACTOR_POOL;
  const allChars = [...chars, ...pool];

  if (mode === "learn-trace-quiz") {
    const learnTrace = chars.flatMap((c) => [
      { type: "learn" as const, char: c },
      { type: "trace" as const, char: c },
    ]);
    const quizzes = chars.map((c) => makeQuizStep(c, allChars));
    return [...learnTrace, ...quizzes];
  }

  if (mode === "learn-quiz") {
    const learns = chars.map((c) => ({ type: "learn" as const, char: c }));
    const quizzes = chars.map((c) => makeQuizStep(c, allChars));
    return [...learns, ...quizzes];
  }

  // quiz-only
  return chars.map((c) => makeQuizStep(c, allChars));
}

export function getLessonEntry(key: string): LessonEntry | null {
  return LESSONS[key] ?? null;
}
