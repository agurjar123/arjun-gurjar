import { cn } from "@/lib/cn";

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
  className,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10", className)}>
      {eyebrow && (
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="mt-3 text-lg text-muted leading-relaxed">{subtitle}</p>}
    </div>
  );
}
