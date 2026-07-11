import Tag from "@/components/ui/Tag";
import type { BlogMeta } from "@/types/blog";

export default function BlogPost({
  title,
  date,
  tags,
  children,
}: Pick<BlogMeta, "title" | "date" | "tags"> & { children: React.ReactNode }) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <p className="font-mono text-sm text-faint mb-3">{formattedDate}</p>
        <h1 className="font-serif text-4xl font-semibold text-foreground leading-tight mb-4">{title}</h1>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag} variant="accent">
              {tag}
            </Tag>
          ))}
        </div>
      </header>

      <div className="prose max-w-none prose-headings:font-serif prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-code:bg-surface-muted prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        {children}
      </div>
    </article>
  );
}
