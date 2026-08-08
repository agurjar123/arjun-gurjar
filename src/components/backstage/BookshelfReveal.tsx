"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Book = { id?: string; title: string; author?: string; cover?: string };
type Result = { title: string; author?: string; cover?: string };

// Warm spine colors for books with no cover art.
const SPINES = ["#8c5a3b", "#a5502f", "#6b7a52", "#4a6272", "#9c6b4a", "#7c5568"];
function spineFor(title: string) {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) | 0;
  return SPINES[Math.abs(h) % SPINES.length];
}

function BookCover({ book }: { book: Book }) {
  if (book.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={book.cover}
        alt={book.title}
        className="h-full w-full object-cover"
        draggable={false}
      />
    );
  }
  return (
    <div
      className="flex h-full w-full items-center justify-center p-2 text-center"
      style={{ background: spineFor(book.title) }}
    >
      <span className="line-clamp-4 font-serif text-[11px] font-medium leading-tight text-white/95">
        {book.title}
      </span>
    </div>
  );
}

function Shelf({
  books,
  onRemove,
}: {
  books: Book[];
  onRemove?: (b: Book) => void;
}) {
  return (
    <div className="relative">
      <div className="flex min-h-[7.5rem] flex-wrap items-end gap-2 px-3 pb-1 pt-3">
        {books.length === 0 && (
          <p className="w-full pb-3 text-center text-sm text-faint">
            shelf&apos;s empty for now…
          </p>
        )}
        {books.map((b) => (
          <div key={b.id ?? b.title} className="group/book relative">
            <div className="h-28 w-[4.6rem] overflow-hidden rounded-[3px] border border-black/10 shadow-[0_3px_6px_rgba(0,0,0,.25)]">
              <BookCover book={b} />
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(b)}
                aria-label="Remove book"
                className="absolute -right-1.5 -top-1.5 rounded-full bg-surface p-0.5 text-faint opacity-0 shadow transition-opacity hover:text-red-500 group-hover/book:opacity-100"
              >
                <X size={12} />
              </button>
            )}
            {b.author && (
              <p className="mt-1 w-[4.6rem] truncate text-center text-[9px] text-faint">
                {b.author}
              </p>
            )}
          </div>
        ))}
      </div>
      {/* Wooden ledge */}
      <div className="h-2.5 w-full rounded-b-md bg-gradient-to-b from-[#a5764f] to-[#7c5433] shadow-[0_4px_8px_rgba(0,0,0,.28)]" />
    </div>
  );
}

export default function BookshelfReveal({
  dayId,
  intro,
  books,
}: {
  dayId: string;
  intro?: string;
  books?: Book[]; // Arjun's preset shelf
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [shelf, setShelf] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Her books are stored as JSON in chat messages (reuses the chat Firebase rule).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Book[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o && o.kind === "book") {
              parsed.push({ id: m.id, title: o.title, author: o.author, cover: o.cover });
            }
          } catch {
            /* ignore non-book messages */
          }
        }
        setShelf(parsed);
      }),
    [dayId]
  );

  // Debounced Open Library search (free, keyless, CORS-friendly).
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
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            q
          )}&limit=6&fields=title,author_name,cover_i`
        );
        const data = await res.json();
        const docs = Array.isArray(data.docs) ? data.docs : [];
        setResults(
          docs.map(
            (d: { title: string; author_name?: string[]; cover_i?: number }) => ({
              title: d.title,
              author: d.author_name?.[0],
              cover: d.cover_i
                ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
                : undefined,
            })
          )
        );
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function addBook(r: Result) {
    setQuery("");
    setResults([]);
    setOpen(false);
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({
        kind: "book",
        title: r.title,
        author: r.author ?? "",
        cover: r.cover ?? "",
      }),
    });
  }

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      {/* Search */}
      <div ref={boxRef} className="relative mb-5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 focus-within:border-accent">
          <Search size={15} className="shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="search a book to add…"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
          />
          {searching && <Loader2 size={15} className="shrink-0 animate-spin text-faint" />}
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-soft)]">
            {results.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => addBook(r)}
                  className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-muted"
                >
                  <div className="h-14 w-10 shrink-0 overflow-hidden rounded-[2px] border border-border">
                    <BookCover book={r} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                    {r.author && (
                      <p className="truncate text-xs text-muted">{r.author}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Her shelf */}
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
        your shelf
      </p>
      <Shelf
        books={shelf}
        onRemove={(b) => b.id && deleteChatMessage(dayId, b.id)}
      />

      {/* Arjun's preset shelf */}
      {books && books.length > 0 && (
        <div className="mt-6">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            arjun&apos;s shelf
          </p>
          <Shelf books={books} />
        </div>
      )}
    </div>
  );
}
