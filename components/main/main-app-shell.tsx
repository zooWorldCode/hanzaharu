"use client";

import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BottomTabBar } from "@/components/main/bottom-tab-bar";
import { TopActionBar } from "@/components/main/top-action-bar";
import { LearningTypeProvider } from "@/lib/learning-type-context";
import {
  getTabFromPath,
  TOP_ACTIONS,
} from "@/lib/main-tabs";

type MainAppShellProps = {
  children: React.ReactNode;
};

export function MainAppShell({ children }: MainAppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab = getTabFromPath(pathname);

  if (!currentTab) {
    return <>{children}</>;
  }

  const handleTopAction = (buttonId: string) => {
    if (buttonId === "home") {
      router.push("/learning");
      return;
    }
    if (buttonId === "back") {
      router.push("/");
      return;
    }
  };

  return (
    <LearningTypeProvider>
    <div className="relative mx-auto min-h-dvh w-full max-w-[1280px] bg-green-50 md:bg-pink-50">
      <TopActionBar
        config={TOP_ACTIONS[currentTab]}
        onAction={handleTopAction}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          className="min-h-dvh pb-24 pt-20"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <BottomTabBar />
    </div>
    </LearningTypeProvider>
  );
}
