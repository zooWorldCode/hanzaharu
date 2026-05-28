import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import { DEMO_AUTH_COOKIE, isDemoAuthCookie } from "@/lib/demo-auth";

const { auth } = NextAuth(authConfig);

const protectedPrefixes = ["/learning", "/test", "/game", "/mypage", "/shop"];

function hasAppAccess(
  isLoggedIn: boolean,
  demoCookie: string | undefined,
): boolean {
  return isLoggedIn || isDemoAuthCookie(demoCookie);
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const demoCookie = req.cookies.get(DEMO_AUTH_COOKIE)?.value;
  const canAccess = hasAppAccess(isLoggedIn, demoCookie);

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/403", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !canAccess) {
    const loginUrl = new URL("/", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/learning/:path*",
    "/test/:path*",
    "/game/:path*",
    "/mypage/:path*",
    "/shop/:path*",
    "/admin/:path*",
  ],
};
