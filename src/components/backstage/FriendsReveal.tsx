"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Tag = { id?: string; photo: number; x: number; y: number; name: string };

export default function FriendsReveal({
  dayId,
  intro,
  photos,
}: {
  dayId: string;
  intro?: string;
  photos: { src: string; answer?: string }[];
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [tags, setTags] = useState<Tag[]>([]);
  const [pending, setPending] = useState<{ photo: number; x: number; y: number } | null>(null);
  const [name, setName] = useState("");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Tags are stored as JSON in chat messages (reuses the chat Firebase rule).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Tag[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o && o.kind === "tag") {
              parsed.push({ id: m.id, photo: o.photo, x: o.x, y: o.y, name: o.name });
            }
          } catch {
            /* ignore non-tag messages */
          }
        }
        setTags(parsed);
      }),
    [dayId]
  );

  function clickPhoto(e: React.MouseEvent<HTMLDivElement>, i: number) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPending({
      photo: i,
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
    setName("");
  }

  async function savePending() {
    const p = pending;
    setPending(null);
    if (!p || !name.trim()) return;
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind: "tag", photo: p.photo, x: p.x, y: p.y, name: name.trim() }),
    });
    setName("");
  }

  return (
    <div>
      {/* London header */}
      <div className="mb-4 overflow-hidden rounded-2xl border border-border">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#012169] via-white to-[#C8102E]" />
        <div className="flex items-center gap-2 px-4 py-2">
          <span className="text-lg">🇬🇧</span>
          <span className="font-serif text-lg font-semibold text-foreground">London</span>
          <span className="ml-auto text-lg">🕰️</span>
        </div>
      </div>

      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      <div className="space-y-6">
        {photos.map((p, i) => (
          <div key={i}>
            <div
              className="relative overflow-hidden rounded-2xl border border-border"
              onClick={(e) => clickPhoto(e, i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                draggable={false}
                className="block w-full cursor-crosshair select-none"
              />

              {tags
                .filter((t) => t.photo === i)
                .map((t) => (
                  <div
                    key={t.id ?? `${t.x}-${t.y}`}
                    className="group/tag absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%` }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-1 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white shadow">
                      {t.name}
                      <button
                        onClick={() => t.id && deleteChatMessage(dayId, t.id)}
                        aria-label="Remove tag"
                        className="opacity-60 transition-opacity hover:opacity-100"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                ))}

              {pending && pending.photo === i && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      if (e.key === "Escape") setPending(null);
                    }}
                    onBlur={savePending}
                    placeholder="name?"
                    className="w-28 rounded-full border border-accent bg-surface px-2.5 py-1 text-xs text-foreground shadow outline-none"
                  />
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <p className="text-xs text-faint">tap a face to guess who it is</p>
              {p.answer && (
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}
                  className="ml-auto font-mono text-[10px] uppercase tracking-wider text-accent transition-colors hover:text-accent-strong"
                >
                  {revealed[i] ? "hide answer" : "reveal answer"}
                </button>
              )}
            </div>
            {p.answer && revealed[i] && (
              <p className="mt-1 text-sm text-muted">{p.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
