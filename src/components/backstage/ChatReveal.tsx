"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Send, Trash2 } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";
import { compressImage } from "@/lib/image";
import type { ChatMessage } from "@/data/backstage/days";

function ytId(url: string): string | null {
  return (
    url
      .trim()
      .match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/
      )?.[1] ?? null
  );
}

function YtEmbed({ id }: { id: string }) {
  return (
    <iframe
      title="YouTube"
      src={`https://www.youtube.com/embed/${id}`}
      className="mb-1 aspect-video w-full rounded-xl"
      allow="accelerometer; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

function Bubble({ msg, onDelete }: { msg: ChatMessage; onDelete?: () => void }) {
  const mine = msg.from === "seher";
  const yt = msg.text ? ytId(msg.text) : null;
  return (
    <div className={`group/b flex items-center gap-1.5 ${mine ? "justify-end" : "justify-start"}`}>
      {mine && onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete message"
          className="order-first text-faint opacity-0 transition-opacity hover:text-red-500 group-hover/b:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      )}
      <div
        className={`rounded-2xl px-3.5 py-2 text-sm bs-rise ${
          yt || msg.video ? "w-[88%]" : "max-w-[80%]"
        } ${
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
        {msg.video && (
          <video
            src={msg.video}
            controls
            playsInline
            className="mb-1 max-h-72 w-full rounded-xl bg-black"
          />
        )}
        {yt && <YtEmbed id={yt} />}
        {msg.text && !yt && (
          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
        )}
      </div>
      {!mine && onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete message"
          className="text-faint opacity-0 transition-opacity hover:text-red-500 group-hover/b:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      )}
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
          <Bubble
            key={m.id ?? `r${i}`}
            msg={m}
            onDelete={m.id ? () => deleteChatMessage(dayId, m.id as string) : undefined}
          />
        ))}
        <div ref={endRef} />
      </div>

      {doneScript && promptReply && <Composer dayId={dayId} me={me} />}
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function Composer({ dayId, me }: { dayId: string; me: "arjun" | "seher" }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setIsVideo(!!f && f.type.startsWith("video/"));
    setPreview(f ? URL.createObjectURL(f) : null);
    setError(null);
  }

  async function send() {
    if (!file && !text.trim()) return;
    setSending(true);
    setError(null);
    try {
      let photo: string | undefined;
      let video: string | undefined;
      if (file) {
        if (file.type.startsWith("video/")) {
          if (file.size > 9 * 1024 * 1024) {
            setError("That clip's a bit big — keep it under ~9MB (a short one).");
            setSending(false);
            return;
          }
          video = await readAsDataUrl(file);
        } else {
          photo = await compressImage(file);
        }
      }
      await sendChatMessage(dayId, { from: me, text: text.trim(), photo, video });
      // Only clear once the write actually succeeded.
      setText("");
      setFile(null);
      setPreview(null);
      setIsVideo(false);
    } catch {
      setError("Couldn't send — check your connection and try again.");
    }
    setSending(false);
  }

  return (
    <div className="mt-4 rounded-2xl border border-border bg-background p-3">
      {preview &&
        (isVideo ? (
          <video src={preview} muted playsInline className="mb-2 max-h-40 rounded-xl bg-black" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="mb-2 max-h-40 rounded-xl object-cover" />
        ))}
      {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <label className="shrink-0 cursor-pointer rounded-full border border-border p-2 text-muted transition-colors hover:text-accent">
          <ImagePlus size={16} />
          <input type="file" accept="image/*,video/*" className="hidden" onChange={pick} />
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
