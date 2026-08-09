"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";
import type { LatLng } from "@/lib/distance";
import type { Spot } from "./SpotsMap";

// Leaflet touches `window`, so load the map client-only.
const SpotsMap = dynamic(() => import("./SpotsMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full rounded-2xl border border-border bg-surface-muted" />
  ),
});

const BERKELEY: LatLng = { lat: 37.8715, lng: -122.273 };

export default function NicheSpotsReveal({
  dayId,
  intro,
  center = BERKELEY,
  radiusMi = 20,
  target = 5,
}: {
  dayId: string;
  intro?: string;
  center?: LatLng;
  radiusMi?: number;
  target?: number;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [pending, setPending] = useState<{ lat: number; lng: number } | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Spots are stored as JSON in chat messages (reuses the chat Firebase rule).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Spot[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o && o.kind === "spot") {
              parsed.push({ id: m.id, lat: o.lat, lng: o.lng, name: o.name });
            }
          } catch {
            /* ignore non-spot messages */
          }
        }
        setSpots(parsed);
      }),
    [dayId]
  );

  async function savePending() {
    const p = pending;
    const n = name.trim();
    if (!p || !n) return;
    setPending(null);
    setName("");
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind: "spot", lat: p.lat, lng: p.lng, name: n }),
    });
  }

  const done = spots.length;

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      <div className="mb-2 flex items-center gap-2">
        <MapPin size={14} className="text-accent" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {done} / {target} spots
        </span>
        <span className="ml-auto text-xs text-faint">tap the map to drop a pin</span>
      </div>

      <SpotsMap
        center={center}
        radiusMi={radiusMi}
        spots={spots}
        pending={pending}
        onPick={(lat, lng) => {
          setPending({ lat, lng });
          setName("");
        }}
        onRemove={(s) => s.id && deleteChatMessage(dayId, s.id)}
      />

      {/* Naming a freshly dropped pin */}
      {pending && (
        <div className="mt-3 flex items-center gap-2">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") savePending();
              if (e.key === "Escape") setPending(null);
            }}
            placeholder="what's this spot called?"
            className="min-w-0 flex-1 rounded-full border border-accent bg-background px-4 py-2 text-foreground outline-none"
          />
          <button
            onClick={savePending}
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            add
          </button>
          <button
            onClick={() => setPending(null)}
            className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted hover:text-accent"
          >
            cancel
          </button>
        </div>
      )}

      {/* The list of dropped spots */}
      {spots.length > 0 && (
        <ol className="mt-4 space-y-1.5">
          {spots.map((s, i) => (
            <li key={s.id ?? i} className="group flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] text-white">
                {i + 1}
              </span>
              <span className="text-foreground">{s.name}</span>
              <button
                onClick={() => s.id && deleteChatMessage(dayId, s.id)}
                className="ml-auto font-mono text-[10px] uppercase tracking-wider text-faint opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
              >
                remove
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
