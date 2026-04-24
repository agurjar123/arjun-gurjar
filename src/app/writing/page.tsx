import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { videos } from "@/data/videos";

export const metadata: Metadata = {
  title: "Writing — Arjun Gurjar",
  description: "Essays, notes, and science videos",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16 space-y-16">
      <SectionHeader
        title="Writing"
        subtitle="Essays, notes, and science communication."
      />

      {/* YouTube / Videos */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Videos</h2>
        <p className="text-sm text-slate-500 mb-5">
          I write science scripts for{" "}
          <a
            href="https://www.youtube.com/@tldrscience"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:underline"
          >
            TLDR Science
          </a>
          , a YouTube channel with 115k+ subscribers that covers recent research papers in accessible language.
        </p>

        {videos.length > 0 ? (
          <div className="flex flex-col gap-3">
            {videos.map((video, i) => (
              <a
                key={i}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 rounded-2xl bg-white border border-surface-border p-4 shadow-[var(--shadow-card)] hover:border-pastel-blue transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-sky-700 transition-colors">{video.title}</p>
                  {video.description && <p className="text-xs text-slate-500 mt-0.5">{video.description}</p>}
                  {video.publishedAt && <p className="text-xs text-slate-400 mt-1">{video.publishedAt}</p>}
                </div>
                <ExternalLink size={14} className="text-slate-400 shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        ) : (
          <a
            href="https://www.youtube.com/@tldrscience"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-muted border border-surface-border text-sm text-slate-700 hover:bg-surface-border transition-colors"
          >
            <ExternalLink size={14} />
            Watch on YouTube
          </a>
        )}
      </section>

      {/* Blog posts */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-slate-400">No posts yet. Check back soon.</p>
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
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Now</h2>
        <p className="text-sm text-slate-400 mb-4">What I&apos;m currently thinking about, reading, and building.</p>
        <p className="text-sm text-slate-400">Check back soon.</p>
        <p className="mt-6 text-xs text-slate-400">
          Inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600"
          >
            nownownow.com
          </a>
        </p>
      </section>
    </Container>
  );
}
