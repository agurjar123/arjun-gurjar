import { cn } from "@/lib/cn";

type TagVariant = "blue" | "green" | "gray";

const variants: Record<TagVariant, string> = {
  blue: "bg-pastel-blue/30 text-sky-800",
  green: "bg-pastel-green/30 text-green-800",
  gray: "bg-surface-muted text-slate-600",
};

export default function Tag({
  children,
  variant = "gray",
  className,
}: {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full text-xs font-medium px-3 py-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
