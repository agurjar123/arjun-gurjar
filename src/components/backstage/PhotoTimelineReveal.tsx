"use client";

import { Video } from "lucide-react";

type Item = { src: string; date: string };

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function PhotoTimelineReveal({
  intro,
  items,
}: {
  intro?: string;
  items: Item[];
}) {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      {/* FaceTime header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#34c759] text-white shadow">
          <Video size={16} />
        </span>
        <div>
          <p className="font-serif text-lg font-semibold leading-tight text-foreground">
            our facetimes
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-faint">
            {sorted.length} moments · across the distance
          </p>
        </div>
      </div>

      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      {/* Vertical timeline */}
      <div className="relative pl-6">
        {/* rail */}
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />

        <div className="space-y-6">
          {sorted.map((it, i) => (
            <div key={it.src + i} className="relative">
              {/* node */}
              <span className="absolute -left-6 top-1.5 flex h-3.5 w-3.5 items-center justify-center">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-[#34c759] bg-surface" />
              </span>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent">
                {fmt(it.date)}
              </p>
              <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-[var(--shadow-card)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.src}
                  alt={fmt(it.date)}
                  loading="lazy"
                  className="block max-h-[60vh] w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
