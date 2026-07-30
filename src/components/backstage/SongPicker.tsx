"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { TimelineSong } from "@/lib/firebase";

export default function SongPicker({
  onPick,
  onClose,
}: {
  onPick: (song: TimelineSong) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<TimelineSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [link, setLink] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setNotConfigured(data.error === "not_configured");
      setResults((data.tracks ?? []) as TimelineSong[]);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function usePasted() {
    const url = link.trim();
    if (!url.includes("spotify.com")) return;
    onPick({ url });
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] bs-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold text-foreground">Link a song</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted transition-colors hover:text-accent"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={search} className="flex gap-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search a song…"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent p-2.5 text-white transition-colors hover:bg-accent-strong"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </form>

        {loading && <p className="mt-4 text-sm text-muted">Searching…</p>}

        {!loading && results.length > 0 && (
          <ul className="mt-4 space-y-1">
            {results.map((t) => (
              <li key={t.url}>
                <button
                  onClick={() => onPick(t)}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-surface-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {t.image ? (
                    <img src={t.image} alt="" className="h-10 w-10 rounded object-cover" />
                  ) : (
                    <span className="h-10 w-10 rounded bg-surface-muted" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {t.name}
                    </span>
                    <span className="block truncate text-xs text-muted">{t.artist}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {(notConfigured || (!loading && q && results.length === 0)) && (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-xs text-faint">
              {notConfigured
                ? "Song search isn't set up — paste a Spotify link instead."
                : "No results — or paste a Spotify link directly."}
            </p>
            <div className="flex gap-2">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://open.spotify.com/track/…"
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
              <button
                onClick={usePasted}
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
