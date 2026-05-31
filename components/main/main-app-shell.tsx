"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { BottomTabBar } from "@/components/main/bottom-tab-bar";
import { TopActionBar } from "@/components/main/top-action-bar";
import { SettingsSheet } from "@/components/settings/settings-sheet";
import { LearningTypeProvider } from "@/lib/learning-type-context";
import { TOP_ACTIONS, RANKING_ROUTE_ACTION, getTabFromPath } from "@/lib/main-tabs";
import { UserStateProvider } from "@/lib/user-state-context";
import { cn } from "@/lib/utils";

type MainAppShellProps = {
  children: React.ReactNode;
};

export function MainAppShell({ children }: MainAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = getTabFromPath(pathname);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!currentTab) {
    return <>{children}</>;
  }

  const isRankingPage = pathname === "/game/ranking";
  const topConfig = currentTab
    ? isRankingPage
      ? RANKING_ROUTE_ACTION
      : TOP_ACTIONS[currentTab]
    : null;

  const handleTopAction = (buttonId: string) => {
    if (buttonId === "back") {
      router.back();
      return;
    }
    if (buttonId === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (buttonId === "ranking") {
      router.push("/game/ranking");
      return;
    }
    if (buttonId === "home") {
      router.push("/learning");
      return;
    }
    if (buttonId === "help") {
      return;
    }
  };

  return (
    <UserStateProvider>
      <LearningTypeProvider>
        <div
          className={cn(
            "relative mx-auto min-h-dvh w-full max-w-[1280px]",
            "bg-[#F4FAF0]",
          )}
        >
          {topConfig && <TopActionBar config={topConfig} onAction={handleTopAction} />}

          <div className="min-h-dvh pb-24 pt-20">{children}</div>

          <BottomTabBar />

          <AnimatePresence>
            {settingsOpen && (
              <SettingsSheet onClose={() => setSettingsOpen(false)} />
            )}
          </AnimatePresence>
        </div>
      </LearningTypeProvider>
    </UserStateProvider>
  );
}
