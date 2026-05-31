export type IdiomBreakdownChar = {
  char: string;     // "百"
  huneum: string;   // "일백"
  reading: string;  // "백"
  meaning: string;  // "100"
};

export type CharData = {
  char: string;      // "一" or "일석이조"
  reading: string;   // "일" or "一石二鳥"
  meaning: string;   // "하나" or "하는 일마다 성공함"
  radical: string;   // "一"
  strokes: number;   // 1  (0 for idioms)
  emoji: string;     // "1️⃣"
  desc: string;      // short beginner description
  // 사자성어 전용
  breakdown?: IdiomBreakdownChar[];  // 글자별 풀이
  origin?: string;                   // "백 번 쏘면 백 번 맞는다"
  // 어휘 단어 전용
  dialogue?: VocabDialogue;
};

export type LessonMode = "learn-trace-quiz" | "learn-quiz" | "quiz-only" | "vocab-word";

export type VocabDialogue = {
  lines: { speaker: string; line: string }[];
  highlighted: string;   // 대화에서 강조될 한국어 단어 (예: "부모")
  distractors: string[]; // 틀린 한자 보기 3개
};

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
    chars: [{
      char: "일석이조", reading: "一石二鳥", meaning: "하나로 두 가지 이득을 얻음",
      radical: "-", strokes: 0, emoji: "🐦",
      desc: "한 가지 행동으로 두 가지 이득을 동시에 얻어요",
      origin: "돌 하나로 새 두 마리를 잡는다",
      breakdown: [
        { char: "一", huneum: "하나", reading: "일", meaning: "하나, 1" },
        { char: "石", huneum: "돌", reading: "석", meaning: "돌" },
        { char: "二", huneum: "둘", reading: "이", meaning: "둘, 2" },
        { char: "鳥", huneum: "새", reading: "조", meaning: "새" },
      ],
    }],
  },
  "idioms_1_2": {
    mode: "learn-quiz",
    chars: [{
      char: "백발백중", reading: "百發百中", meaning: "하는 일마다 성공함",
      radical: "-", strokes: 0, emoji: "🎯",
      desc: "실력이 매우 뛰어나 하는 일마다 다 맞힘을 뜻해요",
      origin: "백 번 쏘면 백 번 맞는다",
      breakdown: [
        { char: "百", huneum: "일백", reading: "백", meaning: "100, 백" },
        { char: "發", huneum: "쏠", reading: "발", meaning: "쏘다, 발사하다" },
        { char: "百", huneum: "일백", reading: "백", meaning: "100" },
        { char: "中", huneum: "맞을", reading: "중", meaning: "맞다" },
      ],
    }],
  },
  "idioms_1_3": {
    mode: "learn-quiz",
    chars: [{
      char: "십중팔구", reading: "十中八九", meaning: "거의 틀림없이 그러함",
      radical: "-", strokes: 0, emoji: "📊",
      desc: "열 중에 여덟아홉은 그러하다는 뜻이에요",
      origin: "열 중에 여덟아홉은 그러하다",
      breakdown: [
        { char: "十", huneum: "열", reading: "십", meaning: "열, 10" },
        { char: "中", huneum: "가운데", reading: "중", meaning: "가운데, ~중에서" },
        { char: "八", huneum: "여덟", reading: "팔", meaning: "여덟, 8" },
        { char: "九", huneum: "아홉", reading: "구", meaning: "아홉, 9" },
      ],
    }],
  },
  "idioms_1_4": {
    mode: "learn-quiz",
    chars: [{
      char: "언행일치", reading: "言行一致", meaning: "말한 대로 행동함",
      radical: "-", strokes: 0, emoji: "🤝",
      desc: "말과 행동이 같아야 신뢰받을 수 있어요",
      origin: "말과 행동이 하나로 일치한다",
      breakdown: [
        { char: "言", huneum: "말씀", reading: "언", meaning: "말, 말하다" },
        { char: "行", huneum: "다닐", reading: "행", meaning: "행동하다" },
        { char: "一", huneum: "하나", reading: "일", meaning: "하나, 같다" },
        { char: "致", huneum: "이를", reading: "치", meaning: "이르다, 일치하다" },
      ],
    }],
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
    chars: [{
      char: "각주구검", reading: "刻舟求劍", meaning: "융통성 없이 어리석게 행동함",
      radical: "-", strokes: 0, emoji: "🗡️",
      desc: "상황이 바뀌었는데 옛 방법만 고집하는 어리석음이에요",
      origin: "배에 새겨서 강물 속의 칼을 찾는다",
      breakdown: [
        { char: "刻", huneum: "새길", reading: "각", meaning: "새기다, 조각하다" },
        { char: "舟", huneum: "배", reading: "주", meaning: "배" },
        { char: "求", huneum: "구할", reading: "구", meaning: "구하다, 찾다" },
        { char: "劍", huneum: "칼", reading: "검", meaning: "칼" },
      ],
    }],
  },
  "idioms_2_2": {
    mode: "learn-quiz",
    chars: [{
      char: "오리무중", reading: "五里霧中", meaning: "어디로 가야 할지 전혀 모름",
      radical: "-", strokes: 0, emoji: "🌫️",
      desc: "짙은 안개 속에 있는 것처럼 방향을 잡지 못해요",
      origin: "5리나 되는 짙은 안개 속",
      breakdown: [
        { char: "五", huneum: "다섯", reading: "오", meaning: "다섯, 5" },
        { char: "里", huneum: "마을", reading: "리", meaning: "리, 거리 단위" },
        { char: "霧", huneum: "안개", reading: "무", meaning: "안개" },
        { char: "中", huneum: "가운데", reading: "중", meaning: "가운데, 속" },
      ],
    }],
  },
  "idioms_2_3": {
    mode: "learn-quiz",
    chars: [{
      char: "와신상담", reading: "臥薪嘗膽", meaning: "복수를 위해 고통을 참고 노력함",
      radical: "-", strokes: 0, emoji: "💪",
      desc: "목표를 이루기 위해 힘든 것도 기꺼이 견뎌내요",
      origin: "장작 위에 눕고 쓸개를 핥는다",
      breakdown: [
        { char: "臥", huneum: "누울", reading: "와", meaning: "눕다" },
        { char: "薪", huneum: "섶", reading: "신", meaning: "장작, 가시덤불" },
        { char: "嘗", huneum: "맛볼", reading: "상", meaning: "맛보다" },
        { char: "膽", huneum: "쓸개", reading: "담", meaning: "쓸개" },
      ],
    }],
  },
  "idioms_2_4": {
    mode: "learn-quiz",
    chars: [{
      char: "호사다마", reading: "好事多魔", meaning: "좋은 일에는 방해가 많이 따름",
      radical: "-", strokes: 0, emoji: "😤",
      desc: "좋은 일을 할 때 어려움과 방해가 많이 생겨요",
      origin: "좋은 일에는 마귀의 방해가 많다",
      breakdown: [
        { char: "好", huneum: "좋을", reading: "호", meaning: "좋다" },
        { char: "事", huneum: "일", reading: "사", meaning: "일, 사건" },
        { char: "多", huneum: "많을", reading: "다", meaning: "많다" },
        { char: "魔", huneum: "마귀", reading: "마", meaning: "마귀, 방해" },
      ],
    }],
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
    chars: [{
      char: "어부지리", reading: "漁父之利", meaning: "제삼자가 이득을 챙김",
      radical: "-", strokes: 0, emoji: "🎣",
      desc: "둘이 싸우는 사이에 제삼자가 힘들이지 않고 이득을 얻어요",
      origin: "어부가 싸움 없이 이익을 얻는다",
      breakdown: [
        { char: "漁", huneum: "고기잡을", reading: "어", meaning: "고기 잡다" },
        { char: "父", huneum: "아비", reading: "부", meaning: "아버지, 어른" },
        { char: "之", huneum: "갈", reading: "지", meaning: "의, ~의" },
        { char: "利", huneum: "이로울", reading: "리", meaning: "이익" },
      ],
    }],
  },
  "idioms_3_2": {
    mode: "learn-quiz",
    chars: [{
      char: "호가호위", reading: "狐假虎威", meaning: "남의 권세를 빌려 으스댐",
      radical: "-", strokes: 0, emoji: "🦊",
      desc: "자신의 힘이 없으면서 남의 권세를 빌려 뽐내는 것이에요",
      origin: "여우가 호랑이의 위엄을 빌린다",
      breakdown: [
        { char: "狐", huneum: "여우", reading: "호", meaning: "여우" },
        { char: "假", huneum: "빌릴", reading: "가", meaning: "빌리다" },
        { char: "虎", huneum: "범", reading: "호", meaning: "호랑이" },
        { char: "威", huneum: "위엄", reading: "위", meaning: "위엄, 권세" },
      ],
    }],
  },
  "idioms_3_3": {
    mode: "learn-quiz",
    chars: [{
      char: "새옹지마", reading: "塞翁之馬", meaning: "길흉화복은 예측할 수 없음",
      radical: "-", strokes: 0, emoji: "🐴",
      desc: "좋은 일이 나쁜 일이 되고, 나쁜 일이 좋은 일이 되기도 해요",
      origin: "변방 노인의 말",
      breakdown: [
        { char: "塞", huneum: "변방", reading: "새", meaning: "변방, 국경 지역" },
        { char: "翁", huneum: "늙은이", reading: "옹", meaning: "늙은이, 노인" },
        { char: "之", huneum: "갈", reading: "지", meaning: "의, ~의" },
        { char: "馬", huneum: "말", reading: "마", meaning: "말(동물)" },
      ],
    }],
  },
  "idioms_3_4": {
    mode: "learn-quiz",
    chars: [{
      char: "권토중래", reading: "捲土重來", meaning: "실패 후 힘차게 다시 일어섬",
      radical: "-", strokes: 0, emoji: "🔄",
      desc: "한 번 쓰러져도 힘차게 다시 일어나 도전해요",
      origin: "흙먼지를 일으키며 다시 온다",
      breakdown: [
        { char: "捲", huneum: "말", reading: "권", meaning: "말다, 구르다" },
        { char: "土", huneum: "흙", reading: "토", meaning: "흙, 땅" },
        { char: "重", huneum: "무거울", reading: "중", meaning: "다시, 重" },
        { char: "來", huneum: "올", reading: "래", meaning: "오다" },
      ],
    }],
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

  /* ── 한자 어휘 Ch3 · 가족과 친척 ──────────────────────── */

  "vocab_3_1": { mode: "vocab-word", chars: [{
    char: "부모", reading: "父母", meaning: "아버지와 어머니를 함께 이르는 말",
    radical: "-", strokes: 0, emoji: "👨‍👩",
    desc: "두 글자로 가족의 어른을 나타내요",
    origin: "아버지(父) + 어머니(母)",
    breakdown: [
      { char: "父", huneum: "아비", reading: "부", meaning: "아버지" },
      { char: "母", huneum: "어미", reading: "모", meaning: "어머니" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "오늘 부모님이 학교에 오셨어?" },
        { speaker: "현우", line: "응, 부모님 둘 다 오셨어!" },
      ],
      highlighted: "부모",
      distractors: ["兄弟", "姉妹", "親戚"],
    },
  }]},

  "vocab_3_2": { mode: "vocab-word", chars: [{
    char: "형제", reading: "兄弟", meaning: "형과 동생을 함께 이르는 말",
    radical: "-", strokes: 0, emoji: "👦",
    desc: "남자 형제를 나타내는 한자 단어예요",
    origin: "형(兄) + 아우(弟)",
    breakdown: [
      { char: "兄", huneum: "형", reading: "형", meaning: "형, 오빠" },
      { char: "弟", huneum: "아우", reading: "제", meaning: "아우, 남동생" },
    ],
    dialogue: {
      lines: [
        { speaker: "선생님", line: "너희 집에 형제가 있니?" },
        { speaker: "민준", line: "네, 저는 형제가 둘이에요!" },
      ],
      highlighted: "형제",
      distractors: ["父母", "姉妹", "祖父"],
    },
  }]},

  "vocab_3_3": { mode: "vocab-word", chars: [{
    char: "자매", reading: "姉妹", meaning: "언니와 여동생을 함께 이르는 말",
    radical: "-", strokes: 0, emoji: "👧",
    desc: "여자 형제를 나타내는 한자 단어예요",
    origin: "언니(姉) + 여동생(妹)",
    breakdown: [
      { char: "姉", huneum: "누이", reading: "자", meaning: "누나, 언니" },
      { char: "妹", huneum: "아랫누이", reading: "매", meaning: "여동생" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "우리는 자매야, 사이좋게 지내자!" },
        { speaker: "현우", line: "와, 자매가 닮았다!" },
      ],
      highlighted: "자매",
      distractors: ["兄弟", "父母", "親戚"],
    },
  }]},

  "vocab_3_4": { mode: "vocab-word", chars: [{
    char: "조부", reading: "祖父", meaning: "할아버지",
    radical: "-", strokes: 0, emoji: "👴",
    desc: "아버지의 아버지를 나타내는 한자 단어예요",
    origin: "할아버지(祖) + 아버지(父)",
    breakdown: [
      { char: "祖", huneum: "할아비", reading: "조", meaning: "할아버지, 조상" },
      { char: "父", huneum: "아비", reading: "부", meaning: "아버지" },
    ],
    dialogue: {
      lines: [
        { speaker: "민준", line: "이번 주말에 조부님 댁에 가요." },
        { speaker: "선생님", line: "조부님은 건강하시니?" },
      ],
      highlighted: "조부",
      distractors: ["父母", "兄弟", "親戚"],
    },
  }]},

  "vocab_3_5": { mode: "vocab-word", chars: [{
    char: "친척", reading: "親戚", meaning: "가족과 혈연으로 이어진 사람들",
    radical: "-", strokes: 0, emoji: "👨‍👩‍👧‍👦",
    desc: "혈연으로 연결된 가족 전체를 가리켜요",
    origin: "가깝다(親) + 친족(戚)",
    breakdown: [
      { char: "親", huneum: "친할", reading: "친", meaning: "가깝다, 친하다" },
      { char: "戚", huneum: "겨레", reading: "척", meaning: "친족" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "명절에 친척이 다 모였어?" },
        { speaker: "현우", line: "응, 친척들이 많이 왔어!" },
      ],
      highlighted: "친척",
      distractors: ["父母", "兄弟", "姉妹"],
    },
  }]},

  /* ── 한자 어휘 Ch4 · 학교와 공부 ──────────────────────── */

  "vocab_4_1": { mode: "vocab-word", chars: [{
    char: "학교", reading: "學校", meaning: "공부를 배우는 곳",
    radical: "-", strokes: 0, emoji: "🏫",
    desc: "배움이 이루어지는 교육 기관이에요",
    origin: "배우다(學) + 학교(校)",
    breakdown: [
      { char: "學", huneum: "배울", reading: "학", meaning: "배우다" },
      { char: "校", huneum: "학교", reading: "교", meaning: "학교" },
    ],
    dialogue: {
      lines: [
        { speaker: "민준", line: "나는 매일 학교에 걸어서 가." },
        { speaker: "지아", line: "우리 학교 운동장이 넓어서 좋아!" },
      ],
      highlighted: "학교",
      distractors: ["敎室", "宿題", "試驗"],
    },
  }]},

  "vocab_4_2": { mode: "vocab-word", chars: [{
    char: "교실", reading: "敎室", meaning: "학생들이 공부하는 방",
    radical: "-", strokes: 0, emoji: "🏫",
    desc: "선생님과 학생이 함께 배우는 공간이에요",
    origin: "가르치다(敎) + 방(室)",
    breakdown: [
      { char: "敎", huneum: "가르칠", reading: "교", meaning: "가르치다" },
      { char: "室", huneum: "집", reading: "실", meaning: "방" },
    ],
    dialogue: {
      lines: [
        { speaker: "선생님", line: "교실에서는 조용히 해야 해요." },
        { speaker: "민준", line: "네, 교실 규칙을 지킬게요!" },
      ],
      highlighted: "교실",
      distractors: ["學校", "宿題", "發表"],
    },
  }]},

  "vocab_4_3": { mode: "vocab-word", chars: [{
    char: "숙제", reading: "宿題", meaning: "집에서 해 오는 공부",
    radical: "-", strokes: 0, emoji: "📝",
    desc: "학교에서 내준 집에서 할 공부예요",
    origin: "남다(宿) + 문제(題)",
    breakdown: [
      { char: "宿", huneum: "묵을", reading: "숙", meaning: "묵다, 남다" },
      { char: "題", huneum: "제목", reading: "제", meaning: "문제, 제목" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "오늘 숙제 다 했어?" },
        { speaker: "현우", line: "아직! 숙제가 너무 많아." },
      ],
      highlighted: "숙제",
      distractors: ["學校", "敎室", "試驗"],
    },
  }]},

  "vocab_4_4": { mode: "vocab-word", chars: [{
    char: "시험", reading: "試驗", meaning: "실력이나 능력을 알아보는 평가",
    radical: "-", strokes: 0, emoji: "📋",
    desc: "얼마나 잘 알고 있는지 확인하는 거예요",
    origin: "시험하다(試) + 검사하다(驗)",
    breakdown: [
      { char: "試", huneum: "시험", reading: "시", meaning: "시험하다" },
      { char: "驗", huneum: "시험", reading: "험", meaning: "검사하다" },
    ],
    dialogue: {
      lines: [
        { speaker: "민준", line: "내일 시험이 있어서 열심히 공부해." },
        { speaker: "지아", line: "시험 잘 봐! 화이팅!" },
      ],
      highlighted: "시험",
      distractors: ["學校", "宿題", "發表"],
    },
  }]},

  "vocab_4_5": { mode: "vocab-word", chars: [{
    char: "발표", reading: "發表", meaning: "여러 사람 앞에서 의견이나 결과를 말함",
    radical: "-", strokes: 0, emoji: "🎤",
    desc: "내 생각을 여러 사람에게 말하는 거예요",
    origin: "내보내다(發) + 나타내다(表)",
    breakdown: [
      { char: "發", huneum: "필", reading: "발", meaning: "내보내다" },
      { char: "表", huneum: "나타날", reading: "표", meaning: "나타내다" },
    ],
    dialogue: {
      lines: [
        { speaker: "선생님", line: "지아야, 앞에 나와서 발표해 볼래요?" },
        { speaker: "지아", line: "네! 제가 발표할게요." },
      ],
      highlighted: "발표",
      distractors: ["敎室", "試驗", "宿題"],
    },
  }]},

  /* ── 한자 어휘 Ch5 · 장소와 길찾기 ─────────────────────── */

  "vocab_5_1": { mode: "vocab-word", chars: [{
    char: "입구", reading: "入口", meaning: "들어가는 곳",
    radical: "-", strokes: 0, emoji: "🚪",
    desc: "건물이나 공간에 들어가는 통로예요",
    origin: "들어가다(入) + 입(口)",
    breakdown: [
      { char: "入", huneum: "들", reading: "입", meaning: "들어가다" },
      { char: "口", huneum: "입", reading: "구", meaning: "입, 출입하는 곳" },
    ],
    dialogue: {
      lines: [
        { speaker: "엄마", line: "박물관 입구가 어디야?" },
        { speaker: "민준", line: "저기 입구 표지판이 보여요!" },
      ],
      highlighted: "입구",
      distractors: ["出口", "階段", "公園"],
    },
  }]},

  "vocab_5_2": { mode: "vocab-word", chars: [{
    char: "출구", reading: "出口", meaning: "나가는 곳",
    radical: "-", strokes: 0, emoji: "🚪",
    desc: "건물이나 공간에서 나가는 통로예요",
    origin: "나가다(出) + 입(口)",
    breakdown: [
      { char: "出", huneum: "날", reading: "출", meaning: "나가다" },
      { char: "口", huneum: "입", reading: "구", meaning: "입, 출입하는 곳" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "영화 끝났다! 출구가 어디야?" },
        { speaker: "현우", line: "저쪽 출구로 나가면 돼." },
      ],
      highlighted: "출구",
      distractors: ["入口", "階段", "圖書館"],
    },
  }]},

  "vocab_5_3": { mode: "vocab-word", chars: [{
    char: "계단", reading: "階段", meaning: "위아래 층을 오르내리는 시설",
    radical: "-", strokes: 0, emoji: "🪜",
    desc: "층과 층 사이를 오르내리는 시설이에요",
    origin: "층(階) + 단(段)",
    breakdown: [
      { char: "階", huneum: "섬돌", reading: "계", meaning: "층, 계단" },
      { char: "段", huneum: "층계", reading: "단", meaning: "단, 층" },
    ],
    dialogue: {
      lines: [
        { speaker: "선생님", line: "2층 교실은 계단으로 올라가세요." },
        { speaker: "민준", line: "네! 계단으로 올라갈게요." },
      ],
      highlighted: "계단",
      distractors: ["入口", "出口", "公園"],
    },
  }]},

  "vocab_5_4": { mode: "vocab-word", chars: [{
    char: "공원", reading: "公園", meaning: "사람들이 쉬고 놀 수 있는 장소",
    radical: "-", strokes: 0, emoji: "🌳",
    desc: "누구나 쉬고 즐길 수 있는 공공 공간이에요",
    origin: "공공의(公) + 동산(園)",
    breakdown: [
      { char: "公", huneum: "공평할", reading: "공", meaning: "공공의" },
      { char: "園", huneum: "동산", reading: "원", meaning: "동산, 정원" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "주말에 공원에서 같이 놀래?" },
        { speaker: "현우", line: "좋아! 공원에서 자전거 타자." },
      ],
      highlighted: "공원",
      distractors: ["入口", "出口", "圖書館"],
    },
  }]},

  "vocab_5_5": { mode: "vocab-word", chars: [{
    char: "도서관", reading: "圖書館", meaning: "책을 읽고 빌릴 수 있는 곳",
    radical: "-", strokes: 0, emoji: "📚",
    desc: "많은 책이 있어 읽고 빌릴 수 있는 곳이에요",
    origin: "그림(圖) + 책(書) + 건물(館)",
    breakdown: [
      { char: "圖", huneum: "그림", reading: "도", meaning: "그림, 도면" },
      { char: "書", huneum: "글", reading: "서", meaning: "책, 글" },
      { char: "館", huneum: "집", reading: "관", meaning: "집, 건물" },
    ],
    dialogue: {
      lines: [
        { speaker: "민준", line: "도서관에서 책 빌렸어?" },
        { speaker: "지아", line: "응, 도서관에서 재미있는 책 찾았어!" },
      ],
      highlighted: "도서관",
      distractors: ["入口", "公園", "階段"],
    },
  }]},

  /* ── 한자 어휘 Ch6 · 시간과 날짜 ──────────────────────── */

  "vocab_6_1": { mode: "vocab-word", chars: [{
    char: "아침", reading: "朝", meaning: "해가 뜨고 오전이 시작되는 시간",
    radical: "-", strokes: 0, emoji: "🌅",
    desc: "하루 중 가장 먼저 찾아오는 시간이에요",
    origin: "조(朝) — 아침",
    breakdown: [
      { char: "朝", huneum: "아침", reading: "조", meaning: "아침" },
    ],
    dialogue: {
      lines: [
        { speaker: "엄마", line: "아침에 일찍 일어났구나!" },
        { speaker: "민준", line: "네, 아침밥 먹고 학교 가요." },
      ],
      highlighted: "아침",
      distractors: ["夕", "今日", "明日"],
    },
  }]},

  "vocab_6_2": { mode: "vocab-word", chars: [{
    char: "저녁", reading: "夕", meaning: "해가 지고 밤이 되기 전 시간",
    radical: "-", strokes: 0, emoji: "🌆",
    desc: "하루가 마무리되는 시간이에요",
    origin: "석(夕) — 저녁",
    breakdown: [
      { char: "夕", huneum: "저녁", reading: "석", meaning: "저녁" },
    ],
    dialogue: {
      lines: [
        { speaker: "아빠", line: "저녁에 뭐 먹고 싶어?" },
        { speaker: "지아", line: "저녁은 피자 먹고 싶어요!" },
      ],
      highlighted: "저녁",
      distractors: ["朝", "今日", "週末"],
    },
  }]},

  "vocab_6_3": { mode: "vocab-word", chars: [{
    char: "오늘", reading: "今日", meaning: "지금 있는 날",
    radical: "-", strokes: 0, emoji: "📅",
    desc: "바로 지금 이 날을 가리켜요",
    origin: "지금(今) + 날(日)",
    breakdown: [
      { char: "今", huneum: "이제", reading: "금", meaning: "지금" },
      { char: "日", huneum: "날", reading: "일", meaning: "날, 해" },
    ],
    dialogue: {
      lines: [
        { speaker: "현우", line: "오늘 날씨가 정말 좋다!" },
        { speaker: "지아", line: "맞아, 오늘 소풍 가기 딱 좋네." },
      ],
      highlighted: "오늘",
      distractors: ["朝", "明日", "週末"],
    },
  }]},

  "vocab_6_4": { mode: "vocab-word", chars: [{
    char: "내일", reading: "明日", meaning: "오늘 다음 날",
    radical: "-", strokes: 0, emoji: "📅",
    desc: "오늘이 지나면 찾아오는 날이에요",
    origin: "밝다(明) + 날(日)",
    breakdown: [
      { char: "明", huneum: "밝을", reading: "명", meaning: "밝다" },
      { char: "日", huneum: "날", reading: "일", meaning: "날, 해" },
    ],
    dialogue: {
      lines: [
        { speaker: "민준", line: "내일 같이 축구하자!" },
        { speaker: "현우", line: "좋아! 내일 운동장에서 만나." },
      ],
      highlighted: "내일",
      distractors: ["今日", "夕", "週末"],
    },
  }]},

  "vocab_6_5": { mode: "vocab-word", chars: [{
    char: "주말", reading: "週末", meaning: "한 주의 마지막 부분, 토요일과 일요일",
    radical: "-", strokes: 0, emoji: "🎉",
    desc: "일주일이 끝나는 토요일과 일요일이에요",
    origin: "일주일(週) + 끝(末)",
    breakdown: [
      { char: "週", huneum: "돌", reading: "주", meaning: "일주일" },
      { char: "末", huneum: "끝", reading: "말", meaning: "끝" },
    ],
    dialogue: {
      lines: [
        { speaker: "지아", line: "이번 주말에 뭐 해?" },
        { speaker: "현우", line: "주말에 가족이랑 여행 가!" },
      ],
      highlighted: "주말",
      distractors: ["今日", "明日", "朝"],
    },
  }]},
};

