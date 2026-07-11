import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { getChannelVideos } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, notes, and science videos",
};

export default async function WritingPage() {
  const posts = getAllPosts();
  const videos = await getChannelVideos();

  return (
    <Container className="py-16 space-y-16">
      <SectionHeader
        title="Writing"
        subtitle="Essays, notes, and science communication."
      />

      {/* YouTube / Videos */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Videos</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          I occasionally write science scripts for{" "}
          <a
            href="https://www.youtube.com/@tldrscience"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-4"
          >
            TLDR Science
          </a>
          , a YouTube channel run by Patrick Kelly that covers recent research in accessible language.
        </p>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] overflow-hidden hover:border-accent/40 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors leading-snug">
                    {video.title}
                  </p>
                  <p className="font-mono text-xs text-faint mt-1.5">
                    {new Date(video.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <a
            href="https://www.youtube.com/@tldrscience"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted border border-border text-sm text-foreground hover:border-accent/40 hover:text-accent transition-colors"
          >
            Watch on YouTube →
          </a>
        )}
      </section>

      {/* Blog posts */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-faint">No posts yet. Check back soon.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </section>

      {/* Now */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Now</h2>
        <p className="text-sm text-muted mb-4">What I&apos;m currently thinking about, reading, and building.</p>
        <p className="text-sm text-faint">Check back soon.</p>
        <p className="mt-6 font-mono text-xs text-faint">
          Inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-accent"
          >
            nownownow.com
          </a>
        </p>
      </section>
    </Container>
  );
}
