import { cn } from "@/lib/cn";

// "accent" and "neutral" are the canonical variants; the color names are kept
// as aliases so existing call sites don't need to change.
type TagVariant = "accent" | "neutral" | "blue" | "green" | "gray";

const variants: Record<TagVariant, string> = {
  accent: "bg-accent-soft text-accent",
  neutral: "bg-surface-muted text-muted",
  blue: "bg-accent-soft text-accent",
  green: "bg-surface-muted text-muted border border-border",
  gray: "bg-surface-muted text-muted",
};

export default function Tag({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full font-mono text-[11px] tracking-wide px-3 py-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
