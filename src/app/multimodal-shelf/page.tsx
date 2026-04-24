import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import { playlists } from "@/data/playlists";
import { getAllPlaylistCovers } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "Multimodal Shelf — Arjun Gurjar",
  description: "Books, films, and music that have stayed with me",
};

export default async function MultimodalShelfPage() {
  const covers = await getAllPlaylistCovers(playlists);

  return (
    <Container className="py-16 space-y-16">
      <SectionHeader
        title="Multimodal Shelf"
        subtitle="Books, films, and music that have stayed with me."
      />

      {/* Books */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Books</h2>
        <Card>
          <p className="text-xs text-slate-400">Coming soon.</p>
        </Card>
      </section>

      {/* Films */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Films</h2>
        <Card>
          <p className="text-xs text-slate-400">Coming soon.</p>
        </Card>
      </section>

      {/* Music */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Music</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {covers.map((playlist) => (
            <a
              key={playlist.id}
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2"
            >
              {playlist.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  className="w-full aspect-square rounded-xl object-cover shadow-[var(--shadow-card)] group-hover:shadow-md transition-shadow"
                />
              ) : (
                <div className="w-full aspect-square rounded-xl bg-surface-muted border border-surface-border" />
              )}
              <p className="text-xs text-slate-500 text-center group-hover:text-slate-800 transition-colors truncate">
                {playlist.label}
              </p>
            </a>
          ))}
        </div>
      </section>
    </Container>
  );
}
