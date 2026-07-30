"use client";

import { useEffect, useState } from "react";

// Full-screen greeting for Seher. Stays until she clicks "continue" (once per
// session), so it never fades on its own. Skipped when Arjun is logged in.
export default function IntroAnimation() {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let skip = false;
    try {
      skip =
        sessionStorage.getItem("backstage_greeted") === "1" ||
        localStorage.getItem("backstage_me") === "arjun";
    } catch {
      /* ignore */
    }
    if (skip) return;
    setRender(true);
    const t = setTimeout(() => setVisible(true), 30); // fade in
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem("backstage_greeted", "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
    setTimeout(() => setRender(false), 500); // let it fade out
  }

  if (!render) return null;

  return (
    <div
      className={`fixed inset-0 z-[3000] flex flex-col items-center justify-center gap-10 bg-background px-6 text-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-serif text-4xl font-semibold text-foreground sm:text-6xl">
        Hi Sehru <span className="text-accent">:)</span>
      </span>
      <button
        onClick={dismiss}
        className="rounded-full bg-accent px-7 py-3 font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-accent-strong"
      >
        continue to website →
      </button>
    </div>
  );
}
