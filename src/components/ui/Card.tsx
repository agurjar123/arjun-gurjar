import { cn } from "@/lib/cn";

export default function Card({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface border border-border p-6",
        "shadow-[var(--shadow-card)]",
        hover && "transition-all hover:border-accent/40 hover:shadow-[var(--shadow-soft)]",
        className
      )}
    >
      {children}
    </div>
  );
}
