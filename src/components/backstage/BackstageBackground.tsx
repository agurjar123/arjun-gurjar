"use client";

import { useEffect, useRef } from "react";

// Dreamy pink-gold "cloud" backdrop: blurred radial blobs that drift on their
// own and parallax toward the cursor, plus a faint twinkle layer for glimmer.
export default function BackstageBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5; // -0.5 … 0.5
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="bs-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bs-blob bs-blob-1" />
      <div className="bs-blob bs-blob-2" />
      <div className="bs-blob bs-blob-3" />
      <div className="bs-blob bs-blob-4" />
      <div className="bs-sparkle" />
    </div>
  );
}
