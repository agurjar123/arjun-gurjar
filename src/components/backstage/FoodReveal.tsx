"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Entry = { id?: string; text: string };

function AddList({
  dayId,
  me,
  kind,
  entries,
  emoji,
  title,
  placeholder,
}: {
  dayId: string;
  me: "arjun" | "seher";
  kind: string;
  entries: Entry[];
  emoji: string;
  title: string;
  placeholder: string;
}) {
  const [value, setValue] = useState("");

  async function add() {
    const t = value.trim();
    if (!t) return;
    setValue("");
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind, text: t }),
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-4 py-2.5">
        <span className="text-lg">{emoji}</span>
        <span className="font-serif text-lg font-semibold text-foreground">{title}</span>
        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-white">
          {entries.length}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-5 text-center text-sm text-faint">nothing yet — add below 👇</p>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((e) => (
            <li key={e.id ?? e.text} className="group flex items-center gap-2 px-4 py-2.5">
              <span className="text-foreground">{e.text}</span>
              <button
                onClick={() => e.id && deleteChatMessage(dayId, e.id)}
                aria-label="Remove"
                className="ml-auto text-faint opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2 border-t border-border px-3 py-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          add
        </button>
      </div>
    </div>
  );
}

export default function FoodReveal({
  dayId,
  intro,
}: {
  dayId: string;
  intro?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [foods, setFoods] = useState<Entry[]>([]);
  const [restos, setRestos] = useState<Entry[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Both lists live in this day's chat, split by their `kind`.
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const f: Entry[] = [];
        const r: Entry[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o?.kind === "food") f.push({ id: m.id, text: o.text });
            else if (o?.kind === "resto") r.push({ id: m.id, text: o.text });
          } catch {
            /* ignore */
          }
        }
        setFoods(f);
        setRestos(r);
      }),
    [dayId]
  );

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}
      <div className="space-y-4">
        <AddList
          dayId={dayId}
          me={me}
          kind="food"
          entries={foods}
          emoji="🍜"
          title="food items"
          placeholder="a dish you love…"
        />
        <AddList
          dayId={dayId}
          me={me}
          kind="resto"
          entries={restos}
          emoji="🍽️"
          title="favorite restaurants"
          placeholder="a spot you love…"
        />
      </div>
    </div>
  );
}
