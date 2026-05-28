import Link from "next/link";
import { AuthButton } from "@/components/layout/auth-button";

const navItems = [
  { label: "학습", href: "/learning" },
  { label: "시험", href: "/test" },
  { label: "게임", href: "/game" },
  { label: "마이페이지", href: "/mypage" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90"
        >
          HanzaHaru
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <AuthButton />
      </div>
    </header>
  );
}
