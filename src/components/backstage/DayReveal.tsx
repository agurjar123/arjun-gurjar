"use client";

import { useState } from "react";
import { saveAnswers, firebaseReady } from "@/lib/firebase";
import ChatReveal from "./ChatReveal";
import YouTubeReveal from "./YouTubeReveal";
import JournalReveal from "./JournalReveal";
import FriendsReveal from "./FriendsReveal";
import ShoppingReveal from "./ShoppingReveal";
import BookshelfReveal from "./BookshelfReveal";
import NicheSpotsReveal from "./NicheSpotsReveal";
import FoodReveal from "./FoodReveal";
import ConstitutionReveal from "./ConstitutionReveal";
import type { AdventDay, DayContent } from "@/data/backstage/days";

export default function DayReveal({ day }: { day: AdventDay }) {
  const content = day.content;
  if (!content) {
    return (
      <p className="font-mono text-xs uppercase tracking-wider text-faint">
        A surprise is on its way ♡
      </p>
    );
  }
  return <Content dayId={day.id} content={content} />;
}

function Content({ dayId, content }: { dayId: string; content: DayContent }) {
  switch (content.type) {
    case "note":
      return (
        <div>
          {content.title && (
            <h4 className="mb-2 font-serif text-xl font-semibold text-foreground">
              {content.title}
            </h4>
          )}
          <p className="leading-relaxed text-foreground/90 whitespace-pre-line">
            {content.body}
          </p>
        </div>
      );

    case "photos":
      return (
        <div className="columns-2 gap-3 space-y-3 sm:columns-3">
          {content.photos.map((p) => (
            <figure
              key={p.src}
              className="break-inside-avoid overflow-hidden rounded-2xl border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.caption ?? ""} className="block w-full" />
              {p.caption && (
                <figcaption className="px-3 py-2 text-xs text-muted">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      );

    case "playlist": {
      const embed = content.spotifyUrl.replace(
        "open.spotify.com/",
        "open.spotify.com/embed/"
      );
      return (
        <div>
          {content.note && (
            <p className="mb-3 leading-relaxed text-foreground/90">{content.note}</p>
          )}
          <iframe
            title="Spotify playlist"
            src={embed}
            width="100%"
            height={380}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-2xl border border-border"
          />
        </div>
      );
    }

    case "questions":
      return <Questions dayId={dayId} intro={content.intro} questions={content.questions} />;

    case "chat":
      return (
        <ChatReveal
          dayId={dayId}
          script={content.messages}
          promptReply={content.promptReply}
        />
      );

    case "video":
      return <VideoReveal src={content.src} url={content.url} caption={content.caption} />;

    case "youtube":
      return (
        <YouTubeReveal
          dayId={dayId}
          videos={content.videos}
          intro={content.intro}
          prompt={content.prompt}
        />
      );

    case "journal":
      return <JournalReveal dayId={dayId} prompt={content.prompt} entry={content.entry} />;

    case "friends":
      return <FriendsReveal dayId={dayId} intro={content.intro} photos={content.photos} />;

    case "shopping":
      return <ShoppingReveal dayId={dayId} intro={content.intro} />;

    case "food":
      return <FoodReveal dayId={dayId} intro={content.intro} />;

    case "constitution":
      return <ConstitutionReveal dayId={dayId} intro={content.intro} />;

    case "bookshelf":
      return <BookshelfReveal dayId={dayId} intro={content.intro} books={content.books} />;

    case "spots":
      return (
        <NicheSpotsReveal
          dayId={dayId}
          intro={content.intro}
          center={content.center}
          radiusMi={content.radiusMi}
          target={content.target}
        />
      );

    default:
      return null;
  }
}

function VideoReveal({
  src,
  url,
  caption,
}: {
  src?: string;
  url?: string;
  caption?: string;
}) {
  let node: React.ReactNode = null;

  if (src) {
    node = (
      <video
        src={src}
        controls
        playsInline
        className="w-full rounded-2xl border border-border bg-black"
      />
    );
  } else if (url) {
    const tiktok = url.match(/video\/(\d+)/)?.[1];
    const yt = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
    )?.[1];
    if (tiktok) {
      node = (
        <iframe
          title="TikTok"
          src={`https://www.tiktok.com/embed/v2/${tiktok}`}
          className="mx-auto aspect-[9/16] w-full max-w-[325px] rounded-2xl border border-border"
          allow="encrypted-media"
        />
      );
    } else if (yt) {
      node = (
        <iframe
          title="YouTube"
          src={`https://www.youtube.com/embed/${yt}`}
          className="aspect-video w-full rounded-2xl border border-border"
          allow="encrypted-media; picture-in-picture"
        />
      );
    } else {
      node = (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4"
        >
          Watch →
        </a>
      );
    }
  }

  return (
    <div>
      {node}
      {caption && <p className="mt-2 text-sm text-muted">{caption}</p>}
    </div>
  );
}

function Questions({
  dayId,
  intro,
  questions,
}: {
  dayId: string;
  intro?: string;
  questions: string[];
}) {
  const [values, setValues] = useState<string[]>(() => questions.map(() => ""));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const data: Record<string, string> = {};
    questions.forEach((q, i) => {
      data[`q${i}`] = q;
      data[`a${i}`] = values[i];
    });
    try {
      await saveAnswers(dayId, data);
    } catch {
      /* ignore — still show a warm confirmation */
    }
    setSaving(false);
    setSaved(true);
  }

  if (saved) {
    return (
      <p className="font-serif text-lg text-foreground">
        Saved. Thank you for these ♡
        {!firebaseReady && (
          <span className="mt-1 block font-sans text-xs text-faint">
            (answers aren&apos;t being stored yet — Firebase isn&apos;t configured)
          </span>
        )}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {intro && <p className="leading-relaxed text-foreground/90">{intro}</p>}
      {questions.map((q, i) => (
        <div key={i}>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {q}
          </label>
          <textarea
            value={values[i]}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              setValues(next);
            }}
            rows={3}
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-accent"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-accent px-5 py-2.5 font-medium text-white transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {saving ? "Saving…" : "Send to Arjun"}
      </button>
    </form>
  );
}
