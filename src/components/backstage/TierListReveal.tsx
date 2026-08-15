"use client";

import { useEffect, useRef, useState } from "react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

// Wingstop's signature flavors.
const FLAVORS = [
  "Original Hot",
  "Cajun",
  "Louisiana Rub",
  "Garlic Parmesan",
  "Lemon Pepper",
  "Hickory Smoked BBQ",
  "Mild",
  "Atomic",
  "Mango Habanero",
  "Korean Q",
  "Hawaiian",
  "Plain",
];

const TIERS: { key: string; color: string }[] = [
  { key: "S", color: "#ff7f7f" },
  { key: "A", color: "#ffbf7f" },
  { key: "B", color: "#ffe07f" },
  { key: "C", color: "#a7e08c" },
  { key: "D", color: "#8cc5ff" },
];

type Assign = Record<string, string>; // flavor -> tier key ("" = tray)

export default function TierListReveal({
  dayId,
  intro,
}: {
  dayId: string;
  intro?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [assign, setAssign] = useState<Assign>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const msgIdRef = useRef<string | null>(null); // the saved tierlist message id
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Load the saved tier list once (then local state is the source of truth).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        let latest: { id?: string; assign: Assign } | null = null;
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o?.kind === "tierlist") latest = { id: m.id, assign: o.assign ?? {} };
          } catch {
            /* ignore */
          }
        }
        if (latest) msgIdRef.current = latest.id ?? null;
        setLoaded((was) => {
          if (!was && latest) setAssign(latest.assign);
          return true;
        });
      }),
    [dayId]
  );

  function persist(next: Assign) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const prevId = msgIdRef.current;
      const res = await sendChatMessage(dayId, {
        from: me,
        text: JSON.stringify({ kind: "tierlist", assign: next }),
      });
      // Point at the new message, then remove the old one.
      const newId = (res as { key?: string } | undefined)?.key ?? null;
      if (newId) msgIdRef.current = newId;
      if (prevId && prevId !== newId) await deleteChatMessage(dayId, prevId);
    }, 500);
  }

  function place(tier: string) {
    if (!picked) return;
    const next = { ...assign, [picked]: tier };
    setAssign(next);
    setPicked(null);
    persist(next);
  }

  const tray = FLAVORS.filter((f) => !assign[f]);

  function Chip({ flavor }: { flavor: string }) {
    const isPicked = picked === flavor;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPicked(isPicked ? null : flavor);
        }}
        className={
          "rounded-full border px-2.5 py-1 text-xs font-medium transition-all " +
          (isPicked
            ? "scale-105 border-accent bg-accent text-white shadow"
            : "border-border bg-surface text-foreground hover:border-accent/50")
        }
      >
        {flavor}
      </button>
    );
  }

  return (
    <div onClick={() => setPicked(null)}>
      {intro && <p className="mb-3 leading-relaxed text-foreground/90">{intro}</p>}
      <p className="mb-3 text-xs text-faint">
        {picked ? (
          <span className="text-accent">
            placing “{picked}” — tap a tier (or the tray) ↓
          </span>
        ) : (
          "tap a flavor, then tap a tier to rank it"
        )}
      </p>

      {/* Tiers */}
      <div className="overflow-hidden rounded-2xl border border-border">
        {TIERS.map((t) => (
          <div
            key={t.key}
            className="flex min-h-[3.25rem] items-stretch border-b border-border last:border-b-0"
          >
            <div
              className="flex w-11 shrink-0 items-center justify-center font-serif text-lg font-bold text-black/80"
              style={{ background: t.color }}
            >
              {t.key}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                place(t.key);
              }}
              className={
                "flex flex-1 flex-wrap content-start items-start gap-1.5 p-2 " +
                (picked ? "cursor-copy bg-accent-soft/40" : "")
              }
            >
              {FLAVORS.filter((f) => assign[f] === t.key).map((f) => (
                <Chip key={f} flavor={f} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tray */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          place("");
        }}
        className={
          "mt-3 rounded-2xl border border-dashed border-border p-3 " +
          (picked ? "cursor-copy bg-accent-soft/40" : "")
        }
      >
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-faint">
          unranked
        </p>
        {tray.length === 0 ? (
          <p className="text-xs text-faint">all ranked 🔥</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tray.map((f) => (
              <Chip key={f} flavor={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
