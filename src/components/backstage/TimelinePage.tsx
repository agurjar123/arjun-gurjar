"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Music, Pencil, Trash2, Plus, X, Check } from "lucide-react";
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
const LANDING: TimelineEvent = {
  id: LANDING_ID,
  date: "2026-08-17",
  title: "You land 💛",
};

const fmt = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
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
      className="mt-3 rounded-xl border border-border"
    />
  );
}

export default function TimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [draft, setDraft] = useState({ date: "", title: "" });

  useEffect(() => subscribeTimeline(setEvents), []);

  const items = [...events, LANDING].sort((a, b) => a.date.localeCompare(b.date));

  async function addMoment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.date || !draft.title.trim()) return;
    await saveTimelineEvent(draft);
    setDraft({ date: "", title: "" });
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <Link
        href="/backstage"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={13} /> backstage
      </Link>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">us, so far</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-foreground">Our timeline</h1>
      <p className="mt-3 text-muted">
        Every moment worth keeping. Hover a moment to add a photo, caption, or song
        {!firebaseReady && " (add Firebase to make it save)"}.
      </p>

      <ol className="relative mt-10 ml-1 border-l border-border">
        {items.map((item) => (
          <EventCard key={item.id} event={item} />
        ))}
      </ol>

      {/* Add a moment */}
      <form
        onSubmit={addMoment}
        className="mt-8 flex flex-wrap gap-2 rounded-2xl border border-dashed border-border p-4"
      >
        <p className="w-full font-mono text-[10px] uppercase tracking-wider text-accent">
          add a moment
        </p>
        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <input
          placeholder="what happened"
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
        >
          <Plus size={14} /> Add
        </button>
      </form>
    </div>
  );
}

function EventCard({ event }: { event: TimelineEvent }) {
  const isLanding = event.id === LANDING_ID;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [note, setNote] = useState(event.note ?? "");
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function addPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const compressed = await Promise.all(files.map((f) => compressImage(f, 900, 0.6)));
    await saveTimelineEvent({
      ...event,
      photos: [...(event.photos ?? []), ...compressed],
    });
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removePhoto(idx: number) {
    const photos = (event.photos ?? []).filter((_, i) => i !== idx);
    await saveTimelineEvent({ ...event, photos });
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
    <li className="group relative pb-8 pl-6 last:pb-0">
      <span
        className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background ${
          isLanding ? "bg-red-500 bs-pulse" : "bg-accent"
        }`}
      />
      <time className="block font-mono text-[11px] uppercase tracking-wider text-faint">
        {fmt(event.date)}
      </time>

      {editing ? (
        <div className="mt-1 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="a little note…"
            rows={2}
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
          <p
            className={`mt-1 ${
              isLanding ? "font-serif text-lg font-semibold" : "font-medium"
            } text-foreground`}
          >
            {event.title}
          </p>
          {event.note && <p className="mt-0.5 text-sm text-muted">{event.note}</p>}
        </>
      )}

      {/* Photos */}
      {event.photos && event.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {event.photos.map((src, i) => (
            <div key={i} className="group/photo relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-24 w-24 rounded-xl border border-border object-cover"
              />
              {!isLanding && (
                <button
                  onClick={() => removePhoto(i)}
                  aria-label="Remove photo"
                  className="absolute -right-1.5 -top-1.5 rounded-full bg-foreground p-0.5 text-background opacity-0 transition-opacity group-hover/photo:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Song */}
      {event.song?.url && <SpotifyEmbed url={event.song.url} />}

      {/* Hover toolbar (editable events only) */}
      {!isLanding && !editing && (
        <div className="mt-2 flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:bg-surface-muted hover:text-accent"
          >
            <ImagePlus size={12} /> photo
          </button>
          <button
            onClick={() => setPicking(true)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:bg-surface-muted hover:text-accent"
          >
            <Music size={12} /> song
          </button>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:bg-surface-muted hover:text-accent"
          >
            <Pencil size={12} /> caption
          </button>
          <button
            onClick={() => event.id && deleteTimelineEvent(event.id)}
            aria-label="Delete moment"
            className="ml-auto rounded-full px-2 py-1 text-muted transition-colors hover:text-red-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={addPhotos}
      />

      {picking && <SongPicker onPick={setSong} onClose={() => setPicking(false)} />}
    </li>
  );
}
