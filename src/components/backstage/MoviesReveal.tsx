"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Movie = { id?: string; list: "fav" | "watch"; title: string; year?: string; cover?: string };
type Result = { title: string; year?: string; cover?: string };

function Poster({ title, cover }: { title: string; cover?: string }) {
  if (cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={cover} alt={title} className="h-full w-full object-cover" draggable={false} />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted p-2 text-center">
      <span className="line-clamp-4 font-serif text-[11px] font-medium leading-tight text-muted">
        {title}
      </span>
    </div>
  );
}

function MovieSection({
  dayId,
  me,
  list,
  title,
  emoji,
  movies,
}: {
  dayId: string;
  me: "arjun" | "seher";
  list: "fav" | "watch";
  title: string;
  emoji: string;
  movies: Movie[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced iTunes movie search (free, keyless, CORS-friendly).
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?media=movie&limit=8&term=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        const rows = Array.isArray(data.results) ? data.results : [];
        const seen = new Set<string>();
        const mapped: Result[] = [];
        for (const r of rows as {
          trackName?: string;
          artworkUrl100?: string;
          releaseDate?: string;
        }[]) {
          if (!r.trackName || seen.has(r.trackName)) continue;
          seen.add(r.trackName);
          mapped.push({
            title: r.trackName,
            year: r.releaseDate?.slice(0, 4),
            cover: r.artworkUrl100?.replace("100x100bb", "600x600bb"),
          });
        }
        setResults(mapped);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function add(r: Result) {
    setQuery("");
    setResults([]);
    setOpen(false);
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({
        kind: "movie",
        list,
        title: r.title,
        year: r.year ?? "",
        cover: r.cover ?? "",
      }),
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="font-serif text-lg font-semibold text-foreground">{title}</span>
        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] text-white">
          {movies.length}
        </span>
      </div>

      {/* Search */}
      <div ref={boxRef} className="relative mb-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 focus-within:border-accent">
          <Search size={15} className="shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="search a movie…"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
          />
          {searching && <Loader2 size={15} className="shrink-0 animate-spin text-faint" />}
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-soft)]">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => add(r)}
                  className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-muted"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-[2px] border border-border">
                    <Poster title={r.title} cover={r.cover} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                    {r.year && <p className="text-xs text-muted">{r.year}</p>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Poster grid */}
      {movies.length === 0 ? (
        <p className="pb-1 text-sm text-faint">nothing here yet…</p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {movies.map((m) => (
            <div key={m.id ?? m.title} className="group/movie relative w-[4.8rem]">
              <div className="h-[7.2rem] w-full overflow-hidden rounded-md border border-black/10 shadow-[0_3px_6px_rgba(0,0,0,.2)]">
                <Poster title={m.title} cover={m.cover} />
              </div>
              <button
                onClick={() => m.id && deleteChatMessage(dayId, m.id)}
                aria-label="Remove movie"
                className="absolute -right-1.5 -top-1.5 rounded-full bg-surface p-0.5 text-faint opacity-0 shadow transition-opacity hover:text-red-500 group-hover/movie:opacity-100"
              >
                <X size={12} />
              </button>
              <p className="mt-1 truncate text-center text-[9px] text-faint">{m.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MoviesReveal({
  dayId,
  intro,
}: {
  dayId: string;
  intro?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [movies, setMovies] = useState<Movie[]>([]);

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
        const parsed: Movie[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o?.kind === "movie") {
              parsed.push({
                id: m.id,
                list: o.list === "watch" ? "watch" : "fav",
                title: o.title,
                year: o.year,
                cover: o.cover,
              });
            }
          } catch {
            /* ignore */
          }
        }
        setMovies(parsed);
      }),
    [dayId]
  );

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}
      <div className="space-y-6">
        <MovieSection
          dayId={dayId}
          me={me}
          list="fav"
          title="favorites"
          emoji="⭐"
          movies={movies.filter((m) => m.list === "fav")}
        />
        <MovieSection
          dayId={dayId}
          me={me}
          list="watch"
          title="watch list"
          emoji="🍿"
          movies={movies.filter((m) => m.list === "watch")}
        />
      </div>
    </div>
  );
}
