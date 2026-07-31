"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Maximize2, ChevronDown } from "lucide-react";
import { LANDING_ISO } from "@/data/backstage/days";
import { subscribeTimeline, type TimelineEvent } from "@/lib/firebase";

const LANDING_ID = "__landing";
const LANDING_DATE = "2026-08-17";

type Parts = { d: number; h: number; m: number; s: number; done: boolean };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
    done: ms === 0,
  };
}
const pad = (n: number) => String(n).padStart(2, "0");
const fmt = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

export default function TimelineWidget() {
  const target = new Date(LANDING_ISO).getTime();
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState<Parts | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setT(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  useEffect(() => subscribeTimeline(setEvents), []);

  const items = useMemo(() => {
    const landing: TimelineEvent = {
      id: LANDING_ID,
      date: LANDING_DATE,
      title: "You land 💛",
    };
    // Only captioned moments belong in the compact widget — photo-only entries
    // (no caption) live on the full /backstage/timeline page.
    const titled = events.filter((e) => e.title && e.title.trim());
    return [...titled, landing].sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  if (!mounted || !t) return null;

  const expanded = hovered || pinned;

  return (
    <>
      <div
        className="fixed right-3 top-3 z-[1500] flex w-fit flex-col items-end sm:right-5 sm:top-5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Peak — countdown + an obvious handle that reveals the timeline */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/90 shadow-[var(--shadow-card)] backdrop-blur-sm">
          <button
            onClick={() => setPinned((p) => !p)}
            aria-expanded={expanded}
            className="block px-4 py-2.5 text-right"
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {t.done ? "she's here" : "she lands in"}
            </span>
            <span className="mt-0.5 block font-mono text-sm tabular-nums text-foreground">
              {t.done ? "Welcome home 💛" : `${t.d}d ${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`}
            </span>
          </button>
          <button
            onClick={() => setPinned((p) => !p)}
            className="flex w-full items-center justify-center gap-1 border-t border-border bg-surface-muted/50 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
            our timeline
          </button>
        </div>

        {/* Expanded timeline */}
        <div
          className={`w-72 overflow-hidden transition-all duration-300 ${
            expanded ? "mt-2 max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-2xl border border-border bg-surface/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                our timeline
              </span>
              <Link
                href="/backstage/timeline"
                className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
              >
                <Maximize2 size={11} /> open
              </Link>
            </div>

            <Link
              href="/backstage/timeline"
              className="block"
              aria-label="Open full timeline"
            >
            <ol className="relative ml-1 max-h-[52vh] overflow-y-auto border-l border-border pr-1">
              {items.map((item) => {
                const isLanding = item.id === LANDING_ID;
                return (
                  <li key={item.id} className="relative pb-4 pl-5 last:pb-0">
                    <span
                      className={`absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-surface ${
                        isLanding ? "bg-red-500 bs-pulse" : "bg-accent"
                      }`}
                    />
                    <time className="block font-mono text-[10px] uppercase tracking-wider text-faint">
                      {fmt(item.date)}
                    </time>
                    <p
                      className={`text-sm ${
                        isLanding ? "font-semibold text-foreground" : "text-foreground/90"
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.note && <p className="mt-0.5 text-xs text-muted">{item.note}</p>}
                  </li>
                );
              })}
            </ol>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
