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
  id?: string; // set on saved replies (used to delete them)
  from: "arjun" | "seher";
  text?: string;
  photo?: string; // public path (for scripted msgs) or a URL (for saved replies)
  video?: string; // public path (scripted) or a data URL (short saved replies)
  ts?: number;
};

export type DayContent =
  | { type: "photos"; photos: { src: string; caption?: string }[] }
  | { type: "playlist"; spotifyUrl: string; note?: string }
  | { type: "questions"; intro?: string; questions: string[] }
  | { type: "note"; title?: string; body: string }
  | { type: "chat"; messages: ChatMessage[]; promptReply?: boolean }
  | { type: "video"; src?: string; url?: string; caption?: string }
  | { type: "youtube"; videos: string[]; intro?: string; prompt?: boolean }
  | { type: "journal"; prompt?: string; entry?: string }
  | { type: "friends"; intro?: string; photos: { src: string; answer?: string }[] }
  | { type: "shopping"; intro?: string }
  | { type: "food"; intro?: string }
  | { type: "constitution"; intro?: string }
  | { type: "movies"; intro?: string }
  | {
      type: "bookshelf";
      intro?: string;
      books?: { title: string; author?: string; cover?: string }[];
    }
  | {
      type: "spots";
      intro?: string;
      center?: LatLng;
      radiusMi?: number;
      target?: number;
    };

export type AdventDay = {
  id: string; // stable, used as localStorage + Firebase key
  date: string; // "YYYY-MM-DD", unlocks on/after this date (Pacific)
  title: string;
  crypticAnswer: string; // the day's shared minute-cryptic solution
  hint?: string;
  content?: DayContent;
  alwaysOpen?: boolean; // preview flag: bypass the date lock
  typingTest?: string; // if set, the day unlocks by typing this passage (not the answer)
};

