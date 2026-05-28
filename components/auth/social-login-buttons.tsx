"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ProviderId = "google" | "kakao" | "naver";

const providers: {
  id: ProviderId;
  label: string;
  bg: string;
  text: string;
  hover: string;
}[] = [
  {
    id: "google",
    label: "Google 로그인",
    bg: "bg-[#4285F4]",
    text: "text-white",
    hover: "hover:bg-[#3367D6]",
  },
  {
    id: "kakao",
    label: "Kakao 로그인",
    bg: "bg-[#FEE500]",
    text: "text-[#191919]",
    hover: "hover:bg-[#F5D900]",
  },
  {
    id: "naver",
    label: "Naver 로그인",
    bg: "bg-[#03C75A]",
    text: "text-white",
    hover: "hover:bg-[#02B350]",
  },
];

export function SocialLoginButtons({ callbackUrl }: { callbackUrl: string }) {
  const [loadingProvider, setLoadingProvider] = useState<ProviderId | null>(
    null,
  );

  const handleSignIn = async (provider: ProviderId) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {providers.map((provider) => {
        const isLoading = loadingProvider === provider.id;

        return (
          <button
            key={provider.id}
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleSignIn(provider.id)}
            className={cn(
              "flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70",
              provider.bg,
              provider.text,
              provider.hover,
            )}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : null}
            {isLoading ? "로그인 중..." : provider.label}
          </button>
        );
      })}
    </div>
  );
}
