"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Music,
  Pencil,
  Trash2,
  X,
  Check,
  Plus,
} from "lucide-react";
import {
  subscribeTimeline,
  saveTimelineEvent,
  deleteTimelineEvent,
  firebaseReady,
  type TimelineEvent,
  type TimelineSong,
} from "@/lib/firebase";
import { compressImage } from "@/lib/image";
import SongPicker from "./SongPicker";

const LANDING_ID = "__landing";
const LANDING: TimelineEvent = { id: LANDING_ID, date: "2026-08-17", title: "You land" };

const fmt = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

function SpotifyEmbed({ url }: { url: string }) {
  const embed = url.replace("open.spotify.com/", "open.spotify.com/embed/");
  return (
    <iframe
      title="Spotify"
      src={embed}
      width="100%"
      height={80}
      loading="lazy"
      allow="encrypted-media; clipboard-write"
      className="mt-4 rounded-xl"
    />
  );
}

function Kicker({ date, landing }: { date: string; landing?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
        landing ? "bg-red-500/10 text-red-500" : "bg-accent-soft text-accent"
      }`}
    >
      {fmt(date)}
    </span>
  );
}

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [draft, setDraft] = useState({ date: "", title: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeTimeline(setEvents), []);

  const items = [...events, LANDING].sort((a, b) => a.date.localeCompare(b.date));

  async function addMoment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.date || !draft.title.trim()) return;
    await saveTimelineEvent(draft);
    setDraft({ date: "", title: "" });
  }

  function nudge(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  }

  return (
    <div className="py-16">
      {/* Masthead */}
      <div className="mx-auto max-w-5xl px-5 sm:px-10">
        <Link
          href="/backstage"
          className="mb-10 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={13} /> backstage
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">us, so far</p>
            <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Our timeline
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Left to right, the story so far — every moment worth keeping, up to the day you land.
              {!firebaseReady && " (connect Firebase to save.)"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[11px] uppercase tracking-wider text-faint sm:inline">
              {events.length} {events.length === 1 ? "moment" : "moments"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => nudge(-1)}
                aria-label="Scroll left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => nudge(1)}
                aria-label="Scroll right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal timeline */}
      <div
        ref={scrollRef}
        className="bs-hscroll mt-12 flex snap-x snap-proximity items-start overflow-x-auto pb-8 pt-5"
      >
        <div className="w-5 shrink-0 sm:w-10" />
        {items.map((item) => (
          <Moment key={item.id} event={item} />
        ))}
        <AddColumn draft={draft} setDraft={setDraft} onAdd={addMoment} />
        <div className="w-5 shrink-0 sm:w-10" />
      </div>
    </div>
  );
}

function Moment({ event }: { event: TimelineEvent }) {
  const isLanding = event.id === LANDING_ID;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [note, setNote] = useState(event.note ?? "");
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const photos = event.photos ?? [];
  const [cover, ...rest] = photos;

  async function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const compressed = await Promise.all(files.map((f) => compressImage(f, 900, 0.6)));
    await saveTimelineEvent({ ...event, photos: [...photos, ...compressed] });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removePhoto(idx: number) {
    await saveTimelineEvent({ ...event, photos: photos.filter((_, i) => i !== idx) });
  }

  async function setSong(song: TimelineSong) {
    setPicking(false);
    await saveTimelineEvent({ ...event, song });
  }

  async function saveCaption() {
    await saveTimelineEvent({ ...event, title: title.trim() || event.title, note });
    setEditing(false);
  }

  return (
    <div className="group w-80 shrink-0 snap-start px-3">
      {/* Axis node + connector */}
      <div className="relative border-t-2 border-border">
        <span
          className={`absolute -top-[7px] left-0 h-3.5 w-3.5 rounded-full ring-4 ring-background ${
            isLanding ? "bg-red-500 bs-pulse" : "bg-accent"
          }`}
        />
      </div>
      <div className="ml-[6px] h-6 w-px bg-gradient-to-b from-border to-transparent" />

      <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-all duration-200 group-hover:-translate-y-1 group-hover:border-accent/30 group-hover:shadow-[var(--shadow-soft)]">
        {cover && (
          <div className="group/cover relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" className="h-44 w-full object-cover" />
            {!isLanding && (
              <button
                onClick={() => removePhoto(0)}
                aria-label="Remove photo"
                className="absolute right-2 top-2 rounded-full bg-foreground/70 p-1 text-background opacity-0 transition-opacity group-hover/cover:opacity-100"
              >
                <X size={13} />
              </button>
            )}
          </div>
        )}

        <div className="p-5">
          <Kicker date={event.date} landing={isLanding} />

          {editing ? (
            <div className="mt-3 space-y-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="a little note…"
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
              />
              <button
                onClick={saveCaption}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-strong"
              >
                <Check size={13} /> save
              </button>
            </div>
          ) : (
            <>
              <h3 className="mt-2.5 font-serif text-xl font-semibold leading-snug text-foreground">
                {event.title}
              </h3>
              {event.note && (
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{event.note}</p>
              )}
            </>
          )}

          {rest.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {rest.map((src, i) => (
                <div key={i} className="group/p relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="h-16 w-16 rounded-lg border border-border object-cover"
                  />
                  {!isLanding && (
                    <button
                      onClick={() => removePhoto(i + 1)}
                      aria-label="Remove photo"
                      className="absolute -right-1.5 -top-1.5 rounded-full bg-foreground p-0.5 text-background opacity-0 transition-opacity group-hover/p:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {event.song?.url && <SpotifyEmbed url={event.song.url} />}

          {!isLanding && !editing && (
            <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => fileRef.current?.click()}
                aria-label="Add photo"
                className="text-faint transition-colors hover:text-accent"
              >
                <ImagePlus size={15} />
              </button>
              <button
                onClick={() => setPicking(true)}
                aria-label="Add song"
                className="text-faint transition-colors hover:text-accent"
              >
                <Music size={15} />
              </button>
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit caption"
                className="text-faint transition-colors hover:text-accent"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => event.id && deleteTimelineEvent(event.id)}
                aria-label="Delete moment"
                className="ml-auto text-faint transition-colors hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
      </article>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={addPhotos}
      />
      {picking && <SongPicker onPick={setSong} onClose={() => setPicking(false)} />}
    </div>
  );
}

function AddColumn({
  draft,
  setDraft,
  onAdd,
}: {
  draft: { date: string; title: string };
  setDraft: (d: { date: string; title: string }) => void;
  onAdd: (e: React.FormEvent) => void;
}) {
  return (
    <div className="w-80 shrink-0 snap-start px-3">
      <div className="relative border-t-2 border-dashed border-border">
        <span className="absolute -top-[7px] left-0 h-3.5 w-3.5 rounded-full border border-dashed border-faint bg-background" />
      </div>
      <div className="ml-[6px] h-6 w-px bg-gradient-to-b from-border to-transparent" />

      <form
        onSubmit={onAdd}
        className="rounded-2xl border border-dashed border-border bg-surface/50 p-5"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">add a moment</p>
        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <input
          placeholder="what happened"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          <Plus size={14} /> Add
        </button>
      </form>
    </div>
  );
}