// Placeholder schedule (Aug 1 → 17). Swap answers + content for the real ones.
export const days: AdventDay[] = [
  {
    id: "aug-01",
    date: "2026-08-01",
    title: "T-minus 16",
    crypticAnswer: "cymbals",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "hi baby :)" },
        { from: "arjun", text: "day one let's do a photo" },
        { from: "arjun", text: "here's my favorite one of us" },
        { from: "arjun", photo: "/backstage/us-favorite.png" },
        { from: "arjun", text: "your turn 😘" },
      ],
    },
  },
  {
    id: "aug-02",
    date: "2026-08-02",
    title: "T-minus 15",
    crypticAnswer: "silent k",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "day twoo" },
        { from: "arjun", text: "let's do an embarassing video of ourselves, i'll go first" },
        { from: "arjun", video: "/backstage/embarassing.MOV" },
        { from: "arjun", text: "now you HAVE to send one back <3" },
      ],
    },
  },
  {
    id: "aug-03",
    date: "2026-08-03",
    title: "T-minus 14",
    crypticAnswer: "penal",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "day three 🎬" },
        {
          from: "arjun",
          text: "You only know somebody when you've seen their YouTube feed so here are my favorite youtube videos of all time :)",
        },
        { from: "arjun", text: "https://www.youtube.com/watch?v=56nQjJZIqoU" },
        { from: "arjun", text: "https://www.youtube.com/watch?v=UGO_Ehywuxc" },
        { from: "arjun", text: "https://www.youtube.com/watch?v=qcPS9KKJ5Vg" },
        { from: "arjun", text: "https://www.youtube.com/watch?v=vwLb3XlPCB4" },
        { from: "arjun", text: "https://www.youtube.com/watch?v=aRgqQe-8zYk" },
        { from: "arjun", text: "now send me yours 👀" },
      ],
    },
  },
  {
    id: "aug-04",
    date: "2026-08-04",
    title: "T-minus 13",
    crypticAnswer: "placeholder",
    alwaysOpen: true, // released early for her
    typingTest:
      "Lil Poopy Girl Who Is Sitting Up A Creep And Left A Screen On Low Restroom And I Love Pasta Ramana Car But I Like To Record Three Nakuru Mana India Has To Cover Is So Pick Up Pick Up Pick Up The Laptop ETA",
    content: {
      type: "journal",
      prompt: "If you had to write a journal entry today, what would it say? Save yours to reveal mine 👀",
      entry: `Hi Sehru :)
Isn’t it incredible that we made it past Delhi? I’m going to see you in 14 days. You’ve become such a core part of my every day routine and I get so excited when I think about what this new chapter of college is going to look like with you :)

I’ve been thinking a lot recently about what it means to be a good friend. On one hand I feel like a friend made once is a friend for life and half the struggle is extending patience to them even when it’s difficult. But on the other hand, sometimes people just take advantage of you and start to take you for granted and you need to be able to set those boundaries. I’m not very good at recognizing when a dynamic is being draining and so I’ve been trying to pay a lot more attention to this. I think I’ve learned a lot from you about how to just confront a problem when it bothers you and then also move on quickly. I also love how you always have your friends backs. You know who the really valuable people in your life are and you’re not afraid to piss other people off when you back your friends up.

When we started summer I set 3 goals for myself. The first was to be able to sing and play a song on the guitar. This one has had its ups and downs but we’re getting there. I’m not sure I’ll have it down by end of summer but I think I’ve definitely improved quite a bit. The second goal was to give my all to work since grad school is in the near future. I think I’ve done that and I genuinely look forward to work so much. I get up in the morning and I’m excited to get started which is something I haven’t as strongly before about other internships. The last was to make it out of long distance with you. As far as I can tell, that one is looking pretty good to me as well :)

Have a safe flight babyy and I’ll talk to you soon`,
    },
  },
  {
    id: "aug-05",
    date: "2026-08-05",
    title: "T-minus 12",
    crypticAnswer: "bigben",
    alwaysOpen: true, // released early for her
    content: {
      type: "friends",
      intro:
        "London edition 🇬🇧! I thought it would be funny to try and name each other's friends. You can try below and also upload ur photos and I'll try my best <3",
      photos: [
        { src: "/backstage/IMG_1233.JPG" },
        { src: "/backstage/IMG_3251.JPG" },
        { src: "/backstage/PHOTO-2025-11-28-14-00-21.jpg" },
        { src: "/backstage/777E67D4-CC4E-49A4-B7F3-8A0419B218A1_1_105_c.jpeg" },
      ],
    },
  },
  {
    id: "aug-06",
    date: "2026-08-06",
    title: "T-minus 11",
    crypticAnswer: "great apes",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "day six ⛏️" },
        { from: "arjun", text: "your mission: install minecraft and actually get it running" },
        { from: "arjun", text: "i need proof of you in a world :)" },
        { from: "arjun", text: "bonus points if you built something dumb <3" },
      ],
    },
  },
  {
    id: "aug-07",
    date: "2026-08-07",
    title: "T-minus 10",
    crypticAnswer: "parkirna ura",
    hint: "slovenians display this on their car when parking",
    content: {
      type: "shopping",
      intro:
        "Day seven 🛒 what's on your wishlist :) Sephora, sweatpants, earrings 👀",
    },
  },
  {
    id: "aug-08",
    date: "2026-08-08",
    title: "T-minus 9",
    crypticAnswer: "sofa",
    content: {
      type: "bookshelf",
      intro:
        "Day eight 📚 show me your bookshelf — search and add the books you love (or want to read).",
    },
  },
  {
    id: "aug-09",
    date: "2026-08-09",
    title: "T-minus 8",
    crypticAnswer: "stalactite",
    content: {
      type: "chat",
      promptReply: true,
      messages: [
        { from: "arjun", text: "day ninee" },
        { from: "arjun", text: "today is gonna be your favorite screenshot of our texts. here's mine :D" },
        { from: "arjun", photo: "/backstage/5C49E3EF-BBBC-416A-B4F0-FE119A565B37_1_105_c.jpeg" },
        { from: "arjun", text: "now you go" },
      ],
    },
  },
  {
    id: "aug-10",
    date: "2026-08-10",
    title: "T-minus 7",
    crypticAnswer: "i put you on",
    hint: "arnav's favorite phrase",
    content: {
      type: "spots",
      intro:
        "Day ten 📍 What are your 5 most underground, niche spots so I can get put on",
    },
  },
  {
    id: "aug-11",
    date: "2026-08-11",
    title: "T-minus 6",
    crypticAnswer: "gilf",
    hint: "out of pocket",
    content: {
      type: "food",
      intro:
        "Day eleven 🍴 give me your favorite food items AND your favorite restaurants",
    },
  },
  {
    id: "aug-12",
    date: "2026-08-12",
    title: "T-minus 5",
    crypticAnswer: "split",
    hint: "a gymnastic trick or a place where traveller's get weary",
    content: { type: "constitution" },
  },
  {
    id: "aug-13",
    date: "2026-08-13",
    title: "T-minus 4",
    crypticAnswer: "city of stars",
    hint: "look north of north and discover a civilization",
    content: {
      type: "movies",
      intro:
        "Day thirteen 🎬 movie bucket list: your all-time favorites, and the ones on our bucketlist :)",
    },
  },
  { id: "aug-14", date: "2026-08-14", title: "T-minus 3", crypticAnswer: "placeholder" },
  { id: "aug-15", date: "2026-08-15", title: "T-minus 2", crypticAnswer: "placeholder" },
  { id: "aug-16", date: "2026-08-16", title: "T-minus 1", crypticAnswer: "placeholder" },
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
export const SEHER_FALLBACK: LatLng = { lat: 28.6139, lng: 77.209 }; // New Delhi

/** Baby photos for the precise map pins (drop files here). */
export const ARJUN_PHOTO = "/backstage/arjun-baby.jpeg";
export const SEHER_PHOTO = "/backstage/seher-baby.jpeg";
