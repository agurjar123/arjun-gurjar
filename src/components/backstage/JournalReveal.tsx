"use client";

import { useEffect, useState } from "react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

export default function JournalReveal({
  dayId,
  prompt,
  entry,
}: {
  dayId: string;
  prompt?: string;
  entry?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [saved, setSaved] = useState<{ id?: string; text: string } | null>(null);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
        const mine = msgs.filter((m) => m.from === "seher" && m.text);
        const latest = mine[mine.length - 1];
        setSaved(latest ? { id: latest.id, text: latest.text as string } : null);
        setLoaded(true);
      }),
    [dayId]
  );

  function startEdit() {
    setText(saved?.text ?? "");
    setEditing(true);
  }

  async function save() {
    const t = text.trim();
    if (!t) return;
    if (saved?.id) await deleteChatMessage(dayId, saved.id);
    await sendChatMessage(dayId, { from: me, text: t });
    setEditing(false);
  }

  const showWriter = editing || (loaded && !saved);
  // His page unlocks once she's written hers (Arjun always sees his own).
  const showHis = Boolean(entry) && (Boolean(saved) || me === "arjun");

  const herPage = (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-accent">
        your entry
      </p>
      {showWriter ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="write a journal entry as if you were writing in your diary for today"
            className="bs-notebook bs-notebook-text block h-72 w-full resize-none outline-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={save}
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
            >
              save entry
            </button>
            {saved && (
              <button
                onClick={() => setEditing(false)}
                className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-accent"
              >
                cancel
              </button>
            )}
          </div>
        </>
      ) : saved ? (
        <div>
          <div className="bs-notebook min-h-72">
            <p className="bs-notebook-text whitespace-pre-line">{saved.text}</p>
          </div>
          <button
            onClick={startEdit}
            className="mt-3 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:text-accent-strong"
          >
            edit
          </button>
        </div>
      ) : null}
    </div>
  );

  const hisPage = showHis ? (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-accent">
        arjun&apos;s entry
      </p>
      <div className="bs-notebook min-h-72">
        <p className="bs-notebook-text whitespace-pre-line">{entry}</p>
      </div>
    </div>
  ) : null;

  return (
    <div>
      {prompt && <p className="mb-5 font-serif text-lg italic text-foreground">{prompt}</p>}

      <div className={showHis ? "grid gap-4 md:grid-cols-2" : ""}>
        {herPage}
        {hisPage}
      </div>

      {entry && !showHis && (
        <p className="mt-3 text-sm text-muted">✍️ save your entry to reveal mine…</p>
      )}
    </div>
  );
}
