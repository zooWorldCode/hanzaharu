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
  showStatus?: boolean;      // 상태 필(티켓+코인) + 초록 버튼
  showStatusPills?: boolean; // 티켓/코인 상태 필 표시 여부
  showGreenStyle?: boolean;  // 상태 필 없이 초록 버튼만
  showCoinsOnly?: boolean;   // 코인 필만 중앙에 표시 (버튼 색상은 기본 유지)
  centerTitle?: string;      // 중앙 타이틀 텍스트
  rightCoinWidget?: boolean; // 우측에 코인잔액 + [+] 위젯 표시
  right: TopActionButton[];
};

export const RANKING_ROUTE_ACTION: TopActionConfig = {
  left: { id: "back", label: "‹", ariaLabel: "뒤로가기" },
  centerTitle: "순위",
  right: [{ id: "help", label: "?", ariaLabel: "도움말" }],
};

export const CUSTOMIZE_ROUTE_ACTION: TopActionConfig = {
  left: { id: "back", label: "‹", ariaLabel: "뒤로가기" },
  centerTitle: "꾸미기",
  right: [{ id: "shop", label: "🏪", ariaLabel: "상점" }],
};

export const SHOP_ROUTE_ACTION: TopActionConfig = {
  left: { id: "back", label: "‹", ariaLabel: "뒤로가기" },
  centerTitle: "상점",
  rightCoinWidget: true,
  right: [],
};

export const TOP_ACTIONS: Record<MainTabId, TopActionConfig> = {
  learning: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showStatus: true,
    showStatusPills: false,
    right: [{ id: "menu", label: "☰", ariaLabel: "메뉴" }],
  },
  test: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showStatus: true,
    showStatusPills: false,
    right: [{ id: "menu", label: "☰", ariaLabel: "메뉴" }],
  },
  game: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showGreenStyle: true,
    right: [{ id: "ranking", label: "🏆", ariaLabel: "등수" }],
  },
  mypage: {
    left: { id: "settings", label: "⚙", ariaLabel: "설정" },
    showCoinsOnly: true,
    right: [{ id: "photo", label: "📷", ariaLabel: "사진 저장" }],
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
