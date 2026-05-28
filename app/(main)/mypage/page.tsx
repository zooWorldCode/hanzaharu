import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MypageView } from "@/components/mypage/mypage-view";
import { DEMO_AUTH_COOKIE, isDemoAuthCookie } from "@/lib/demo-auth";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function MyPage() {
  const session = await auth();
  const cookieStore = await cookies();
  const isDemo = isDemoAuthCookie(cookieStore.get(DEMO_AUTH_COOKIE)?.value);

  if (!session?.user && !isDemo) {
    redirect("/login?callbackUrl=/mypage");
  }

  if (session?.user?.email) {
    await connectDB();
    const dbUser = await User.findOne({
      email: session.user.email.toLowerCase(),
    }).lean();

    return (
      <MypageView
        profile={{
          name: dbUser?.name ?? session.user.name ?? "사용자",
          level: dbUser?.level ?? session.user.level ?? 1,
          coins: dbUser?.coins ?? session.user.coins ?? 0,
        }}
      />
    );
  }

  return (
    <MypageView
      profile={{
        name: "한자 친구",
        level: 1,
        coins: 100,
      }}
    />
  );
}
