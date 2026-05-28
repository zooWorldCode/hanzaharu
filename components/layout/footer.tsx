import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} HanzaHaru. All rights reserved.</p>
        <Link
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium transition-colors hover:text-foreground"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
