import Link from "next/link";
import Tag from "@/components/ui/Tag";
import type { BlogMeta } from "@/types/blog";

export default function BlogCard({ title, date, excerpt, tags, slug }: BlogMeta) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/writing/${slug}`} className="block group">
      <article className="rounded-2xl bg-surface border border-border p-6 transition-all hover:border-accent/40 hover:shadow-[var(--shadow-soft)] shadow-[var(--shadow-card)]">
        <p className="font-mono text-xs text-faint mb-2">{formattedDate}</p>
        <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
          {title}
        </h2>
        <p className="text-sm text-muted leading-relaxed mb-4">{excerpt}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag} variant="neutral">
              {tag}
            </Tag>
          ))}
        </div>
      </article>
    </Link>
  );
}
