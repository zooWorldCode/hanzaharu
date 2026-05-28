import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MainAppShell } from "@/components/main/main-app-shell";
import { DEMO_AUTH_COOKIE, isDemoAuthCookie } from "@/lib/demo-auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const isDemo = isDemoAuthCookie(cookieStore.get(DEMO_AUTH_COOKIE)?.value);

  if (!session?.user && !isDemo) {
    redirect("/");
  }

  return <MainAppShell>{children}</MainAppShell>;
}
