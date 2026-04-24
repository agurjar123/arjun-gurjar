export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
};

const CHANNEL_ID = "UCFCWi3rN1uI66EMs9NWzCRg";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export async function getChannelVideos(): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = xml.split("<entry>").slice(1);
    return entries
      .map((entry) => {
        const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
        const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
        const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
        const thumbnail =
          entry.match(/media:thumbnail url="([^"]+)"/)?.[1] ??
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        return {
          id,
          title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
          url: `https://www.youtube.com/watch?v=${id}`,
          thumbnail,
          publishedAt,
        };
      })
      .filter((v) => v.id && v.title);
  } catch {
    return [];
  }
}
