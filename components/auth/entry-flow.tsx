"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoginForm } from "@/components/auth/login-form";
import { SplashScreen } from "@/components/auth/splash-screen";

const SPLASH_DURATION_MS = 2500;

type EntryFlowProps = {
  callbackUrl: string;
  error?: string;
};

export function EntryFlow({ callbackUrl, error }: EntryFlowProps) {
  const [phase, setPhase] = useState<"splash" | "login">("splash");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPhase("login");
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "splash" ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <SplashScreen />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          className="min-h-dvh"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <LoginForm
            callbackUrl={callbackUrl}
            error={error}
            animateEntrance
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
