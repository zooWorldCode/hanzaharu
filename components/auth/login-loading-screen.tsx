"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HanzaHaruLogo } from "@/components/brand/hanza-haru-logo";
import { Progress } from "@/components/ui/progress";
import { setDemoAuthCookie } from "@/lib/demo-auth";

const LOADING_DURATION_MS = 2800;

export function LoginLoadingScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(elapsed / LOADING_DURATION_MS, 1);
      const eased = 1 - (1 - ratio) ** 2;
      setProgress(Math.round(eased * 100));

      if (ratio < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      setDemoAuthCookie();
      router.replace("/learning");
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [router]);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <motion.div
        className="flex flex-1 flex-col items-center justify-center gap-6 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <HanzaHaruLogo size="lg" />
        <p className="text-lg font-semibold text-gray-700">
          한자하루를 준비하고 있어요
        </p>
        <p className="text-3xl font-bold tabular-nums text-[#57B72A]">
          {progress}%
        </p>
      </motion.div>

      <div className="px-6 pb-10 pt-4">
        <Progress
          value={progress}
          className="h-4 rounded-full bg-gray-200 [&_[data-slot=progress-indicator]]:bg-[#57B72A]"
        />
      </div>
    </div>
  );
}
