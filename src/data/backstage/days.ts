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

export type ChatMessage = {
  from: "arjun" | "seher";
  text?: string;
  photo?: string; // public path (for scripted msgs) or a URL (for saved replies)
  ts?: number;
};

export type DayContent =
  | { type: "photos"; photos: { src: string; caption?: string }[] }
  | { type: "playlist"; spotifyUrl: string; note?: string }
  | { type: "questions"; intro?: string; questions: string[] }
  | { type: "note"; title?: string; body: string }
  | { type: "chat"; messages: ChatMessage[]; promptReply?: boolean };

export type AdventDay = {
  id: string; // stable, used as localStorage + Firebase key
  date: string; // "YYYY-MM-DD", unlocks on/after this date (Pacific)
  title: string;
  crypticAnswer: string; // the day's shared minute-cryptic solution
  hint?: string;
  content?: DayContent;
};

// Placeholder schedule (Aug 1 → 17). Swap answers + content for the real ones.
export const days: AdventDay[] = [
  {
    id: "aug-01",
    date: "2026-08-01",
    title: "Day One",
    crypticAnswer: "placeholder",
    hint: "Replace me in src/data/backstage/days.ts",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "hi baby :)" },
        { from: "arjun", text: "day one. I couldn't wait to start this with you" },
        { from: "arjun", text: "here's my favorite one of us" },
        { from: "arjun", photo: "/backstage/us-favorite.jpg" },
        { from: "arjun", text: "your turn — send me one back? ♡" },
      ],
    },
  },
  { id: "aug-02", date: "2026-08-02", title: "Day Two", crypticAnswer: "placeholder" },
  { id: "aug-03", date: "2026-08-03", title: "Day Three", crypticAnswer: "placeholder" },
  { id: "aug-04", date: "2026-08-04", title: "Day Four", crypticAnswer: "placeholder" },
  { id: "aug-05", date: "2026-08-05", title: "Day Five", crypticAnswer: "placeholder" },
  { id: "aug-06", date: "2026-08-06", title: "Day Six", crypticAnswer: "placeholder" },
  { id: "aug-07", date: "2026-08-07", title: "Day Seven", crypticAnswer: "placeholder" },
  { id: "aug-08", date: "2026-08-08", title: "Day Eight", crypticAnswer: "placeholder" },
  { id: "aug-09", date: "2026-08-09", title: "Day Nine", crypticAnswer: "placeholder" },
  { id: "aug-10", date: "2026-08-10", title: "Day Ten", crypticAnswer: "placeholder" },
  { id: "aug-11", date: "2026-08-11", title: "Day Eleven", crypticAnswer: "placeholder" },
  { id: "aug-12", date: "2026-08-12", title: "Day Twelve", crypticAnswer: "placeholder" },
  { id: "aug-13", date: "2026-08-13", title: "Day Thirteen", crypticAnswer: "placeholder" },
  { id: "aug-14", date: "2026-08-14", title: "Day Fourteen", crypticAnswer: "placeholder" },
  { id: "aug-15", date: "2026-08-15", title: "Day Fifteen", crypticAnswer: "placeholder" },
  { id: "aug-16", date: "2026-08-16", title: "Day Sixteen", crypticAnswer: "placeholder" },
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
