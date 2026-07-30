import type { LatLng } from "@/lib/distance";

// ─────────────────────────────────────────────────────────────────────────────
// Backstage schedule + map data.
//
// Arjun: replace `crypticAnswer` and `content` for each day as you go. A day's
// card unlocks on/after its `date` (America/Los_Angeles), then opens when Seher
// enters that day's minute-cryptic answer (case-insensitive, spaces ignored).
// Content is optional until you fill it — the card still unlocks and shows a
// friendly placeholder.
// ─────────────────────────────────────────────────────────────────────────────

/** The moment she lands in SF (BA 287) — the countdown target. */
export const LANDING_ISO = "2026-08-17T17:40:00-07:00";

export type DayContent =
  | { type: "photos"; photos: { src: string; caption?: string }[] }
  | { type: "playlist"; spotifyUrl: string; note?: string }
  | { type: "questions"; intro?: string; questions: string[] }
  | { type: "note"; title?: string; body: string };

export type AdventDay = {
  id: string; // stable, used as localStorage + Firebase key
  date: string; // "YYYY-MM-DD", unlocks on/after this date (Pacific)
  title: string;
  crypticAnswer: string; // the day's shared minute-cryptic solution
  hint?: string;
  content?: DayContent;
};

// Placeholder schedule (Aug 12 → 17). Swap answers + content for the real ones.
export const days: AdventDay[] = [
  {
    id: "aug-12",
    date: "2026-08-12",
    title: "Day One",
    crypticAnswer: "placeholder",
    hint: "Replace me in src/data/backstage/days.ts",
    content: {
      type: "note",
      title: "A little something",
      body: "This is where the first surprise goes. Photos, a playlist, or a set of questions — Arjun will drop it in.",
    },
  },
  { id: "aug-13", date: "2026-08-13", title: "Day Two", crypticAnswer: "placeholder" },
  { id: "aug-14", date: "2026-08-14", title: "Day Three", crypticAnswer: "placeholder" },
  { id: "aug-15", date: "2026-08-15", title: "Day Four", crypticAnswer: "placeholder" },
  { id: "aug-16", date: "2026-08-16", title: "Day Five", crypticAnswer: "placeholder" },
  {
    id: "aug-17",
    date: "2026-08-17",
    title: "Landing Day",
    crypticAnswer: "placeholder",
    content: {
      type: "note",
      title: "You're here",
      body: "The last one. For when she's just landed. 💛",
    },
  },
];

// ── Map ──────────────────────────────────────────────────────────────────────

export type Checkpoint = LatLng & { name: string };

/** Her journey, drawn as a dashed route at low zoom. */
export const checkpoints: Checkpoint[] = [
  { name: "New Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Windsor", lat: 51.4839, lng: -0.6044 },
  { name: "San Francisco", lat: 37.6213, lng: -122.379 },
  { name: "Berkeley", lat: 37.8715, lng: -122.273 },
];

/** Fallbacks used when a live location isn't available (permission denied, etc.). */
export const ARJUN_FALLBACK: LatLng = { lat: 37.8715, lng: -122.273 }; // Berkeley
export const SEHER_FALLBACK: LatLng = { lat: 51.4839, lng: -0.6044 }; // Windsor

/** Baby photos for the precise map pins (drop files here). */
export const ARJUN_PHOTO = "/backstage/arjun-baby.jpg";
export const SEHER_PHOTO = "/backstage/seher-baby.jpg";
