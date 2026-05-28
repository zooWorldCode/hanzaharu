"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HanzaHaruLogo } from "@/components/brand/hanza-haru-logo";
import { SocialLoginCircles } from "@/components/auth/social-login-circles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  callbackUrl: string;
  error?: string;
  animateEntrance?: boolean;
};

export function LoginForm({
  callbackUrl,
  error,
  animateEntrance = true,
}: LoginFormProps) {
  const router = useRouter();

  const handleDemoLogin = () => {
    router.push("/loading");
  };

  const cardContent = (
    <Card className="w-full max-w-lg rounded-3xl border-2 border-gray-200 bg-white shadow-md">
      <CardContent className="flex flex-col gap-5 px-6 py-8 sm:px-8">
        <motion.div
          className="flex justify-center pt-2"
          initial={animateEntrance ? { opacity: 0, y: -12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <HanzaHaruLogo size="lg" />
        </motion.div>

        <motion.div
          className="flex flex-col gap-4"
          initial={animateEntrance ? { opacity: 0, y: -8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        >
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            autoComplete="email"
            className="h-14 rounded-2xl border-gray-300 bg-gray-50 px-4 text-base md:text-base"
          />
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            className="h-14 rounded-2xl border-gray-300 bg-gray-50 px-4 text-base md:text-base"
          />
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500"
          initial={animateEntrance ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <button
            type="button"
            className="min-h-11 transition-colors hover:text-gray-900"
          >
            이메일 찾기
          </button>
          <span className="text-gray-300" aria-hidden>
            |
          </span>
          <button
            type="button"
            className="min-h-11 transition-colors hover:text-gray-900"
          >
            비밀번호 찾기
          </button>
        </motion.div>

        {error === "EmailRequired" && (
          <p className="rounded-2xl border border-gray-300 bg-gray-100 px-4 py-3 text-center text-sm text-gray-900">
            이메일 제공에 동의해야 로그인할 수 있습니다.
          </p>
        )}

        <motion.div
          className="flex flex-col gap-3"
          initial={animateEntrance ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          <Button
            type="button"
            onClick={handleDemoLogin}
            className="h-14 w-full rounded-2xl bg-[#57B72A] text-lg font-bold text-white hover:bg-[#4aa323]"
          >
            로그인
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 hover:bg-gray-50"
          >
            회원가입
          </Button>
        </motion.div>

        <SocialLoginCircles callbackUrl={callbackUrl} />

        <motion.p
          className="text-center text-xs text-gray-500"
          initial={animateEntrance ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          © 2026 HanzaHaru. All rights reserved.
        </motion.p>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      className="flex min-h-dvh w-full flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100"
      initial={animateEntrance ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-8 md:px-6">
        <motion.div
          className="flex flex-1 flex-col justify-center"
          initial={animateEntrance ? { y: -48, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 28,
            mass: 0.8,
          }}
        >
          {cardContent}
        </motion.div>

        <motion.div
          className="flex justify-center pb-4 pt-6"
          initial={animateEntrance ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <HanzaHaruLogo size="sm" className="opacity-60" />
        </motion.div>
      </div>
    </motion.div>
  );
}
