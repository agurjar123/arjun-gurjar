"use client";

import { useEffect, useState } from "react";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import DayReveal from "./DayReveal";
import type { AdventDay } from "@/data/backstage/days";

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

function unlockedByDate(date: string): boolean {
  // Unlocks at local Pacific midnight of `date` (PDT = -07:00 in August).
  return new Date(`${date}T00:00:00-07:00`).getTime() <= Date.now();
}

function label(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function DayCard({
  day,
  solved,
  onSolve,
}: {
  day: AdventDay;
  solved: boolean;
  onSolve: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => setMounted(true), []);

  const dateOpen = mounted && (day.alwaysOpen || unlockedByDate(day.date));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (normalize(value) === normalize(day.crypticAnswer)) {
      onSolve(day.id);
    } else {
      setError(true);
    }
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]",
        solved && "bs-pop",
        !dateOpen && mounted && "opacity-70"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          {label(day.date)}
        </span>
        {solved ? (
          <Check size={15} className="text-accent" />
        ) : !dateOpen && mounted ? (
          <Lock size={14} className="text-faint" />
        ) : null}
      </div>

      <h3 className="font-serif text-xl font-semibold text-foreground">{day.title}</h3>

      {/* Before mount: neutral (matches SSR). After mount: locked / open / solved. */}
      {!mounted ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-faint">…</p>
      ) : solved ? (
        <div className="mt-4">
          <DayReveal day={day} />
        </div>
      ) : !dateOpen ? (
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-faint">
          Unlocks {label(day.date)}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-3">
          <p className="text-sm text-muted">Today&apos;s cryptic answer:</p>
          <div className="flex gap-2">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="answer"
              aria-label={`Answer for ${day.title}`}
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Open
            </button>
          </div>
          {error && <p className="text-sm text-accent">Not it yet — keep going ♡</p>}
          {day.hint && !error && (
            <p className="text-xs text-faint">Hint: {day.hint}</p>
          )}
        </form>
      )}
    </div>
  );
}
