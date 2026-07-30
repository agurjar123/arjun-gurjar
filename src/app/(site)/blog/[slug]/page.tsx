import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/ui/Container";
import BlogPost from "@/components/blog/BlogPost";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <Container className="py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        Back to blog
      </Link>

      <BlogPost title={post.title} date={post.date} tags={post.tags}>
        <MDXRemote source={post.content} />
      </BlogPost>
    </Container>
  );
}
