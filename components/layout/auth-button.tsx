import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

export async function AuthButton() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/mypage">마이페이지</Link>
        </Button>
        <SignOutButton />
      </div>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/login">로그인</Link>
    </Button>
  );
}
