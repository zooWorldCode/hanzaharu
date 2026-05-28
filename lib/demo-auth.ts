export const DEMO_AUTH_COOKIE = "hanzaharu-demo-auth";

export function isDemoAuthCookie(value: string | undefined): boolean {
  return value === "true";
}

export function setDemoAuthCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DEMO_AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
}
