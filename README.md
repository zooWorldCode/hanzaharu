# HanzaHaru (한자하루)

> **하루 한자, 게임처럼 배우는 한자 학습 MVP**

초등학생을 대상으로 한자를 학습·시험·게임 형태로 익힐 수 있는 웹 서비스입니다.  
현재는 **프로젝트 기반 구조, DB 스키마, 소셜 로그인, 마이페이지**까지 구현된 상태이며, 학습/시험/게임 본 기능은 앞으로 개발할 예정입니다.

---

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [기술 스택](#2-기술-스택)
3. [현재 구현된 기능](#3-현재-구현된-기능)
4. [프로젝트 폴더 구조](#4-프로젝트-폴더-구조)
5. [MongoDB / Mongoose 모델 구조 요약](#5-mongodb--mongoose-모델-구조-요약)
6. [인증 시스템 구조](#6-인증-시스템-구조)
7. [실행 방법](#7-실행-방법)
8. [환경변수 설명](#8-환경변수-설명)
9. [현재 TODO 목록](#9-현재-todo-목록)
10. [향후 개발 계획](#10-향후-개발-계획)

---

## 1. 프로젝트 소개

**HanzaHaru**는 다음을 목표로 하는 한자 학습 플랫폼 MVP입니다.

- 한자 학습 콘텐츠 제공 (학년·난이도별)
- 퀴즈·시험으로 복습
- 카드/스피드 등 미니게임으로 학습 동기 부여
- 출석·코인·레벨·아바타/집 꾸미기 등 게임형 보상

지금 단계에서는 **앱 뼈대(레이아웃, UI 컴포넌트, DB 모델, OAuth 로그인, 라우트 보호)**가 갖춰져 있고, 실제 학습·게임 화면은 다음 스프린트에서 채울 예정입니다.

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | [Next.js 16](https://nextjs.org/) (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4, shadcn/ui (Radix Nova) |
| DB | MongoDB + [Mongoose](https://mongoosejs.com/) |
| 인증 | [NextAuth.js v5 (Auth.js)](https://authjs.dev/) + `@auth/mongodb-adapter` |
| 폼/검증 | React Hook Form, Zod |
| 서버 상태 | TanStack React Query |
| 아이콘/애니메이션 | lucide-react, framer-motion |
| 패키지 매니저 | Yarn |

---

## 3. 현재 구현된 기능

### UI / 레이아웃

- 공통 **Header** (로고, GNB: 학습·시험·게임·마이페이지, 로그인/마이페이지 버튼)
- 공통 **Footer** (저작권, GitHub 링크)
- **Noto Sans KR** 한글 폰트
- HanzaHaru 브랜드 컬러 (primary `#57B72A`, secondary `#F8A24D`, accent `#5ECEAB`)
- shadcn/ui 컴포넌트: button, card, input, badge, tabs, dialog, dropdown-menu, separator, skeleton, sonner(toast), progress, avatar, sheet, tooltip

### 인증

- Google / Kakao / Naver 소셜 로그인 (`/login`)
- MongoDB에 OAuth 계정·사용자 정보 저장 (Adapter)
- 로그인 시 Mongoose `User` 문서 동기화 (레벨, 코인, 경험치 등)
- JWT 세션에 `role`, `level`, `exp`, `coins` 포함
- `middleware`로 보호 라우트 접근 제어

### 페이지

| 경로 | 상태 | 설명 |
|------|------|------|
| `/` | ✅ | 홈 (환영 메시지, Button 데모) |
| `/login` | ✅ | 소셜 로그인 3종, callbackUrl 지원 |
| `/mypage` | ✅ | 프로필, 레벨, EXP, 코인, 출석, 아이템 수, 로그아웃 |
| `/403` | ✅ | 권한 없음 안내 |
| `/admin` | ✅ (플레이스홀더) | admin 전용 (본문만 구현) |
| `/learning`, `/test`, `/game`, `/shop` | ⏳ | middleware만 설정, **페이지 미구현** |

### 데이터 레이어

- Mongoose 연결 싱글턴 (`lib/mongodb.ts`)
- MongoDB Native Client (`lib/mongodb-client.ts`, Auth Adapter용)
- 6개 모델 스키마 + Zod 검증 (`hanja`, `user`)

---

## 4. 프로젝트 폴더 구조

```
hanzaharu/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          # 로그인 페이지
│   ├── (main)/
│   │   └── mypage/page.tsx         # 마이페이지
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                # Auth.js API 라우트
│   ├── admin/page.tsx              # 관리자 (플레이스홀더)
│   ├── 403/page.tsx                # 권한 없음
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── page.tsx                    # 홈
│   └── globals.css                 # 전역 스타일 + 테마 변수
├── components/
│   ├── auth/                       # 소셜 로그인, 로그아웃
│   ├── layout/                     # Header, Footer, AuthButton
│   ├── providers/                  # Query, Session Provider
│   └── ui/                         # shadcn/ui 컴포넌트
├── lib/
│   ├── auth/providers/             # Kakao, Naver 커스텀 Provider
│   ├── models/                     # Mongoose 모델
│   ├── validations/                # Zod 스키마
│   ├── mongodb.ts                  # Mongoose 연결
│   ├── mongodb-client.ts           # MongoDB Client (Adapter)
│   └── utils.ts
├── types/
│   └── next-auth.d.ts              # 세션 타입 확장
├── auth.ts                         # NextAuth 메인 설정
├── auth.config.ts                  # Edge middleware용 설정
├── middleware.ts                   # 라우트 보호
├── tailwind.config.ts
├── .env.local                      # 환경변수 (git 제외 권장)
└── package.json
```

---

## 5. MongoDB / Mongoose 모델 구조 요약

모든 모델은 `timestamps: true`로 `createdAt`, `updatedAt`이 자동 생성됩니다.

### User

게임형 사용자 프로필. OAuth 로그인 시 자동 생성/갱신됩니다.

| 필드 | 설명 |
|------|------|
| `name`, `email`, `image` | 기본 프로필 (`email` unique) |
| `role` | `user` \| `admin` (기본: `user`) |
| `level`, `exp`, `coins`, `streak` | 게임 진행도 |
| `avatarItems`, `houseItems` | 보유 아이템 (`GameReward` ref) |
| `equippedAvatar`, `equippedHouse` | 장착 아이템 |

### Hanja

한자 학습 콘텐츠.

| 필드 | 설명 |
|------|------|
| `character`, `meaning`, `reading` | 한자·뜻·음 |
| `examples`, `explanation`, `story` | 예시·설명·스토리 |
| `grade` | `1`~`6` 학년 |
| `difficulty` | `easy` \| `normal` \| `hard` |
| `tags`, `image` | 검색·이미지 |

**인덱스:** text(`character`, `meaning`, `reading`, `tags`), compound(`grade`, `difficulty`)

### Quiz

한자별 퀴즈 (`hanjaId` → Hanja).

| 필드 | 설명 |
|------|------|
| `type` | `meaning` \| `reading` \| `matching` \| `image` |
| `question`, `choices`, `answer` | 문제 데이터 |

### GameReward

아바타·집·코인·뱃지 보상 아이템.

| 필드 | 설명 |
|------|------|
| `type` | `avatar` \| `house` \| `coin` \| `badge` |
| `rarity` | `common` \| `rare` \| `epic` \| `legendary` |
| `price`, `image` | 상점 가격·이미지 |

### Attendance

출석 기록 (`userId` → User). **unique:** `userId` + `date`

### GameScore

게임 점수 (`userId` → User).

| 필드 | 설명 |
|------|------|
| `gameType` | `card` \| `speed` \| `word` \| `character` |
| `score`, `rewardCoins` | 점수·보상 코인 |

### Zod 검증

- `lib/validations/hanja.ts` — `HanjaCreateSchema`, `HanjaUpdateSchema`
- `lib/validations/user.ts` — `UserCreateSchema`, `UserUpdateSchema`, `UserProfileSchema`

---

## 6. 인증 시스템 구조

### 흐름 요약

```
[사용자] → /login 에서 소셜 로그인 클릭
    → OAuth 제공자 (Google / Kakao / Naver)
    → /api/auth/callback/{provider}
    → MongoDBAdapter: users / accounts 컬렉션 저장
    → signIn 이벤트: Mongoose User 동기화 (level, coins 등)
    → JWT에 role, level, exp, coins 저장
    → callbackUrl 또는 홈으로 이동
```

### 주요 파일

| 파일 | 역할 |
|------|------|
| `auth.ts` | Provider, Adapter, callbacks, User 동기화 |
| `auth.config.ts` | JWT 세션, middleware용 session 매핑 |
| `middleware.ts` | 로그인·admin 권한 검사 |
| `lib/auth/providers/kakao.ts` | 카카오 OAuth |
| `lib/auth/providers/naver.ts` | 네이버 OAuth |

### 세션에 포함되는 사용자 정보

```typescript
session.user = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  level: number;
  exp: number;
  coins: number;
};
```

### 보호 라우트 (`middleware.ts`)

| 경로 | 조건 |
|------|------|
| `/learning`, `/test`, `/game`, `/mypage`, `/shop` | 로그인 필요 → 미로그인 시 `/login?callbackUrl=...` |
| `/admin/*` | `role === "admin"` → 아니면 `/403` |

### OAuth 리다이렉트 URI (로컬 개발)

각 콘솔에 아래 URL을 등록하세요.

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/kakao
http://localhost:3000/api/auth/callback/naver
```

> **참고:** Edge `middleware` 호환을 위해 세션 전략은 **JWT**입니다. 사용자·OAuth 계정은 MongoDB Adapter로 저장되며, 세션 클레임은 JWT 쿠키에 담깁니다.

---

## 7. 실행 방법

### 사전 요구 사항

- **Node.js** 18.17 이상 (권장: 20+)
- **Yarn** 1.x
- **MongoDB** (로컬 또는 [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google / Kakao / Naver **OAuth 앱** 등록

### 1) 저장소 클론 및 의존성 설치

```bash
cd hanzaharu
yarn install
```

### 2) 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 [환경변수](#8-환경변수-설명)를 채웁니다.

```bash
# 예시 (Windows PowerShell)
copy .env.local.example .env.local   # 예시 파일이 있다면
# 또는 .env.local 을 직접 편집
```

### 3) 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### 4) 프로덕션 빌드 (선택)

```bash
yarn build
yarn start
```

### 동작 확인 체크리스트

- [ ] `/login` — Google / Kakao / Naver 버튼 표시
- [ ] 로그인 후 `/mypage` 접근 가능
- [ ] 비로그인 상태에서 `/mypage` → `/login` 리다이렉트
- [ ] 일반 사용자가 `/admin` 접근 시 `/403` 이동

---

## 8. 환경변수 설명

`.env.local` 예시:

```env
# MongoDB 연결 URI (Atlas 또는 로컬)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hanzaharu

# NextAuth 시크릿 (랜덤 문자열, 예: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-here

# 앱 기본 URL (로컬 개발)
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Kakao OAuth (Kakao Developers)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# Naver OAuth (Naver Developers)
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

| 변수 | 필수 | 설명 |
|------|------|------|
| `MONGODB_URI` | ✅ | MongoDB 접속 문자열. 비어 있으면 DB 연결 API 호출 시 오류 |
| `NEXTAUTH_SECRET` | ✅ | 세션/JWT 암호화용 비밀키 |
| `NEXTAUTH_URL` | ✅ | 앱 공개 URL (로컬: `http://localhost:3000`) |
| `GOOGLE_CLIENT_*` | 로그인 시 | Google OAuth 클라이언트 |
| `KAKAO_CLIENT_*` | 로그인 시 | Kakao REST API 키 / 시크릿 |
| `NAVER_CLIENT_*` | 로그인 시 | Naver 애플리케이션 ID / Secret |

> `.env.local`은 **Git에 커밋하지 마세요.** 비밀키가 유출될 수 있습니다.

---

## 9. 현재 TODO 목록

구현이 **아직 안 된** 항목입니다. README와 실제 코드 기준입니다.

### 페이지 / 기능

- [ ] `/learning` — 한자 학습 목록·상세 UI
- [ ] `/test` — 시험/퀴즈 플로우
- [ ] `/game` — 미니게임 (card, speed, word, character)
- [ ] `/shop` — 코인으로 아이템 구매
- [ ] `/admin` — 관리자 CRUD (한자·퀴즈·보상 관리)
- [ ] 출석 체크 API 및 `Attendance` 연동
- [ ] 게임 점수 저장 API (`GameScore`)

### API / 데이터

- [ ] Hanja / Quiz / GameReward REST 또는 Server Actions
- [ ] 한자 검색 (text index 활용)
- [ ] 시드 데이터 스크립트 (초기 한자·퀴즈)

### 인증 / UX

- [ ] Kakao/Naver 이메일 미제공 시 안내 UX 개선
- [ ] 프로필 수정 (`UserProfileSchema` 연동)
- [ ] 다크 모드 토글 UI

### DevOps / 품질

- [ ] `.env.local.example` 템플릿 파일 추가
- [ ] E2E 테스트 (로그인·middleware)
- [ ] ESLint/CI 파이프라인

---

## 10. 향후 개발 계획

### Phase 1 — 학습 코어

1. Hanja CRUD API + 학습 페이지 (`/learning`)
2. 학년·난이도 필터, 한자 카드 UI
3. Quiz 풀이 및 정답 채점

### Phase 2 — 게임 & 보상

1. 미니게임 1종 MVP (`/game`)
2. `GameScore` 저장, EXP/코인 지급
3. 출석 보상 (`Attendance`, `streak` 갱신)
4. 상점·아바타/집 꾸미기 (`/shop`, `GameReward`)

### Phase 3 — 운영 & 확장

1. 관리자 대시보드 (`/admin`)
2. 학습 통계, 리더보드
3. PWA / 모바일 UX 최적화
4. 배포 (Vercel + Atlas)

---

## 스크립트

```bash
yarn dev      # 개발 서버
yarn build    # 프로덕션 빌드
yarn start    # 프로덕션 서버
yarn lint     # ESLint
```

---

## 라이선스

이 프로젝트는 MVP 단계의 비공개(private) 프로젝트입니다.  
배포·상용화 전 라이선스 정책을 별도로 정하세요.

---

**문의 / 기여**  
이슈나 PR은 저장소 정책에 따라 진행하면 됩니다.  
로컬에서 막히면 `MONGODB_URI`, OAuth 리다이렉트 URI, `NEXTAUTH_SECRET` 설정을 먼저 확인하세요.
