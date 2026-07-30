"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { subscribeChat, sendChatMessage } from "@/lib/firebase";
import { compressImage } from "@/lib/image";
import type { ChatMessage } from "@/data/backstage/days";

function Bubble({ msg }: { msg: ChatMessage }) {
  const mine = msg.from === "seher";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm bs-rise ${
          mine
            ? "rounded-br-md bg-accent text-white"
            : "rounded-bl-md bg-surface-muted text-foreground"
        }`}
      >
        {msg.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={msg.photo}
            alt=""
            className="mb-1 max-h-64 w-full rounded-xl object-cover"
          />
        )}
        {msg.text && <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>}
      </div>
    </div>
  );
}

function Typing({ from }: { from: "arjun" | "seher" }) {
  return (
    <div className={`flex ${from === "seher" ? "justify-end" : "justify-start"}`}>
      <div className="flex items-center gap-1 rounded-2xl bg-surface-muted px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-faint bs-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ChatReveal({
  dayId,
  script,
  promptReply,
}: {
  dayId: string;
  script: ChatMessage[];
  promptReply?: boolean;
}) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [replies, setReplies] = useState<ChatMessage[]>([]);
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("backstage_me");
      if (stored === "arjun" || stored === "seher") setMe(stored);
    } catch {
      /* ignore */
    }
  }, []);

  // Reveal the scripted messages one at a time, with a typing pause before each.
  useEffect(() => {
    if (shown >= script.length) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const msg = script[shown];
    const delay = msg.photo
      ? 900
      : Math.min(2200, Math.max(700, 500 + (msg.text?.length ?? 0) * 25));
    const t = setTimeout(() => {
      setTyping(false);
      setShown((n) => n + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [shown, script]);

  useEffect(() => subscribeChat(dayId, setReplies), [dayId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [shown, typing, replies]);

  const doneScript = shown >= script.length;

  return (
    <div>
      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
        {script.slice(0, shown).map((m, i) => (
          <Bubble key={`s${i}`} msg={m} />
        ))}
        {typing && shown < script.length && <Typing from={script[shown].from} />}
        {replies.map((m, i) => (
          <Bubble key={`r${i}`} msg={m} />
        ))}
        <div ref={endRef} />
      </div>

      {doneScript && promptReply && <Composer dayId={dayId} me={me} />}
    </div>
  );
}

function Composer({ dayId, me }: { dayId: string; me: "arjun" | "seher" }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function send() {
    if (!file && !text.trim()) return;
    setSending(true);
    let photo: string | undefined;
    try {
      if (file) photo = await compressImage(file);
      await sendChatMessage(dayId, { from: me, text: text.trim(), photo });
    } catch {
      /* ignore */
    }
    setText("");
    setFile(null);
    setPreview(null);
    setSending(false);
  }

  return (
    <div className="mt-4 rounded-2xl border border-border bg-background p-3">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mb-2 max-h-40 rounded-xl object-cover" />
      )}
      <div className="flex items-center gap-2">
        <label className="shrink-0 cursor-pointer rounded-full border border-border p-2 text-muted transition-colors hover:text-accent">
          <ImagePlus size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={pick} />
        </label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="send one back…"
          className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <button
          onClick={send}
          disabled={sending}
          aria-label="Send"
          className="shrink-0 rounded-full bg-accent p-2.5 text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
