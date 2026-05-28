import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EntryFlow } from "@/components/auth/entry-flow";

export default async function EntryPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const redirectTo =
    callbackUrl?.startsWith("/") && callbackUrl !== "/"
      ? callbackUrl
      : "/learning";

  if (session?.user) {
    redirect(redirectTo);
  }

  return <EntryFlow callbackUrl={redirectTo} error={error} />;
}
