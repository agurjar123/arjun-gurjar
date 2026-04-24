import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications — Arjun Gurjar",
  description: "Publications and conference presentations",
};

const typeLabel: Record<string, string> = {
  conference: "Conference",
  journal: "Journal",
  preprint: "Preprint",
};

const typeColor: Record<string, string> = {
  conference: "bg-pastel-blue/30 text-sky-800",
  journal: "bg-pastel-green/30 text-green-800",
  preprint: "bg-surface-muted text-slate-600",
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
            className="rounded-2xl bg-white border border-surface-border p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${typeColor[pub.type]}`}>
                {typeLabel[pub.type]}
              </span>
              {pub.highlight && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                  ★ {pub.highlight}
                </span>
              )}
            </div>

            <h2 className="font-semibold text-slate-800 leading-snug mb-2">
              {pub.url ? (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-700 transition-colors"
                >
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </h2>

            <p className="text-sm text-slate-500 mb-1">{pub.authors}</p>
            <p className="text-sm text-slate-400">
              <span className="italic">{pub.venue}</span>
              {pub.year && <span> · {pub.year}</span>}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
