"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProviderId = "google" | "kakao" | "naver";

const providers: {
  id: ProviderId;
  label: string;
  shortLabel: string;
  bg: string;
  text: string;
}[] = [
  {
    id: "kakao",
    label: "카카오 로그인",
    shortLabel: "K",
    bg: "bg-[#FEE500]",
    text: "text-[#191919]",
  },
  {
    id: "google",
    label: "구글 로그인",
    shortLabel: "G",
    bg: "bg-white",
    text: "text-[#4285F4]",
  },
  {
    id: "naver",
    label: "네이버 로그인",
    shortLabel: "N",
    bg: "bg-[#03C75A]",
    text: "text-white",
  },
];

export function SocialLoginCircles({ callbackUrl }: { callbackUrl: string }) {
  const [loadingProvider, setLoadingProvider] = useState<ProviderId | null>(
    null,
  );

  const handleSignIn = async (provider: ProviderId) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, {
        callbackUrl: callbackUrl.startsWith("/learning") ? callbackUrl : "/learning",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.35 }}
    >
      <p className="text-base font-medium text-gray-500">간편 로그인</p>
      <motion.div
        className="flex items-center justify-center gap-5"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {providers.map((provider) => {
          const isLoading = loadingProvider === provider.id;
          const isDisabled = loadingProvider !== null && !isLoading;

          return (
            <motion.button
              key={provider.id}
              type="button"
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: { opacity: 1, y: 0 },
              }}
              disabled={isDisabled}
              onClick={() => handleSignIn(provider.id)}
              aria-label={provider.label}
              className={cn(
                "flex size-16 items-center justify-center rounded-full border-2 border-gray-200 text-xl font-bold shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60",
                provider.bg,
                provider.text,
              )}
            >
              {isLoading ? (
                <Loader2 className="size-6 animate-spin" aria-hidden />
              ) : (
                provider.shortLabel
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
