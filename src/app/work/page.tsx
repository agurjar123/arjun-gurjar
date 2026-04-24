import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Work — Arjun Gurjar",
  description: "Research, publications, and projects",
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

export default function WorkPage() {
  return (
    <Container className="py-16 space-y-16">
      <SectionHeader
        title="Work"
        subtitle="Research, publications, and things I've built."
      />

      {/* Projects */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      {/* Publications */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Publications</h2>
        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-surface-border p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${typeColor[pub.type]}`}>
                  {typeLabel[pub.type]}
                </span>
                {pub.highlight && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 bg-amber-50 text-amber-700 border border-amber-200">
                    ★ {pub.highlight}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-slate-800 leading-snug mb-2">
                {pub.url ? (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-700 transition-colors">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h3>
              <p className="text-sm text-slate-500 mb-1">{pub.authors}</p>
              <p className="text-sm text-slate-400">
                <span className="italic">{pub.venue}</span>
                {pub.year && <span> · {pub.year}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
