export const MAIN_TABS = [
  "learning",
  "test",
  "game",
  "mypage",
] as const;

export type MainTabId = (typeof MAIN_TABS)[number];

export const MAIN_TAB_PATHS: Record<MainTabId, string> = {
  learning: "/learning",
  test: "/test",
  game: "/game",
  mypage: "/mypage",
};

export const MAIN_TAB_LABELS: Record<MainTabId, string> = {
  learning: "학습",
  test: "시험",
  game: "게임",
  mypage: "마이페이지",
};

export type TopActionButton = {
  id: string;
  label: string;
  ariaLabel: string;
};

export type TopActionConfig = {
  left: TopActionButton;
  showStatus?: boolean;      // 상태 필(🔥💰) + 초록 버튼
  showGreenStyle?: boolean;  // 상태 필 없이 초록 버튼만
  centerTitle?: string;      // 중앙 타이틀 텍스트
  right: TopActionButton[];
};

export const RANKING_ROUTE_ACTION: TopActionConfig = {
  left: { id: "back", label: "‹", ariaLabel: "뒤로가기" },
  centerTitle: "순위",
  right: [{ id: "help", label: "?", ariaLabel: "도움말" }],
};

export const TOP_ACTIONS: Record<MainTabId, TopActionConfig> = {
  learning: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showStatus: true,
    right: [{ id: "menu", label: "☰", ariaLabel: "메뉴" }],
  },
  test: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showStatus: true,
    right: [{ id: "menu", label: "☰", ariaLabel: "메뉴" }],
  },
  game: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showGreenStyle: true,
    right: [{ id: "ranking", label: "🏆", ariaLabel: "등수" }],
  },
  mypage: {
    left: { id: "home", label: "🏠", ariaLabel: "홈" },
    right: [
      { id: "edit", label: "✏", ariaLabel: "편집" },
      { id: "settings", label: "⚙", ariaLabel: "설정" },
    ],
  },
};

export function getTabFromPath(pathname: string): MainTabId | null {
  if (pathname === MAIN_TAB_PATHS.learning || pathname.startsWith("/learning/")) {
    return "learning";
  }
  if (pathname === MAIN_TAB_PATHS.test || pathname.startsWith("/test/")) {
    return "test";
  }
  if (pathname === MAIN_TAB_PATHS.game || pathname.startsWith("/game/")) {
    return "game";
  }
  if (pathname === MAIN_TAB_PATHS.mypage || pathname.startsWith("/mypage/")) {
    return "mypage";
  }
  return null;
}

export function getTabIndex(tab: MainTabId): number {
  return MAIN_TABS.indexOf(tab);
}

export function getAdjacentTab(
  tab: MainTabId,
  direction: "prev" | "next",
): MainTabId | null {
  const index = getTabIndex(tab);
  if (direction === "prev" && index > 0) {
    return MAIN_TABS[index - 1] ?? null;
  }
  if (direction === "next" && index < MAIN_TABS.length - 1) {
    return MAIN_TABS[index + 1] ?? null;
  }
  return null;
}
