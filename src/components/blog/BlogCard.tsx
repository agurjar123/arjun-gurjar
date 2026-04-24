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
      <article className="rounded-2xl bg-white border border-surface-border p-6 transition-shadow hover:shadow-md shadow-[var(--shadow-card)]">
        <p className="text-xs text-slate-400 mb-2">{formattedDate}</p>
        <h2 className="font-semibold text-slate-800 text-lg group-hover:text-sky-700 transition-colors mb-2 leading-snug">
          {title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{excerpt}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag} variant="gray">
              {tag}
            </Tag>
          ))}
        </div>
      </article>
    </Link>
  );
}
