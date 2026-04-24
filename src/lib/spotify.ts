export type PlaylistCover = {
  id: string;
  label: string;
  title: string;
  thumbnail: string;
  url: string;
};

export async function getPlaylistCover(id: string, label: string): Promise<PlaylistCover> {
  const spotifyUrl = `https://open.spotify.com/playlist/${id}`;
  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`,
      { next: { revalidate: 86400 } }
    );
    if (res.ok) {
      const data = await res.json();
      return {
        id,
        label,
        title: data.title ?? label,
        thumbnail: data.thumbnail_url ?? "",
        url: spotifyUrl,
      };
    }
  } catch {}
  return { id, label, title: label, thumbnail: "", url: spotifyUrl };
}

export async function getAllPlaylistCovers(
  playlists: { id: string; label: string }[]
): Promise<PlaylistCover[]> {
  return Promise.all(playlists.map((p) => getPlaylistCover(p.id, p.label)));
}
