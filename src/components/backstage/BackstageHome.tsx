"use client";

import dynamic from "next/dynamic";
import IntroAnimation from "./IntroAnimation";
import Countdown from "./Countdown";
import AdventGrid from "./AdventGrid";

// Leaflet touches `window`, so load the map client-only.
const DistanceMap = dynamic(() => import("./DistanceMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[440px] w-full rounded-3xl border border-border bg-surface-muted" />
  ),
});

export default function BackstageHome() {
  return (
    <>
      <IntroAnimation />
      <Countdown />

      <div className="mx-auto max-w-3xl space-y-16 px-5 py-20">
        <header className="bs-rise">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            for seher
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-foreground sm:text-5xl">
            Backstage
          </h1>
          <p className="mt-4 max-w-prose leading-relaxed text-muted">
            A countdown, a puzzle a day, and a map of the miles between us — until
            you land. We solve each day&apos;s cryptic together, and it opens
            something just for you.
          </p>
        </header>

        <section>
          <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">
            Where we are
          </h2>
          <DistanceMap />
          <p className="mt-3 text-xs text-faint">
            Allow location to drop your pin. Zoom in to leave the journey behind
            and see exactly where we each are.
          </p>
        </section>

        <section>
          <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">
            A puzzle a day
          </h2>
          <AdventGrid />
        </section>
      </div>
    </>
  );
}
