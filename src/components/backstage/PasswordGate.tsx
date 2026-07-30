"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/cn";

const KEY = "backstage_unlocked";
const ME_KEY = "backstage_me";
// Seher's shared password, and Arjun's own — the password decides whose device
// this is (so the map tags the right pin).
const SEHER_PASSWORD = "pshaw";
const ARJUN_PASSWORD = "open";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const entered = value.trim().toLowerCase();
    if (entered === SEHER_PASSWORD || entered === ARJUN_PASSWORD) {
      const who = entered === ARJUN_PASSWORD ? "arjun" : "seher";
      try {
        localStorage.setItem(KEY, "1");
        localStorage.setItem(ME_KEY, who);
        // Let the greeting play again for this fresh unlock.
        sessionStorage.removeItem("backstage_greeted");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
      setValue("");
    }
  }

  // Avoid a flash of the gate for already-unlocked visitors.
  if (!mounted) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className={cn(
          "w-full max-w-sm rounded-3xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-soft)] bs-rise",
          error && "animate-[bs-pulse_0.4s_ease]"
        )}
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Lock size={20} />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Backstage</h1>
        <p className="mt-2 text-sm text-muted">A little something, just for you.</p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="password"
          aria-label="Password"
          className="mt-6 w-full rounded-full border border-border bg-background px-5 py-3 text-center text-foreground outline-none transition-colors focus:border-accent"
        />

        {error && (
          <p className="mt-3 text-sm text-accent">Not quite — try again ♡</p>
        )}

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-accent px-5 py-3 font-medium text-white transition-colors hover:bg-accent-strong"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
