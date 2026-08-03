"use client";

import { useEffect, useState } from "react";

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

export default function TypingTest({
  target,
  onPass,
}: {
  target: string;
  onPass: () => void;
}) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (typed && norm(typed) === norm(target)) onPass();
  }, [typed, target, onPass]);

  const done = Math.min(typed.length, target.length);
  const correct = [...target.slice(0, done)].filter(
    (c, i) => c.toLowerCase() === typed[i]?.toLowerCase()
  ).length;
  const pct = Math.round((correct / target.length) * 100);

  return (
    <div>
      <p className="mb-2 text-sm text-muted">Type this to unlock today:</p>
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
        onChange={(e) => setTyped(e.target.value)}
        autoFocus
        rows={4}
        placeholder="start typing…"
        className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <p className="mt-2 text-right font-mono text-[11px] uppercase tracking-wider text-faint">
        {pct}% match
      </p>
    </div>
  );
}
