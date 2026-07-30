"use client";

import { useEffect, useState } from "react";
import { subscribeAnswers, firebaseReady } from "@/lib/firebase";

// Arjun's private password to read Seher's answers. Change this to whatever you like.
const ARJUN_PASSWORD = "arjungurjar";

type Entry = Record<string, string | number>;
type AnswersData = Record<string, Record<string, Entry>>;

export default function AnswersView() {
  const [ok, setOk] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [data, setData] = useState<AnswersData | null>(null);

  useEffect(() => {
    if (!ok) return;
    return subscribeAnswers((d) => setData((d as AnswersData) ?? {}));
  }, [ok]);

  if (!ok) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim().toLowerCase() === ARJUN_PASSWORD) setOk(true);
          else setError(true);
        }}
        className="mx-auto mt-24 w-full max-w-sm rounded-3xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-soft)]"
      >
        <h1 className="font-serif text-2xl font-semibold text-foreground">Her answers</h1>
        <p className="mt-2 text-sm text-muted">Arjun only.</p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          className="mt-6 w-full rounded-full border border-border bg-background px-5 py-3 text-center text-foreground outline-none focus:border-accent"
        />
        {error && <p className="mt-3 text-sm text-accent">Nope.</p>}
        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-accent px-5 py-3 font-medium text-white hover:bg-accent-strong"
        >
          Read
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-20">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground">Her answers</h1>
      {!firebaseReady && (
        <p className="text-muted">Firebase isn&apos;t configured yet, so nothing is stored.</p>
      )}
      {firebaseReady && !data && <p className="text-muted">Loading…</p>}
      {firebaseReady && data && Object.keys(data).length === 0 && (
        <p className="text-muted">No answers yet.</p>
      )}
      <div className="space-y-8">
        {data &&
          Object.entries(data).map(([dayId, entries]) => (
            <section key={dayId}>
              <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                {dayId}
              </h2>
              {Object.entries(entries).map(([pushId, entry]) => {
                const keys = Object.keys(entry)
                  .filter((k) => k.startsWith("q"))
                  .sort();
                return (
                  <div
                    key={pushId}
                    className="mb-4 rounded-2xl border border-border bg-surface p-5"
                  >
                    {keys.map((qk) => {
                      const i = qk.slice(1);
                      return (
                        <div key={qk} className="mb-3 last:mb-0">
                          <p className="text-sm font-medium text-foreground">
                            {String(entry[qk])}
                          </p>
                          <p className="mt-1 whitespace-pre-line text-muted">
                            {String(entry[`a${i}`] ?? "")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </section>
          ))}
      </div>
    </div>
  );
}
