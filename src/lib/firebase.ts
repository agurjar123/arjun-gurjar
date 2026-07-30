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
  type Database,
} from "firebase/database";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once the env config is present (map sync + answers become live). */
export const firebaseReady = Boolean(config.apiKey && config.databaseURL);

let db: Database | null = null;

function getDb(): Database | null {
  if (!firebaseReady) return null;
  if (!db) {
    const app: FirebaseApp = getApps().length
      ? getApp()
      : initializeApp(config);
    db = getDatabase(app);
  }
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
