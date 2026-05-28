import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTo =
    callbackUrl?.startsWith("/") && callbackUrl !== "/login"
      ? callbackUrl
      : "/learning";

  if (session?.user) {
    redirect(redirectTo);
  }

  return (
    <LoginForm callbackUrl={redirectTo} error={error} animateEntrance />
  );
}
