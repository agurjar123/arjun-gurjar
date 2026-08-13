// Movie search via TMDB, proxied server-side so the browser only ever calls our
// own origin (never blocked by CORS or content blockers). Set ONE of:
//   TMDB_ACCESS_TOKEN  — the v4 "API Read Access Token" (recommended), or
//   TMDB_API_KEY       — the v3 API key.
// If neither is set, returns { movies: [], error: "not_configured" }.

const IMG_BASE = "https://image.tmdb.org/t/p/w342";

type TmdbMovie = {
  title?: string;
  release_date?: string;
  poster_path?: string | null;
  popularity?: number;
};

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return Response.json({ movies: [] });

  const token = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;
  if (!token && !apiKey) return Response.json({ movies: [], error: "not_configured" });

  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("query", q);
  url.searchParams.set("include_adult", "false");
  if (apiKey && !token) url.searchParams.set("api_key", apiKey);

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) return Response.json({ movies: [], error: "search_failed" });

  const data = await res.json();
  const rows: TmdbMovie[] = Array.isArray(data.results) ? data.results : [];
  const movies = rows
    .slice(0, 10)
    .map((m) => ({
      title: m.title ?? "",
      year: m.release_date?.slice(0, 4) ?? "",
      cover: m.poster_path ? `${IMG_BASE}${m.poster_path}` : "",
    }))
    .filter((m) => m.title);

  return Response.json({ movies });
}
