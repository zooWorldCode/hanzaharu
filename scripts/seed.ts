/**
 * 한자하루 시드 데이터 스크립트
 * 실행: yarn seed
 * (.env.local 의 MONGODB_URI — Atlas 등 — 사용)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import mongoose from 'mongoose';
import Hanja from '../lib/models/Hanja';

config({ path: resolve(process.cwd(), '.env.local') });

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.',
    );
  }
  return uri;
}

// ── 1. 한자 8급 50자 ──────────────────────────────────────────────────────────
const hanjaData = [
  { character: '山', word: '山', reading: '산', meaning: '산', examples: ['산山 → 등산(登山), 산수(山水)'], explanation: '봉우리가 세 개 솟아 있는 산의 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '水', word: '水', reading: '수', meaning: '물', examples: ['수水 → 수영(水泳), 수도(水道)'], explanation: '물이 흘러내리는 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '火', word: '火', reading: '화', meaning: '불', examples: ['화火 → 화재(火災), 화산(火山)'], explanation: '불꽃이 타오르는 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '木', word: '木', reading: '목', meaning: '나무', examples: ['목木 → 목재(木材), 식목(植木)'], explanation: '뿌리와 가지가 있는 나무 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '金', word: '金', reading: '금', meaning: '쇠/금', examples: ['금金 → 황금(黃金), 금메달'], explanation: '땅 속에 묻힌 금속을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '土', word: '土', reading: '토', meaning: '흙', examples: ['토土 → 토지(土地), 국토(國土)'], explanation: '땅 위에 흙이 쌓인 모습을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '日', word: '日', reading: '일', meaning: '날/해', examples: ['일日 → 일출(日出), 생일(生日)'], explanation: '둥근 해의 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '月', word: '月', reading: '월', meaning: '달', examples: ['월月 → 월요일(月曜日), 세월(歲月)'], explanation: '초승달 모양을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '年', word: '年', reading: '년', meaning: '해/년', examples: ['년年 → 새해, 학년(學年)'], explanation: '곡식이 익는 한 해의 시간을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '人', word: '人', reading: '인', meaning: '사람', examples: ['인人 → 인간(人間), 위인(偉人)'], explanation: '두 발로 서 있는 사람의 옆모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '父', word: '父', reading: '부', meaning: '아버지', examples: ['부父 → 부모(父母), 부자(父子)'], explanation: '손에 막대기를 들고 있는 어른의 모습이에요.', difficulty: 'easy' },
  { character: '母', word: '母', reading: '모', meaning: '어머니', examples: ['모母 → 부모(父母), 모국(母國)'], explanation: '아이를 품에 안은 여성의 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '兄', word: '兄', reading: '형', meaning: '형', examples: ['형兄 → 형제(兄弟), 장형(長兄)'], explanation: '앞에 서서 이끄는 사람을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '弟', word: '弟', reading: '제', meaning: '아우', examples: ['제弟 → 형제(兄弟), 제자(弟子)'], explanation: '뒤따르는 사람을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '子', word: '子', reading: '자', meaning: '아들/자식', examples: ['자子 → 자녀(子女), 부자(父子)'], explanation: '포대기에 싸인 아이의 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '女', word: '女', reading: '녀', meaning: '여자', examples: ['녀女 → 여자(女子), 소녀(少女)'], explanation: '무릎을 꿇고 앉은 여성의 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '男', word: '男', reading: '남', meaning: '남자', examples: ['남男 → 남자(男子), 장남(長男)'], explanation: '밭에서 힘(力)써 일하는 사람을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '大', word: '大', reading: '대', meaning: '크다', examples: ['대大 → 대학(大學), 대문(大門)'], explanation: '팔다리를 벌리고 선 큰 사람을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '小', word: '小', reading: '소', meaning: '작다', examples: ['소小 → 소학교(小學校), 소인(小人)'], explanation: '작은 알갱이 세 개를 나타낸 글자예요.', difficulty: 'easy' },
  { character: '中', word: '中', reading: '중', meaning: '가운데', examples: ['중中 → 중학교(中學校), 중간(中間)'], explanation: '과녁 한가운데를 화살이 꿰뚫는 모습이에요.', difficulty: 'easy' },
  { character: '上', word: '上', reading: '상', meaning: '위', examples: ['상上 → 상하(上下), 옥상(屋上)'], explanation: '기준선 위에 점이 있는 모습이에요.', difficulty: 'easy' },
  { character: '下', word: '下', reading: '하', meaning: '아래', examples: ['하下 → 상하(上下), 지하(地下)'], explanation: '기준선 아래에 점이 있는 모습이에요.', difficulty: 'easy' },
  { character: '東', word: '東', reading: '동', meaning: '동쪽', examples: ['동東 → 동쪽, 동해(東海)'], explanation: '나무 사이로 해가 떠오르는 동쪽을 나타내요.', difficulty: 'easy' },
  { character: '西', word: '西', reading: '서', meaning: '서쪽', examples: ['서西 → 서쪽, 서울'], explanation: '새가 둥지로 돌아오는 저녁, 해가 지는 서쪽을 나타내요.', difficulty: 'easy' },
  { character: '南', word: '南', reading: '남', meaning: '남쪽', examples: ['남南 → 남쪽, 남한(南韓)'], explanation: '풀과 나무가 무성한 따뜻한 남쪽을 나타내요.', difficulty: 'easy' },
  { character: '北', word: '北', reading: '북', meaning: '북쪽', examples: ['북北 → 북쪽, 북한(北韓)'], explanation: '두 사람이 등을 맞댄 모습 — 추운 북쪽을 등지는 모습이에요.', difficulty: 'easy' },
  { character: '一', word: '一', reading: '일', meaning: '하나', examples: ['일一 → 일월(一月), 통일(統一)'], explanation: '가장 단순한 가로선 하나가 숫자 1이에요.', difficulty: 'easy' },
  { character: '二', word: '二', reading: '이', meaning: '둘', examples: ['이二 → 이월(二月), 제이(第二)'], explanation: '가로선 두 개가 숫자 2예요.', difficulty: 'easy' },
  { character: '三', word: '三', reading: '삼', meaning: '셋', examples: ['삼三 → 삼월(三月), 삼형제'], explanation: '가로선 세 개가 숫자 3이에요.', difficulty: 'easy' },
  { character: '四', word: '四', reading: '사', meaning: '넷', examples: ['사四 → 사월(四月), 사계절'], explanation: '네 방향을 나타내는 숫자 4예요.', difficulty: 'easy' },
  { character: '五', word: '五', reading: '오', meaning: '다섯', examples: ['오五 → 오월(五月), 오감(五感)'], explanation: '손가락 다섯 개를 나타낸 숫자 5예요.', difficulty: 'easy' },
  { character: '六', word: '六', reading: '육', meaning: '여섯', examples: ['육六 → 유월(六月), 육각형'], explanation: '숫자 6을 나타내는 글자예요.', difficulty: 'easy' },
  { character: '七', word: '七', reading: '칠', meaning: '일곱', examples: ['칠七 → 칠월(七月), 칠색'], explanation: '숫자 7을 나타내는 글자예요.', difficulty: 'easy' },
  { character: '八', word: '八', reading: '팔', meaning: '여덟', examples: ['팔八 → 팔월(八月), 팔방미인'], explanation: '양쪽으로 나뉜 모습이 숫자 8이에요.', difficulty: 'easy' },
  { character: '九', word: '九', reading: '구', meaning: '아홉', examples: ['구九 → 구월(九月), 구구단'], explanation: '숫자 9를 나타내는 글자예요.', difficulty: 'easy' },
  { character: '十', word: '十', reading: '십', meaning: '열', examples: ['십十 → 십월(十月), 십자가'], explanation: '가로세로가 만나는 모습이 숫자 10이에요.', difficulty: 'easy' },
  { character: '百', word: '百', reading: '백', meaning: '백', examples: ['백百 → 백점(百點), 백화점(百貨店)'], explanation: '一(하나)이 白(흰) 것처럼 깨끗하게 100을 나타내요.', difficulty: 'easy' },
  { character: '千', word: '千', reading: '천', meaning: '천', examples: ['천千 → 천만(千萬), 수천(數千)'], explanation: '숫자 1000을 나타내는 글자예요.', difficulty: 'easy' },
  { character: '萬', word: '萬', reading: '만', meaning: '만', examples: ['만萬 → 만세(萬歲), 만물(萬物)'], explanation: '전갈의 모습에서 온 글자로 숫자 10000을 나타내요.', difficulty: 'easy' },
  { character: '國', word: '國', reading: '국', meaning: '나라', examples: ['국國 → 한국(韓國), 국어(國語)'], explanation: '성벽으로 둘러싸인 땅을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '韓', word: '韓', reading: '한', meaning: '한국/나라이름', examples: ['한韓 → 한국(韓國), 한글'], explanation: '우리나라 대한민국을 나타내는 글자예요.', difficulty: 'easy' },
  { character: '校', word: '校', reading: '교', meaning: '학교', examples: ['교校 → 학교(學校), 교장(校長)'], explanation: '나무(木)로 지어진 건물에서 가르치는 곳이에요.', difficulty: 'easy' },
  { character: '學', word: '學', reading: '학', meaning: '배우다', examples: ['학學 → 학교(學校), 학생(學生)'], explanation: '두 손으로 지식을 받아들이는 모습을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '先', word: '先', reading: '선', meaning: '먼저', examples: ['선先 → 선생님(先生), 선두(先頭)'], explanation: '앞서 걸어가는 발의 모습을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '生', word: '生', reading: '생', meaning: '살다/나다', examples: ['생生 → 생일(生日), 학생(學生)'], explanation: '땅에서 새싹이 돋아나는 모습을 본뜬 글자예요.', difficulty: 'easy' },
  { character: '門', word: '門', reading: '문', meaning: '문', examples: ['문門 → 대문(大門), 교문(校門)'], explanation: '두 짝으로 된 문의 모습을 그대로 본뜬 글자예요.', difficulty: 'easy' },
  { character: '室', word: '室', reading: '실', meaning: '방/집', examples: ['실室 → 교실(敎室), 침실(寢室)'], explanation: '지붕 아래 사람이 사는 방을 나타낸 글자예요.', difficulty: 'easy' },
  { character: '外', word: '外', reading: '외', meaning: '바깥', examples: ['외外 → 외출(外出), 해외(海外)'], explanation: '저녁에 점을 치는 모습 → 집 밖의 일을 나타내요.', difficulty: 'easy' },
  { character: '寸', word: '寸', reading: '촌', meaning: '마디/친척', examples: ['촌寸 → 삼촌(三寸), 사촌(四寸)'], explanation: '손목에서 한 마디 거리를 나타낸 글자예요.', difficulty: 'easy' },
  { character: '白', word: '白', reading: '백', meaning: '희다', examples: ['백白 → 백설(白雪), 흑백(黑白)'], explanation: '햇빛(日)이 빛나는 흰색을 나타낸 글자예요.', difficulty: 'easy' },
];

// ── 2. 사자성어 10개 ──────────────────────────────────────────────────────────
const idiomData = [
  {
    word: '一石二鳥',
    reading: '일석이조',
    meaning: '돌 하나로 새 두 마리를 잡는다 — 한 번에 두 가지 이득을 얻는 것',
    explanation: '하나의 행동으로 두 가지 좋은 결과를 얻을 때 써요.',
    story: '영어로는 "kill two birds with one stone"이라고 해요. 똑같은 뜻이죠!',
    examples: ['숙제하면서 영어도 공부하다니, 일석이조네!'],
    difficulty: 'normal',
  },
  {
    word: '百聞不如一見',
    reading: '백문불여일견',
    meaning: '백 번 듣는 것보다 한 번 직접 보는 게 낫다',
    explanation: '말로만 듣는 것보다 직접 눈으로 확인하는 게 더 확실하다는 뜻이에요.',
    story: '중국 한나라 장군 조충국이 황제에게 "직접 가서 보겠습니다"라고 말한 데서 유래했어요.',
    examples: ['제주도는 백문불여일견이야, 직접 가봐야 알아!'],
    difficulty: 'normal',
  },
  {
    word: '十中八九',
    reading: '십중팔구',
    meaning: '열 중에 여덟아홉 — 거의 틀림없이, 높은 확률로',
    explanation: '어떤 일이 일어날 가능성이 매우 높을 때 써요.',
    story: '10번 중 8~9번은 맞는다는 뜻에서 나온 표현이에요.',
    examples: ['십중팔구 비가 올 것 같아, 우산 챙겨!'],
    difficulty: 'normal',
  },
  {
    word: '大器晩成',
    reading: '대기만성',
    meaning: '큰 그릇은 늦게 완성된다 — 크게 될 사람은 늦게 빛난다',
    explanation: '재능이 있어도 결과가 늦게 나타날 수 있으니 포기하지 말라는 뜻이에요.',
    story: '중국 철학자 노자의 말에서 나왔어요. 큰 종은 오래 만들어야 좋은 소리가 난다고 했죠.',
    examples: ['걱정 마, 대기만성이라고 넌 반드시 빛날 거야!'],
    difficulty: 'normal',
  },
  {
    word: '東問西答',
    reading: '동문서답',
    meaning: '동쪽을 물었는데 서쪽을 대답한다 — 질문과 전혀 다른 엉뚱한 대답',
    explanation: '상대방이 묻는 말에 전혀 맞지 않는 엉뚱한 대답을 할 때 써요.',
    story: '방향이 정반대인 동과 서를 이용해 엉뚱함을 표현한 말이에요.',
    examples: ['뭘 먹고 싶냐고 물었더니 잠 자고 싶다고? 완전 동문서답이잖아!'],
    difficulty: 'normal',
  },
  {
    word: '父母兄弟',
    reading: '부모형제',
    meaning: '아버지·어머니·형·아우 — 가장 가까운 가족',
    explanation: '피를 나눈 가장 소중한 가족을 한꺼번에 이르는 말이에요.',
    story: '가족을 뜻하는 한자 네 글자를 모은 표현이에요.',
    examples: ['부모형제와 함께하는 시간이 가장 소중해.'],
    difficulty: 'easy',
  },
  {
    word: '先公後私',
    reading: '선공후사',
    meaning: '공적인 일을 먼저, 사적인 일은 나중에',
    explanation: '내 개인적인 이익보다 모두를 위한 일을 먼저 해야 한다는 뜻이에요.',
    story: '옛날 선비들이 중요하게 여긴 가치예요. 요즘으로 치면 공공의 이익 우선이에요.',
    examples: ['반장은 선공후사 정신으로 친구들을 도왔어.'],
    difficulty: 'normal',
  },
  {
    word: '學而時習',
    reading: '학이시습',
    meaning: '배우고 때때로 익힌다 — 꾸준히 복습하는 것이 중요하다',
    explanation: '공자님이 하신 말씀으로 배운 것을 반복해서 익혀야 진짜 내 것이 된다는 뜻이에요.',
    story: '논어의 첫 번째 문장이에요. 공자님이 학습의 가장 기본을 말씀하신 거예요.',
    examples: ['학이시습! 오늘 배운 한자 꼭 다시 복습하자.'],
    difficulty: 'normal',
  },
  {
    word: '三人成虎',
    reading: '삼인성호',
    meaning: '세 사람이 호랑이가 있다고 우기면 없는 호랑이도 생긴다 — 거짓도 여러 번 반복되면 진실처럼 믿게 된다',
    explanation: '나쁜 소문이나 거짓말도 많은 사람이 말하면 진짜처럼 퍼질 수 있어요.',
    story: '중국 전국시대에 한 신하가 왕에게 "시장에 호랑이가 나타났다는 말을 세 사람이 하면 믿겠냐"고 물어본 데서 유래해요.',
    examples: ['삼인성호라고, 가짜 뉴스도 계속 퍼지면 사람들이 믿어버려.'],
    difficulty: 'hard',
  },
  {
    word: '上善若水',
    reading: '상선약수',
    meaning: '최고의 선은 물과 같다 — 물처럼 낮은 곳에 있으면서 모든 것을 이롭게 하는 것이 최고의 덕이다',
    explanation: '물은 다투지 않고 낮은 곳으로 흐르며 모든 생물을 살게 해줘요. 그런 태도가 최고라는 뜻이에요.',
    story: '노자의 도덕경에 나오는 말이에요. 물의 성질로 인생의 지혜를 가르쳐줘요.',
    examples: ['상선약수, 물처럼 유연하게 생각해봐.'],
    difficulty: 'hard',
  },
];

// ── 3. 교과서 어휘 20개 ───────────────────────────────────────────────────────
const vocabularyData = [
  {
    word: '두발',
    meaning: '머리카락',
    explanation: '頭(머리 두) + 髮(터럭 발). 학교에서 "두발 규정"이라고 하면 머리카락 길이나 모양에 대한 규칙이에요.',
    examples: ['우리 학교는 두발 자유화가 됐어요.'],
    difficulty: 'normal',
  },
  {
    word: '낙관',
    meaning: '앞으로 잘 될 거라고 밝게 생각하는 것',
    explanation: '樂(즐길 락) + 觀(볼 관). 반대말은 "비관"이에요. 같은 상황도 낙관적으로 보면 더 잘 풀려요.',
    examples: ['힘들어도 낙관적으로 생각하면 용기가 생겨요.'],
    difficulty: 'normal',
  },
  {
    word: '권위',
    meaning: '남들이 저절로 따르게 만드는 힘이나 영향력',
    explanation: '權(권세 권) + 威(위엄 위). 선생님, 부모님처럼 경험과 지식으로 얻는 힘이에요. 억지로 누르는 힘과는 달라요.',
    examples: ['그 과학자는 분야에서 권위 있는 학자예요.'],
    difficulty: 'normal',
  },
  {
    word: '여론',
    meaning: '많은 사람들이 함께 가지는 의견',
    explanation: '輿(수레 여, 여럿) + 論(논할 론). 사회 문제에 대해 많은 사람이 공통으로 생각하는 것이에요.',
    examples: ['학교 급식 개선에 대한 여론이 높아졌어요.'],
    difficulty: 'hard',
  },
  {
    word: '절약',
    meaning: '낭비하지 않고 아껴 쓰는 것',
    explanation: '節(마디 절, 절제) + 約(맺을 약, 줄임). 돈, 물, 전기 등을 필요한 만큼만 쓰는 거예요.',
    examples: ['물을 절약하는 습관을 기르자.'],
    difficulty: 'easy',
  },
  {
    word: '인내',
    meaning: '힘들고 괴로워도 참고 견디는 것',
    explanation: '忍(참을 인) + 耐(견딜 내). 어려운 상황에서도 포기하지 않는 힘이에요.',
    examples: ['운동을 잘 하려면 인내가 필요해요.'],
    difficulty: 'normal',
  },
  {
    word: '겸손',
    meaning: '자신을 내세우지 않고 낮추는 태도',
    explanation: '謙(겸손할 겸) + 遜(공손할 손). 잘난 척하지 않고 남을 존중하는 마음이에요.',
    examples: ['상을 받았지만 겸손하게 친구들 덕분이라고 했어요.'],
    difficulty: 'normal',
  },
  {
    word: '모순',
    meaning: '앞뒤가 맞지 않아 서로 어긋나는 것',
    explanation: '矛(창 모) + 盾(방패 순). "어떤 창이든 막는 방패"와 "어떤 방패든 뚫는 창"을 동시에 파는 사람 이야기에서 나온 말이에요.',
    examples: ['"거짓말을 절대 안 한다"고 거짓말하는 건 모순이에요.'],
    difficulty: 'normal',
  },
  {
    word: '편견',
    meaning: '사실을 제대로 보지 않고 한쪽으로 치우쳐 판단하는 생각',
    explanation: '偏(치우칠 편) + 見(볼 견). 제대로 알아보지도 않고 미리 정해버린 잘못된 생각이에요.',
    examples: ['외모로 사람을 판단하는 건 편견이에요.'],
    difficulty: 'normal',
  },
  {
    word: '배려',
    meaning: '상대방을 생각해서 도와주거나 신경 써주는 것',
    explanation: '配(나눌 배) + 慮(생각할 려). 내 입장이 아닌 상대방 입장에서 생각하고 행동하는 거예요.',
    examples: ['지하철에서 노약자에게 자리를 양보하는 것도 배려예요.'],
    difficulty: 'easy',
  },
  {
    word: '자립',
    meaning: '남에게 기대지 않고 스스로 서는 것',
    explanation: '自(스스로 자) + 立(설 립). 혼자 힘으로 생활하거나 결정을 내리는 거예요.',
    examples: ['용돈을 스스로 관리하는 것도 자립의 시작이에요.'],
    difficulty: 'normal',
  },
  {
    word: '소외',
    meaning: '무리에서 멀어져 혼자 따돌림받는 느낌',
    explanation: '疏(성길 소) + 外(바깥 외). 친구들 사이에서 혼자 빠져 있는 느낌이에요.',
    examples: ['전학 온 친구가 소외감을 느끼지 않게 먼저 말을 걸었어요.'],
    difficulty: 'normal',
  },
  {
    word: '관용',
    meaning: '잘못을 너그럽게 받아들이고 용서하는 것',
    explanation: '寬(너그러울 관) + 容(받아들일 용). 작은 잘못은 탓하지 않고 받아주는 넓은 마음이에요.',
    examples: ['친구의 실수를 관용으로 넘어가 줬어요.'],
    difficulty: 'normal',
  },
  {
    word: '비판',
    meaning: '잘못된 점을 따져서 밝히는 것',
    explanation: '批(칠 비, 가릴) + 判(판단할 판). 무조건 욕하는 게 아니라 이유를 들어 문제를 지적하는 거예요.',
    examples: ['그냥 욕하는 게 아니라 근거 있는 비판을 해야 해요.'],
    difficulty: 'normal',
  },
  {
    word: '명예',
    meaning: '다른 사람들에게 인정받는 좋은 평판',
    explanation: '名(이름 명) + 譽(기릴 예). 오랫동안 쌓아온 좋은 이미지와 평판이에요.',
    examples: ['올림픽 금메달은 나라의 명예를 높이는 일이에요.'],
    difficulty: 'normal',
  },
  {
    word: '가치관',
    meaning: '무엇이 중요한지에 대한 자신만의 기준과 생각',
    explanation: '價値(가치) + 觀(볼 관, 생각). 사람마다 중요하게 여기는 것이 달라서 가치관이 달라요.',
    examples: ['돈보다 시간이 중요하다는 것도 하나의 가치관이에요.'],
    difficulty: 'hard',
  },
  {
    word: '자아존중감',
    meaning: '자기 자신을 소중하고 가치 있다고 여기는 마음',
    explanation: '自我(자아, 자기 자신) + 尊重(존중) + 感(느낄 감). 남과 비교하지 않고 나 자신을 좋아하는 마음이에요.',
    examples: ['자아존중감이 높은 사람은 실수해도 쉽게 포기하지 않아요.'],
    difficulty: 'hard',
  },
  {
    word: '비례',
    meaning: '한쪽이 커지면 다른 쪽도 같이 커지는 관계',
    explanation: '比(견줄 비) + 例(법식 례). 수학에서 자주 나오는 말로, 공부 시간과 성적이 비례한다고 하면 공부를 많이 할수록 성적이 오른다는 뜻이에요.',
    examples: ['노력과 실력은 비례해요.'],
    difficulty: 'normal',
  },
  {
    word: '순환',
    meaning: '같은 과정이 돌고 돌아 계속 반복되는 것',
    explanation: '循(따를 순) + 環(고리 환). 계절이 봄→여름→가을→겨울→봄으로 돌아오는 것처럼요.',
    examples: ['물은 증발하고 비가 되어 내리는 순환을 반복해요.'],
    difficulty: 'normal',
  },
  {
    word: '인과관계',
    meaning: '원인과 결과가 서로 연결된 관계',
    explanation: '因(인할 인, 원인) + 果(열매 과, 결과) + 關係(관계). 씨앗(원인)을 심으면 열매(결과)가 열리는 것처럼, 모든 일에는 원인이 있어요.',
    examples: ['열심히 공부한 것(원인)과 시험을 잘 본 것(결과)은 인과관계예요.'],
    difficulty: 'hard',
  },
];

// ── 시드 실행 ─────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(getMongoUri());
  console.log('✅ MongoDB 연결 성공');

  // 기존 데이터 초기화
  await Hanja.deleteMany({});
  console.log('🗑  기존 데이터 삭제 완료');

  // 한자 삽입
  const hanjaInsert = hanjaData.map((h) => ({
    character: h.character,
    word: h.word,
    reading: h.reading,
    meaning: h.meaning,
    examples: h.examples,
    explanation: h.explanation,
    category: 'hanja' as const,
    difficulty: h.difficulty as 'easy' | 'normal' | 'hard',
    tags: [h.reading ?? '', h.meaning],
  }));
  await Hanja.insertMany(hanjaInsert);
  console.log(`📝 한자 ${hanjaInsert.length}개 삽입 완료`);

  // 사자성어 삽입
  const idiomInsert = idiomData.map((i) => ({
    word: i.word,
    reading: i.reading,
    meaning: i.meaning,
    examples: i.examples,
    explanation: i.explanation,
    story: i.story,
    category: 'idiom' as const,
    difficulty: i.difficulty as 'easy' | 'normal' | 'hard',
    tags: [i.reading ?? ''],
  }));
  await Hanja.insertMany(idiomInsert);
  console.log(`🀄 사자성어 ${idiomInsert.length}개 삽입 완료`);

  // 어휘 삽입
  const vocabInsert = vocabularyData.map((v) => ({
    word: v.word,
    meaning: v.meaning,
    examples: v.examples,
    explanation: v.explanation,
    category: 'vocabulary' as const,
    difficulty: v.difficulty as 'easy' | 'normal' | 'hard',
    tags: [v.word],
  }));
  await Hanja.insertMany(vocabInsert);
  console.log(`📖 어휘 ${vocabInsert.length}개 삽입 완료`);

  const total = hanjaInsert.length + idiomInsert.length + vocabInsert.length;
  console.log(`\n🎉 시드 완료! 총 ${total}개 데이터가 저장됐어요.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ 시드 실패:', err);
  process.exit(1);
});