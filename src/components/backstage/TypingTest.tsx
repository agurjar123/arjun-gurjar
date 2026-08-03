"use client";

import { useEffect, useState } from "react";

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
const MIN_WPM = 40;

export default function TypingTest({
  target,
  onPass,
}: {
  target: string;
  onPass: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!typed || start == null) return;
    if (norm(typed) === norm(target)) {
      const minutes = Math.max((Date.now() - start) / 60000, 1 / 6000);
      const wpm = Math.round(target.length / 5 / minutes);
      if (wpm >= MIN_WPM) {
        onPass();
      } else {
        setResult(`${wpm} WPM — you need ${MIN_WPM}. Try again!`);
        setTyped("");
        setStart(null);
      }
    }
  }, [typed, start, target, onPass]);

  function change(v: string) {
    if (start == null && v.length > 0) setStart(Date.now());
    setResult(null);
    setTyped(v);
  }

  const liveWpm =
    start != null && typed.length > 3
      ? Math.round(typed.length / 5 / Math.max((Date.now() - start) / 60000, 1 / 6000))
      : 0;

  return (
    <div>
      <p className="mb-2 text-sm text-muted">
        Type this at <span className="font-semibold text-foreground">{MIN_WPM}+ WPM</span> to
        unlock today:
      </p>
      <div className="rounded-xl border border-border bg-surface-muted p-3 font-mono text-sm leading-relaxed">
        {[...target].map((ch, i) => {
          const t = typed[i];
          const cls =
            t == null
              ? "text-faint"
              : t.toLowerCase() === ch.toLowerCase()
              ? "text-accent"
              : "rounded bg-red-500/15 text-red-500";
          return (
            <span key={i} className={cls}>
              {ch}
            </span>
          );
        })}
      </div>

      <textarea
        value={typed}
        onChange={(e) => change(e.target.value)}
        autoFocus
        rows={4}
        placeholder="start typing…"
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />

      <div className="mt-2 flex items-center justify-between">
        {result ? <p className="text-sm text-red-500">{result}</p> : <span />}
        <p
          className={`font-mono text-[11px] uppercase tracking-wider ${
            liveWpm >= MIN_WPM ? "text-accent" : "text-faint"
          }`}
        >
          {liveWpm} WPM
        </p>
      </div>
    </div>
  );
}