/* ── Step generation ───────────────────────────────────── */

export type Step =
  | { type: "learn"; char: CharData }
  | { type: "trace"; char: CharData }
  | { type: "quiz"; char: CharData; choices: string[]; answer: string }
  | { type: "idiom-explain"; char: CharData }
  | {
      type: "idiom-trace";
      char: CharData;
      traceChar: string;
      traceHuneum: string;
      traceReading: string;
      traceMeaning: string;
      traceIndex: number;
      traceTotal: number;
    }
  | { type: "vocab-explain"; char: CharData }
  | {
      type: "vocab-dialogue-quiz";
      char: CharData;
      dialogue: { speaker: string; line: string }[];
      highlighted: string;
      choices: string[];
      answer: string;
    };

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

  // ── 어휘 단어 학습 (vocab-word) ──────────────────────────
  if (mode === "vocab-word") {
    return chars.flatMap((c) => {
      const seenChars = new Set<string>();
      const uniqueBreakdown = (c.breakdown ?? []).filter((b) => {
        if (seenChars.has(b.char)) return false;
        seenChars.add(b.char);
        return true;
      });
      const steps: Step[] = [
        { type: "vocab-explain" as const, char: c },
        ...uniqueBreakdown.map((b, i) => ({
          type: "idiom-trace" as const,
          char: c,
          traceChar: b.char,
          traceHuneum: b.huneum,
          traceReading: b.reading,
          traceMeaning: b.meaning,
          traceIndex: i + 1,
          traceTotal: uniqueBreakdown.length,
        })),
      ];
      if (c.dialogue) {
        steps.push({
          type: "vocab-dialogue-quiz" as const,
          char: c,
          dialogue: c.dialogue.lines,
          highlighted: c.dialogue.highlighted,
          choices: shuffle([c.reading, ...c.dialogue.distractors]),
          answer: c.reading,
        });
      }
      return steps;
    });
  }

  if (mode === "learn-trace-quiz") {
    const learnTrace = chars.flatMap((c) => [
      { type: "learn" as const, char: c },
      { type: "trace" as const, char: c },
    ]);
    const quizzes = chars.map((c) => makeQuizStep(c, allChars));
    return [...learnTrace, ...quizzes];
  }

  if (mode === "learn-quiz") {
    // breakdown이 있는 사자성어 → 글자 풀이 + 따라쓰기 + 퀴즈
    if (chars[0]?.breakdown) {
      return chars.flatMap((c) => {
        const seenChars = new Set<string>();
        const uniqueBreakdown = (c.breakdown ?? []).filter((b) => {
          if (seenChars.has(b.char)) return false;
          seenChars.add(b.char);
          return true;
        });
        return [
          { type: "idiom-explain" as const, char: c },
          ...uniqueBreakdown.map((b, i) => ({
            type: "idiom-trace" as const,
            char: c,
            traceChar: b.char,
            traceHuneum: b.huneum,
            traceReading: b.reading,
            traceMeaning: b.meaning,
            traceIndex: i + 1,
            traceTotal: uniqueBreakdown.length,
          })),
          makeQuizStep(c, allChars),
        ];
      });
    }
    const learns = chars.map((c) => ({ type: "learn" as const, char: c }));
    const quizzes = chars.map((c) => makeQuizStep(c, allChars));
    return [...learns, ...quizzes];
  }

  // quiz-only
  return chars.map((c) => makeQuizStep(c, allChars));
}

export function getLessonEntry(key: string): LessonEntry | null {
  const lessonAliases: Record<string, string> = {
    vocab_1_1: "vocab_3_1",
    vocab_1_2: "vocab_3_2",
    vocab_1_3: "vocab_3_3",
    vocab_1_4: "vocab_3_4",
    vocab_1_5: "vocab_3_5",
    vocab_2_1: "vocab_4_1",
    vocab_2_2: "vocab_4_2",
    vocab_2_3: "vocab_4_3",
    vocab_2_4: "vocab_4_4",
    vocab_2_5: "vocab_4_5",
  };

  const resolvedKey = lessonAliases[key] ?? key;
  return LESSONS[resolvedKey] ?? null;
}
