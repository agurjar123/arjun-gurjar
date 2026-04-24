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
              <div className="relative w-full aspect-square">
                {playlist.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={playlist.thumbnail}
                    alt={playlist.title}
                    className="w-full h-full rounded-xl object-cover shadow-[var(--shadow-card)] group-hover:shadow-md transition-shadow"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-surface-muted border border-surface-border" />
                )}
                {/* Spotify badge — always visible */}
                <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="#1DB954" className="w-3.5 h-3.5">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-full">
                    Open in Spotify
                  </span>
                </div>
              </div>
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
