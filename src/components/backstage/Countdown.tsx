"use client";

import { useEffect, useState } from "react";
import { LANDING_ISO } from "@/data/backstage/days";

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

export default function Countdown() {
  const target = new Date(LANDING_ISO).getTime();
  const [t, setT] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setT(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  // Render nothing until the client clock is read (avoids hydration mismatch).
  if (!t) return null;

  return (
    <div className="fixed right-3 top-3 z-40 rounded-2xl border border-border bg-surface/90 px-4 py-2.5 text-right shadow-[var(--shadow-card)] backdrop-blur-sm sm:right-5 sm:top-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        {t.done ? "she's here" : "she lands in"}
      </p>
      {t.done ? (
        <p className="mt-0.5 font-serif text-lg font-semibold text-foreground">
          Welcome home 💛
        </p>
      ) : (
        <p className="mt-0.5 font-mono text-sm text-foreground tabular-nums">
          <span className="font-semibold">{t.d}</span>d{" "}
          {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
        </p>
      )}
    </div>
  );
}
