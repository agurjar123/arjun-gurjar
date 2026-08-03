"use client";

import { useEffect, useState } from "react";
import { Lock, Check, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { subscribeChat } from "@/lib/firebase";
import DayReveal from "./DayReveal";
import type { AdventDay } from "@/data/backstage/days";

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");

// A day unlocks at midnight in Seher's local time, which follows her trip:
// India through Aug 3, the UK Aug 4–16, then California for landing.
function herOffset(date: string): string {
  if (date <= "2026-08-03") return "+05:30"; // India (IST)
  if (date <= "2026-08-16") return "+01:00"; // UK (BST)
  return "-07:00"; // landing day / SF (PDT)
}

function unlockedByDate(date: string): boolean {
  return new Date(`${date}T00:00:00${herOffset(date)}`).getTime() <= Date.now();
}

function label(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function DayCard({
  day,
  solved,
  onSolve,
}: {
  day: AdventDay;
  solved: boolean;
  onSolve: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [isArjun, setIsArjun] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setIsArjun(localStorage.getItem("backstage_me") === "arjun");
    } catch {
      /* ignore */
    }
  }, []);

  // Arjun (logged in with his own password) sees every day, unlocked + revealed.
  const dateOpen = mounted && (isArjun || day.alwaysOpen || unlockedByDate(day.date));
  const reveal = solved || (mounted && isArjun);
  const canOpen = dateOpen;
  const ready = mounted && dateOpen && !reveal; // available, not yet opened → glimmer

  // Once a day is revealed, surface its photos on the tile.
  const content = day.content;
  const [replyPhotos, setReplyPhotos] = useState<string[]>([]);
  useEffect(() => {
    if (!reveal || content?.type !== "chat") {
      setReplyPhotos([]);
      return;
    }
    return subscribeChat(day.id, (msgs) =>
      setReplyPhotos(msgs.filter((m) => m.photo).map((m) => m.photo as string))
    );
  }, [reveal, content, day.id]);

  let staticPhotos: string[] = [];
  if (content?.type === "photos") staticPhotos = content.photos.map((p) => p.src);
  else if (content?.type === "chat")
    staticPhotos = content.messages.filter((m) => m.photo).map((m) => m.photo as string);
  const previewPhotos = reveal ? [...staticPhotos, ...replyPhotos] : [];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (normalize(value) === normalize(day.crypticAnswer)) {
      onSolve(day.id);
      setError(false);
    } else {
      setError(true);
    }
  }

  let status = "…";
  if (mounted) {
    if (!dateOpen) status = `Unlocks ${label(day.date)}`;
    else if (reveal) status = "Opened";
    else status = "Tap to open";
  }

  return (
    <>
      {/* Closed tile — clicking opens the day (nothing unveils inline). */}
      <button
        type="button"
        onClick={() => canOpen && setOpen(true)}
        aria-disabled={!canOpen}
        className={cn(
          "group w-full rounded-3xl border p-6 text-left shadow-[var(--shadow-card)] transition-all",
          ready ? "bs-ready" : "border-border bg-surface",
          canOpen
            ? "cursor-pointer hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--shadow-soft)]"
            : "cursor-default",
          reveal && "bs-pop",
          !dateOpen && mounted && "opacity-90"
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
            {label(day.date)}
          </span>
          {mounted &&
            (reveal ? (
              <Check size={15} className="text-accent" />
            ) : !dateOpen ? (
              <Lock size={14} className="text-faint" />
            ) : null)}
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground">{day.title}</h3>
        {reveal && !open && previewPhotos.length > 0 ? (
          <div className="mt-4 flex gap-1.5">
            {previewPhotos.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-14 w-14 rounded-lg border border-border object-cover"
              />
            ))}
            {previewPhotos.length > 3 && (
              <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-border bg-surface-muted font-mono text-[11px] text-muted">
                +{previewPhotos.length - 3}
              </span>
            )}
          </div>
        ) : (
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-faint">{status}</p>
        )}
      </button>

      {/* Modal — the day opens here */}
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] bs-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                  {label(day.date)}
                </span>
                <h3 className="mt-1 font-serif text-2xl font-semibold text-foreground">
                  {day.title}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-muted transition-colors hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>

            {reveal ? (
              <DayReveal day={day} />
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <p className="text-sm text-muted">Enter the day&apos;s cryptic answer to open it:</p>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setError(false);
                    }}
                    placeholder="answer"
                    aria-label={`Answer for ${day.title}`}
                    className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
                  >
                    Open
                  </button>
                </div>
                {error && <p className="text-sm text-accent">Not it yet — keep going ♡</p>}
                {day.hint && !error && <p className="text-xs text-faint">Hint: {day.hint}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
