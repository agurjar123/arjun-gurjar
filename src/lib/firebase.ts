// Firebase Realtime Database helpers for Backstage: live location sync + saving
// Seher's answers. Web config keys are public by design (security is enforced by
// database rules), so they live in NEXT_PUBLIC_* env vars. Everything here is
// browser-only and degrades gracefully to no-ops until Firebase is configured.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  type Database,
} from "firebase/database";
import type { ChatMessage } from "@/data/backstage/days";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once the env config is present (map sync + answers + chat become live). */
export const firebaseReady = Boolean(config.apiKey && config.databaseURL);

let app: FirebaseApp | null = null;
function getFirebaseApp(): FirebaseApp {
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

let db: Database | null = null;
function getDb(): Database | null {
  if (!firebaseReady) return null;
  if (!db) db = getDatabase(getFirebaseApp());
  return db;
}

export type Person = "arjun" | "seher";
export type LivePoint = { lat: number; lng: number; ts: number };
export type LiveLocations = Partial<Record<Person, LivePoint>>;

/** Write the viewer's current position (called on load + on updates). */
export function writeMyLocation(who: Person, lat: number, lng: number): void {
  const database = getDb();
  if (!database) return;
  void set(ref(database, `locations/${who}`), { lat, lng, ts: Date.now() });
}

/** Subscribe to both people's positions. Returns an unsubscribe function. */
export function subscribeLocations(
  cb: (data: LiveLocations) => void
): () => void {
  const database = getDb();
  if (!database) return () => {};
  return onValue(ref(database, "locations"), (snap) => {
    cb((snap.val() as LiveLocations | null) ?? {});
  });
}

/** Append Seher's answers for a given day. */
export function saveAnswers(
  dayId: string,
  data: Record<string, string>
): Promise<unknown> {
  const database = getDb();
  if (!database) return Promise.resolve();
  return Promise.resolve(
    push(ref(database, `answers/${dayId}`), { ...data, ts: Date.now() })
  );
}

/** Subscribe to all saved answers (for Arjun's private view). */
export function subscribeAnswers(cb: (data: unknown) => void): () => void {
  const database = getDb();
  if (!database) return () => {};
  return onValue(ref(database, "answers"), (snap) => cb(snap.val()));
}

// ── Shared, editable timeline (both Arjun and Seher) ─────────────────────────

export type TimelineSong = {
  url: string;
  name?: string;
  artist?: string;
  image?: string;
};

export type TimelineEvent = {
  id?: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  note?: string;
  photos?: string[]; // compressed data URLs
  song?: TimelineSong | null;
  ts?: number;
};

export function subscribeTimeline(
  cb: (events: TimelineEvent[]) => void
): () => void {
  const database = getDb();
  if (!database) {
    cb([]);
    return () => {};
  }
  return onValue(ref(database, "timeline"), (snap) => {
    const val = snap.val() as Record<string, Omit<TimelineEvent, "id">> | null;
    const events: TimelineEvent[] = val
      ? Object.entries(val).map(([id, e]) => ({ ...e, id }))
      : [];
    cb(events);
  });
}

export function saveTimelineEvent(event: TimelineEvent): Promise<unknown> {
  const database = getDb();
  if (!database) return Promise.resolve();
  const payload = {
    date: event.date,
    title: event.title,
    note: event.note ?? "",
    photos: event.photos ?? [],
    song: event.song ?? null,
    ts: event.ts ?? Date.now(),
  };
  if (event.id) {
    return Promise.resolve(set(ref(database, `timeline/${event.id}`), payload));
  }
  return Promise.resolve(push(ref(database, "timeline"), payload));
}

export function deleteTimelineEvent(id: string): Promise<unknown> {
  const database = getDb();
  if (!database) return Promise.resolve();
  return Promise.resolve(remove(ref(database, `timeline/${id}`)));
}

// ── Chat (scripted messages + her replies) ───────────────────────────────────
// Photos are compressed to a small data URL client-side (see lib/image.ts) and
// stored inline in the message — no Firebase Storage needed.

export function subscribeChat(
  dayId: string,
  cb: (messages: ChatMessage[]) => void
): () => void {
  const database = getDb();
  if (!database) {
    cb([]);
    return () => {};
  }
  return onValue(ref(database, `chat/${dayId}`), (snap) => {
    const val = snap.val() as Record<string, ChatMessage> | null;
    const msgs = val
      ? Object.entries(val)
          .map(([id, m]) => ({ ...m, id }))
          .sort((a, b) => (a.ts ?? 0) - (b.ts ?? 0))
      : [];
    cb(msgs);
  });
}

export function deleteChatMessage(dayId: string, id: string): Promise<unknown> {
  const database = getDb();
  if (!database) return Promise.resolve();
  return Promise.resolve(remove(ref(database, `chat/${dayId}/${id}`)));
}

export function sendChatMessage(
  dayId: string,
  msg: ChatMessage
): Promise<unknown> {
  const database = getDb();
  if (!database) return Promise.resolve();
  return Promise.resolve(
    push(ref(database, `chat/${dayId}`), {
      from: msg.from,
      text: msg.text ?? "",
      photo: msg.photo ?? "",
      ts: Date.now(),
    })
  );
}
