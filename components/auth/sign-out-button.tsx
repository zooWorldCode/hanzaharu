"use client";

import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "/" });
      }}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        "로그아웃"
      )}
    </Button>
  );
}
