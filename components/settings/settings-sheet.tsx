"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ══════════════════════════════════════════════
   타입
══════════════════════════════════════════════ */
type SettingsSheetProps = {
  onClose: () => void;
};

/* ══════════════════════════════════════════════
   공통 UI 조각
══════════════════════════════════════════════ */

function SectionHeader({ title }: { title: string }) {
  return (
    <p className="mb-1 mt-5 px-1 text-[11px] font-bold uppercase tracking-widest text-gray-400 first:mt-0">
      {title}
    </p>
  );
}

function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-gray-100" />;
}

/* 화살표 행 */
function ArrowRow({
  icon,
  label,
  value,
  danger = false,
  onClick,
}: {
  icon: string;
  label: string;
  value?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-gray-50"
    >
      <span className="text-lg">{icon}</span>
      <span className={cn("flex-1 text-sm font-semibold", danger ? "text-red-500" : "text-gray-800")}>
        {label}
      </span>
      {value && <span className="mr-1 text-xs text-gray-400">{value}</span>}
      <span className="text-gray-400">›</span>
    </button>
  );
}

/* 토글 행 */
function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-sm font-semibold text-gray-800">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-200",
          value ? "bg-[#4A9B2F]" : "bg-gray-300 dark:bg-gray-600",
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
          style={{ left: value ? "calc(100% - 1.375rem)" : "0.125rem" }}
        />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   설정 메인 컴포넌트
══════════════════════════════════════════════ */

export function SettingsSheet({ onClose }: SettingsSheetProps) {
  // Preferences
  const [sound, setSound]       = useState(true);
  const [vibration, setVibration] = useState(true);
  const [darkMode, setDarkMode]   = useState(false);
  const [fontSize, setFontSize]   = useState<"small" | "medium" | "large">("medium");

  // Notifications
  const [studyReminder, setStudyReminder] = useState(true);
  const [examAlert, setExamAlert]         = useState(true);
  const [eventAlert, setEventAlert]       = useState(false);

  // Privacy
  const [dataCollection, setDataCollection] = useState(true);
  const [personalized, setPersonalized]     = useState(true);

  const fontLabels = { small: "작게", medium: "중간", large: "크게" };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#F2F2F7]"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-3 bg-[#F2F2F7] px-4 pb-3 pt-14 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 active:bg-gray-300"
          aria-label="닫기"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">설정</h1>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-12 pt-2">

        {/* ── Preferences ── */}
        <SectionHeader title="Preferences" />
        <SettingCard>
          <ArrowRow icon="🌐" label="언어" value="한국어" />
          <Divider />
          <ToggleRow icon="🔊" label="효과음" value={sound} onChange={setSound} />
          <Divider />
          <ToggleRow icon="📳" label="진동" value={vibration} onChange={setVibration} />
          <Divider />
          <ToggleRow icon="🌙" label="다크모드" value={darkMode} onChange={setDarkMode} />
          <Divider />
          <ArrowRow icon="🔤" label="글자 크기" value={fontLabels[fontSize]} />
        </SettingCard>

        {/* ── Notifications ── */}
        <SectionHeader title="Notifications" />
        <SettingCard>
          <ToggleRow icon="📚" label="학습 리마인더" value={studyReminder} onChange={setStudyReminder} />
          <Divider />
          <ToggleRow icon="📝" label="시험 알림" value={examAlert} onChange={setExamAlert} />
          <Divider />
          <ToggleRow icon="🎉" label="이벤트 · 공지 알림" value={eventAlert} onChange={setEventAlert} />
        </SettingCard>

        {/* ── Privacy ── */}
        <SectionHeader title="Privacy" />
        <SettingCard>
          <ToggleRow icon="📊" label="데이터 수집 동의" value={dataCollection} onChange={setDataCollection} />
          <Divider />
          <ToggleRow icon="✨" label="개인화 추천" value={personalized} onChange={setPersonalized} />
          <Divider />
          <ArrowRow icon="🔗" label="계정 연동 관리" />
          <Divider />
          <ArrowRow icon="🗑" label="데이터 초기화" danger />
        </SettingCard>

        {/* ── Help Center ── */}
        <SectionHeader title="Help Center" />
        <SettingCard>
          <ArrowRow icon="❓" label="자주 묻는 질문 (FAQ)" />
          <Divider />
          <ArrowRow icon="📖" label="사용 가이드" />
          <Divider />
          <ArrowRow icon="💬" label="문의하기" />
        </SettingCard>

        {/* ── Feedback ── */}
        <SectionHeader title="Feedback" />
        <SettingCard>
          <ArrowRow icon="🐛" label="버그 신고" />
          <Divider />
          <ArrowRow icon="💡" label="기능 제안" />
          <Divider />
          <ArrowRow icon="⭐" label="앱 평가하기" />
        </SettingCard>

        {/* ── Legal ── */}
        <SectionHeader title="Legal" />
        <SettingCard>
          <ArrowRow icon="📄" label="이용약관" />
          <Divider />
          <ArrowRow icon="🔒" label="개인정보처리방침" />
          <Divider />
          <ArrowRow icon="📦" label="오픈소스 라이선스" />
          <Divider />
          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="text-lg">ℹ️</span>
            <span className="flex-1 text-sm font-semibold text-gray-800">버전 정보</span>
            <span className="text-xs text-gray-400">v1.0.0</span>
          </div>
        </SettingCard>

        {/* ── 로그아웃 ── */}
        <div className="mt-5">
          <SettingCard>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full px-4 py-4 text-center text-sm font-bold text-red-500 active:bg-red-50/10"
            >
              로그아웃
            </button>
          </SettingCard>
        </div>

      </div>
    </motion.div>
  );
}
