import { cn } from "@/lib/utils";

type HanzaHaruLogoProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
} as const;

export function HanzaHaruLogo({ size = "md", className }: HanzaHaruLogoProps) {
  return (
    <span
      className={cn(
        "inline-block font-bold tracking-tight text-[#57B72A]",
        sizeClasses[size],
        className,
      )}
      aria-label="HanzaHaru"
    >
      HanzaHaru
    </span>
  );
}
