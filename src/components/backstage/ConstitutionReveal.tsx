"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Article = { id?: string; text: string };

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];
function roman(n: number): string {
  let out = "";
  for (const [v, s] of ROMAN) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

export default function ConstitutionReveal({
  dayId,
  intro,
}: {
  dayId: string;
  intro?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [articles, setArticles] = useState<Article[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Article[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o?.kind === "article") parsed.push({ id: m.id, text: o.text });
          } catch {
            /* ignore */
          }
        }
        setArticles(parsed);
      }),
    [dayId]
  );

  async function add() {
    const t = value.trim();
    if (!t) return;
    setValue("");
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind: "article", text: t }),
    });
  }

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      {/* Parchment document */}
      <div className="bs-parchment rounded-lg p-6 sm:p-8">
        <div className="border-2 border-double border-[#b89b6a] px-5 py-6 sm:px-8">
          <h3 className="text-center font-serif text-2xl font-semibold tracking-wide text-[#3a2a15]">
            The Constitution of Seherland
          </h3>
          <div className="mx-auto my-3 h-px w-24 bg-[#b89b6a]" />
          <p className="mx-auto max-w-prose text-center font-serif text-[15px] italic leading-relaxed text-[#4a3721]">
            We the people of Seherland (me and you) do pledge to abide by the following rules.
          </p>

          {/* Articles */}
          <div className="mt-6 space-y-3">
            {articles.length === 0 ? (
              <p className="text-center font-serif text-sm text-[#8a7350]">
                — no articles yet —
              </p>
            ) : (
              articles.map((a, i) => (
                <div key={a.id ?? i} className="group flex gap-2 font-serif text-[#33260f]">
                  <span className="shrink-0 font-semibold">Article {roman(i + 1)}.</span>
                  <span className="leading-relaxed">{a.text}</span>
                  <button
                    onClick={() => a.id && deleteChatMessage(dayId, a.id)}
                    aria-label="Remove article"
                    className="ml-auto shrink-0 self-start text-[#b89b6a] opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mx-auto my-6 h-px w-24 bg-[#b89b6a]" />
          <p className="text-center font-serif text-xs italic text-[#8a7350]">
            Ratified by Seher · Sworn to by Arjun, Citizen No. 1
          </p>
        </div>
      </div>

      {/* Add an article */}
      <div className="mt-4 flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="add an article…"
          className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
        />
        <button
          onClick={add}
          className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          ratify
        </button>
      </div>
    </div>
  );
}
