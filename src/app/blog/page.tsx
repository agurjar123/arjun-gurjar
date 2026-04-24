import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Arjun Gurjar",
  description: "Writing on ideas, discoveries, and things I've learned",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Container className="py-16">
      <SectionHeader
        title="Blog"
        subtitle="Writing on ideas, discoveries, and things I've learned."
      />

      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </Container>
  );
}
