import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "@/auth.config";
import KakaoProvider from "@/lib/auth/providers/kakao";
import NaverProvider from "@/lib/auth/providers/naver";
import connectDB from "@/lib/mongodb";
import { getMongoClient } from "@/lib/mongodb-client";
import User from "@/lib/models/User";
import type { UserRole } from "@/lib/models/User";

async function syncGameUser(
  email: string,
  name?: string | null,
  image?: string | null,
) {
  await connectDB();
  const normalizedEmail = email.toLowerCase();

  return User.findOneAndUpdate(
    { email: normalizedEmail },
    {
      $set: {
        name: name ?? "사용자",
        ...(image ? { image } : {}),
      },
      $setOnInsert: {
        email: normalizedEmail,
        role: "user" as UserRole,
        level: 1,
        exp: 0,
        coins: 0,
        streak: 0,
        avatarItems: [],
        houseItems: [],
      },
    },
    { upsert: true, new: true },
  );
}

async function enrichTokenFromDb(email: string) {
  await connectDB();
  const dbUser = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!dbUser) return null;

  return {
    id: String(dbUser._id),
    role: dbUser.role as UserRole,
    level: dbUser.level,
    exp: dbUser.exp,
    coins: dbUser.coins,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(() => getMongoClient()),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return account?.provider === "kakao" || account?.provider === "naver"
          ? "/login?error=EmailRequired"
          : false;
      }

      await syncGameUser(user.email, user.name, user.image);
      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (!email) return token;

      const profile = await enrichTokenFromDb(email);
      if (profile) {
        token.id = profile.id;
        token.role = profile.role;
        token.level = profile.level;
        token.exp = profile.exp;
        token.coins = profile.coins;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? "user";
        session.user.level = (token.level as number) ?? 1;
        session.user.exp = (token.exp as number) ?? 0;
        session.user.coins = (token.coins as number) ?? 0;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user.email) {
        await syncGameUser(user.email, user.name, user.image);
      }
    },
  },
});
