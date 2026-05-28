"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MAIN_TABS,
  MAIN_TAB_LABELS,
  MAIN_TAB_PATHS,
  type MainTabId,
} from "@/lib/main-tabs";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[1280px] -translate-x-1/2 border-t-2 border-gray-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
      aria-label="메인 메뉴"
    >
      <div className="mx-auto flex items-stretch justify-around gap-1">
        {MAIN_TABS.map((tab) => {
          const href = MAIN_TAB_PATHS[tab];
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={tab}
              href={href}
              className={cn(
                "flex min-h-14 min-w-[4.5rem] flex-1 flex-col items-center justify-center rounded-2xl px-2 text-sm font-bold transition-colors",
                isActive
                  ? "bg-[#57B72A]/15 text-[#3d8a1c]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <TabIcon tab={tab} active={isActive} />
              <span className="mt-0.5">{MAIN_TAB_LABELS[tab]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TabIcon({ tab, active }: { tab: MainTabId; active: boolean }) {
  const icons: Record<MainTabId, string> = {
    learning: "📖",
    test: "✏️",
    game: "🎮",
    mypage: "🏡",
  };

  return (
    <span className={cn("text-xl", active && "scale-110")} aria-hidden>
      {icons[tab]}
    </span>
  );
}
