"use client";

import { motion } from "framer-motion";
import { HanzaHaruLogo } from "@/components/brand/hanza-haru-logo";

export function SplashScreen() {
  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        <HanzaHaruLogo size="xl" />
        <motion.div
          className="flex items-center gap-2"
          aria-label="로딩 중"
          role="status"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-3 rounded-full bg-[#57B72A]"
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
