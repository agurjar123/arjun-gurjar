// Spotify track search via the Client-Credentials flow (no user login). Needs
// SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET env vars (server-only). If they're
// not set, returns { tracks: [], error: "not_configured" } so the UI can fall
// back to pasting a Spotify link.

type TokenCache = { value: string; exp: number };
let cached: TokenCache | null = null;

async function getToken(): Promise<string | null> {
  if (cached && cached.exp > Date.now()) return cached.value;
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  cached = { value: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.value;
}

type SpotifyArtist = { name: string };
type SpotifyImage = { url: string };
type SpotifyTrack = {
  id: string;
  name: string;
  artists?: SpotifyArtist[];
  album?: { images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
};

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return Response.json({ tracks: [] });

  const token = await getToken();
  if (!token) return Response.json({ tracks: [], error: "not_configured" });

  const res = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  if (!res.ok) return Response.json({ tracks: [], error: "search_failed" });

  const data = await res.json();
  const items: SpotifyTrack[] = data.tracks?.items ?? [];
  const tracks = items.map((t) => ({
    id: t.id,
    name: t.name,
    artist: (t.artists ?? []).map((a) => a.name).join(", "),
    url: t.external_urls?.spotify ?? `https://open.spotify.com/track/${t.id}`,
    image: t.album?.images?.[2]?.url ?? t.album?.images?.[0]?.url ?? "",
  }));
  return Response.json({ tracks });
}
