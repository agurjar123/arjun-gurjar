"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Experience } from "@/data/experience";

const typeColors: Record<Experience["type"], string> = {
  research: "bg-accent border-accent",
  industry: "bg-muted border-muted",
  leadership: "bg-surface-muted border-border",
  writing: "bg-faint border-faint",
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
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4">
      {/* Timeline spine */}
      <div className="flex flex-col items-center pt-1">
        <div className={cn("w-3 h-3 rounded-full border-2 shrink-0", typeColors[type])} />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>

      {/* Content */}
      <div className={cn("pb-8 flex-1 min-w-0", isLast && "pb-0")}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left group"
          aria-expanded={open}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{role}</h2>
                <span className="text-faint text-sm">·</span>
                <span className="text-muted text-sm font-medium">{org}</span>
              </div>
              {department && (
                <p className="text-xs text-muted italic">{department}</p>
              )}
              <p className="font-mono text-xs text-faint mt-0.5">
                {start} – {end} &middot; {location}
              </p>
            </div>
            <ChevronDown
              size={15}
              className={cn(
                "text-faint shrink-0 mt-1 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </button>

        {open && (
          <ul className="space-y-1.5 mt-3">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted leading-relaxed">
                <span className="mt-2 w-1 h-1 rounded-full bg-accent shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
