import { cn } from "@/lib/cn";
import type { Experience } from "@/data/experience";

const typeColors: Record<Experience["type"], string> = {
  research: "bg-pastel-blue border-pastel-blue",
  industry: "bg-pastel-green border-pastel-green",
  leadership: "bg-surface-muted border-surface-border",
  writing: "bg-amber-100 border-amber-300",
};

export default function TimelineItem({
  role,
  org,
  department,
  location,
  start,
  end,
  bullets,
  type,
  isLast,
}: Experience & { isLast?: boolean }) {
  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center pt-1">
        <div className={cn("w-3 h-3 rounded-full border-2 shrink-0", typeColors[type])} />
        {!isLast && <div className="w-px flex-1 bg-surface-border mt-1" />}
      </div>

      {/* Content */}
      <div className={cn("pb-8", isLast && "pb-0")}>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
          <h2 className="font-semibold text-slate-800">{role}</h2>
          <span className="text-slate-400 text-sm">·</span>
          <span className="text-slate-700 text-sm font-medium">{org}</span>
        </div>
        {department && (
          <p className="text-xs text-slate-500 mb-1 italic">{department}</p>
        )}
        <p className="text-xs text-slate-400 mb-3">
          {start} – {end} &middot; {location}
        </p>
        <ul className="space-y-1.5">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
              <span className="mt-2 w-1 h-1 rounded-full bg-slate-300 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
