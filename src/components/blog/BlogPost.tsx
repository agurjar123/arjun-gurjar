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
        <p className="text-sm text-slate-400 mb-2">{formattedDate}</p>
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4">{title}</h1>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag} variant="blue">
              {tag}
            </Tag>
          ))}
        </div>
      </header>

      <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-800 prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sky-700 prose-code:bg-sky-50 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        {children}
      </div>
    </article>
  );
}
