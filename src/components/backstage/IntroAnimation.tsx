"use client";

import { useEffect, useState } from "react";

// Plays "Hi Sehru :)" once per browser session (first view after unlocking),
// fading in, holding, then fading out.
export default function IntroAnimation() {
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let greeted = false;
    try {
      greeted = sessionStorage.getItem("backstage_greeted") === "1";
    } catch {
      /* ignore */
    }
    if (greeted) return;
    try {
      sessionStorage.setItem("backstage_greeted", "1");
    } catch {
      /* ignore */
    }

    setRender(true);
    const inT = setTimeout(() => setVisible(true), 30); // trigger fade-in
    const outT = setTimeout(() => setVisible(false), 2000); // fade-out
    const doneT = setTimeout(() => setRender(false), 2800); // unmount
    return () => {
      clearTimeout(inT);
      clearTimeout(outT);
      clearTimeout(doneT);
    };
  }, []);

  if (!render) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="font-serif text-4xl sm:text-5xl font-semibold text-foreground">
        Hi Sehru <span className="text-accent">:)</span>
      </span>
    </div>
  );
}
