import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      level: number;
      exp: number;
      coins: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    level?: number;
    exp?: number;
    coins?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    level?: number;
    exp?: number;
    coins?: number;
  }
}
