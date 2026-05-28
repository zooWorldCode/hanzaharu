import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/models/User";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
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
} satisfies NextAuthConfig;

export default authConfig;
