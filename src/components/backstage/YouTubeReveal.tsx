"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

function ytId(url: string): string | null {
  return (
    url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/
    )?.[1] ?? null
  );
}

function YtEmbed({ id }: { id: string }) {
  return (
    <iframe
      title="YouTube"
      src={`https://www.youtube.com/embed/${id}`}
      className="aspect-video w-full rounded-xl border border-border"
      allow="accelerometer; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export default function YouTubeReveal({
  dayId,
  videos,
  intro,
  prompt,
}: {
  dayId: string;
  videos: string[];
  intro?: string;
  prompt?: boolean;
}) {
  const [added, setAdded] = useState<{ id?: string; url: string }[]>([]);
  const [link, setLink] = useState("");
  const [me, setMe] = useState<"arjun" | "seher">("seher");

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Added favorites are stored as plain-URL chat messages (reuses the chat rule).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) =>
        setAdded(
          msgs
            .filter((m) => m.text && ytId(m.text))
            .map((m) => ({ id: m.id, url: m.text as string }))
        )
      ),
    [dayId]
  );

  async function add() {
    const url = link.trim();
    if (!ytId(url)) return;
    await sendChatMessage(dayId, { from: me, text: url });
    setLink("");
  }

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      <div className="space-y-4">
        {videos.map((url) => {
          const id = ytId(url);
          return id ? <YtEmbed key={url} id={id} /> : null;
        })}
      </div>

      {added.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent">also loved</p>
          {added.map((a) => {
            const id = ytId(a.url);
            if (!id) return null;
            return (
              <div key={a.id ?? a.url} className="group/y relative">
                <YtEmbed id={id} />
                {a.id && (
                  <button
                    onClick={() => deleteChatMessage(dayId, a.id as string)}
                    aria-label="Remove"
                    className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition-opacity group-hover/y:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {prompt && (
        <div className="mt-5 flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
            }}
            placeholder="paste a YouTube link…"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            onClick={add}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            <Plus size={14} /> add
          </button>
        </div>
      )}
    </div>
  );
}
