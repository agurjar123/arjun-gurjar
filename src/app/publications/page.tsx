import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications and conference presentations",
};

const typeLabel: Record<string, string> = {
  conference: "Conference",
  journal: "Journal",
  preprint: "Preprint",
};

const typeColor: Record<string, string> = {
  conference: "bg-accent-soft text-accent",
  journal: "bg-accent-soft text-accent",
  preprint: "bg-surface-muted text-muted",
};

export default function PublicationsPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Publications"
        subtitle="Papers, preprints, and conference presentations."
      />

      <div className="flex flex-col gap-4">
        {publications.map((pub, i) => (
          <div
            key={i}
            className="rounded-2xl bg-surface border border-border p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className={`font-mono text-[11px] tracking-wide px-2.5 py-0.5 rounded-full shrink-0 mt-0.5 ${typeColor[pub.type]}`}>
                {typeLabel[pub.type]}
              </span>
              {pub.highlight && (
                <span className="font-mono text-[11px] tracking-wide px-2.5 py-0.5 rounded-full shrink-0 mt-0.5 bg-accent-soft text-accent">
                  ★ {pub.highlight}
                </span>
              )}
            </div>

            <h2 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2">
              {pub.url ? (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </h2>

            <p className="text-sm text-muted mb-1">{pub.authors}</p>
            <p className="text-sm text-faint">
              <span className="italic">{pub.venue}</span>
              {pub.year && <span> · {pub.year}</span>}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
