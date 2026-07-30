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

// Layout constants (px) — the snaking SVG is computed against these.
const CARD_W = 320; // w-80
const SPACER = 24;
const BAND = 104; // height of the wave band above the cards
const MID = 52;
const AMP = 22;
const FREQ = 1.15; // radians per node → an inflection roughly every ~2.7 events

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

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeTimeline(setEvents), []);

  const items = [...events, LANDING].sort((a, b) => a.date.localeCompare(b.date));

  // Node positions on the snaking wave (one per moment + a ghost for "add").
  const nodes = items.map((it, i) => ({
    x: SPACER + i * CARD_W + CARD_W / 2,
    y: MID + AMP * Math.sin(i * FREQ),
    landing: it.id === LANDING_ID,
  }));
  const addX = SPACER + items.length * CARD_W + CARD_W / 2;
  const addY = MID + AMP * Math.sin(items.length * FREQ);
  const totalW = SPACER * 2 + (items.length + 1) * CARD_W;

  // Catmull-Rom spline → smooth curve that flows through the points (no bumps at
  // each node; it only turns where the wave actually peaks).
  function wavePath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return pts.length ? `M ${pts[0].x},${pts[0].y}` : "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }
  const solidPath = wavePath(nodes);
  const last = nodes[nodes.length - 1] ?? { x: SPACER, y: MID };
  const prev = nodes[nodes.length - 2] ?? last;
  // Smooth dashed tail into the "add" ghost node, matching the wave's exit slope.
  const tcp1x = last.x + (addX - prev.x) / 6;
  const tcp1y = last.y + (addY - prev.y) / 6;
  const tcp2x = addX - (addX - last.x) / 6;
  const tcp2y = addY - (addY - last.y) / 6;
  const dashPath = `M ${last.x},${last.y} C ${tcp1x},${tcp1y} ${tcp2x},${tcp2y} ${addX},${addY}`;

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
              Time really flies huh
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
      <div ref={scrollRef} className="bs-hscroll mt-10 overflow-x-auto pb-8">
        <div className="relative w-max">
          {/* Snaking line, nodes, and drop connectors */}
          <svg
            width={totalW}
            height={BAND}
            className="absolute left-0 top-0"
            style={{ overflow: "visible" }}
            aria-hidden
          >
            {nodes.map((n, i) => (
              <line
                key={`c${i}`}
                x1={n.x}
                y1={n.y}
                x2={n.x}
                y2={BAND}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeOpacity={0.6}
              />
            ))}
            <path d={solidPath} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeOpacity={0.55} strokeLinecap="round" />
            <path d={dashPath} fill="none" stroke="var(--border)" strokeWidth={2} strokeDasharray="2 8" strokeLinecap="round" />
            {nodes.map((n, i) => (
              <circle
                key={`n${i}`}
                cx={n.x}
                cy={n.y}
                r={5}
                fill={n.landing ? "#ef4444" : "var(--accent)"}
                stroke="var(--background)"
                strokeWidth={3}
                className={n.landing ? "bs-pulse" : undefined}
              />
            ))}
            <circle
              cx={addX}
              cy={addY}
              r={4.5}
              fill="var(--background)"
              stroke="var(--faint)"
              strokeWidth={1.5}
              strokeDasharray="2 3"
            />
          </svg>

          {/* Cards row, under the band */}
          <div className="flex items-start" style={{ paddingTop: BAND }}>
            <div style={{ width: SPACER }} className="shrink-0" />
            {items.map((item, i) => (
              <Moment key={item.id} event={item} index={i} />
            ))}
            <AddColumn />
            <div style={{ width: SPACER }} className="shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Moment({ event, index }: { event: TimelineEvent; index: number }) {
  const isLanding = event.id === LANDING_ID;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [note, setNote] = useState(event.note ?? "");
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const photos = event.photos ?? [];

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
    <div
      className="group w-80 shrink-0 px-3"
      style={{ width: CARD_W }}
    >
      <article
        className="bs-cardfloat rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-200 hover:border-accent/30 hover:shadow-[var(--shadow-soft)]"
        style={{ animationDuration: `${7 + (index % 4)}s`, animationDelay: `${index * 0.6}s` }}
      >
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] ${
            isLanding ? "bg-red-500/10 text-red-500" : "bg-accent-soft text-accent"
          }`}
        >
          {fmt(event.date)}
        </span>

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
            {event.title && (
              <h3 className="mt-2.5 font-serif text-xl font-semibold leading-snug text-foreground">
                {event.title}
              </h3>
            )}
            {event.note && <p className="mt-1.5 text-sm leading-relaxed text-muted">{event.note}</p>}
          </>
        )}

        {photos.length > 0 && (
          <div className="mt-4 space-y-2">
            {photos.map((src, i) => (
              <div key={i} className="group/p relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-auto max-h-80 w-full rounded-lg border border-border object-contain"
                />
                {!isLanding && (
                  <button
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-foreground p-0.5 text-background opacity-0 transition-opacity group-hover/p:opacity-100"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {event.song?.url && <SpotifyEmbed url={event.song.url} />}

        {!isLanding && !editing && (
          <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 opacity-0 transition-opacity group-hover:opacity-100">
            <button onClick={() => fileRef.current?.click()} aria-label="Add photo" className="text-faint transition-colors hover:text-accent">
              <ImagePlus size={15} />
            </button>
            <button onClick={() => setPicking(true)} aria-label="Add song" className="text-faint transition-colors hover:text-accent">
              <Music size={15} />
            </button>
            <button onClick={() => setEditing(true)} aria-label="Edit caption" className="text-faint transition-colors hover:text-accent">
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
      </article>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
      {picking && <SongPicker onPick={setSong} onClose={() => setPicking(false)} />}
    </div>
  );
}

function AddColumn() {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const fs = Array.from(e.target.files ?? []);
    setFiles(fs);
    setPreviews(fs.map((f) => URL.createObjectURL(f)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // A date is all that's required — a caption and/or photos are both optional
    // (so you can drop photos onto the timeline without writing anything).
    if (!date || (!title.trim() && files.length === 0)) return;
    setSaving(true);
    const photos = files.length
      ? await Promise.all(files.map((f) => compressImage(f, 900, 0.6)))
      : [];
    await saveTimelineEvent({ date, title: title.trim(), photos });
    setDate("");
    setTitle("");
    setFiles([]);
    setPreviews([]);
    if (fileRef.current) fileRef.current.value = "";
    setSaving(false);
  }

  const canSave = Boolean(date) && (title.trim().length > 0 || files.length > 0);

  return (
    <div className="shrink-0 px-3" style={{ width: CARD_W }}>
      <form onSubmit={submit} className="rounded-2xl border border-dashed border-border bg-surface/50 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
          add to the timeline
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <input
          placeholder="caption (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />

        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-14 w-14 rounded-lg border border-border object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ImagePlus size={14} /> photos
          </button>
          <button
            type="submit"
            disabled={!canSave || saving}
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            <Plus size={14} /> {saving ? "Adding…" : "Add"}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={pick}
        />
      </form>
    </div>
  );
}
