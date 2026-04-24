import { cn } from "@/lib/cn";

export default function SectionHeader({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-slate-500 text-lg">{subtitle}</p>
      )}
    </div>
  );
}
