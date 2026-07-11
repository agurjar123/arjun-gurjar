import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Work",
  description: "Research, publications, and projects",
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

export default function WorkPage() {
  return (
    <Container className="py-16 space-y-16">
      <SectionHeader
        title="Work"
        subtitle="Research, publications, and things I've built."
      />

      {/* Projects */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>

      {/* Publications */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">Publications</h2>
        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface border border-border p-6 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start gap-2 mb-2">
                <span className={`font-mono text-[11px] tracking-wide px-2.5 py-0.5 rounded-full shrink-0 mt-0.5 ${typeColor[pub.type]}`}>
                  {typeLabel[pub.type]}
                </span>
                {pub.highlight && (
                  <span className="font-mono text-[11px] tracking-wide px-2.5 py-0.5 rounded-full shrink-0 mt-0.5 bg-accent-soft text-accent">
                    ★ {pub.highlight}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground leading-snug mb-2">
                {pub.url ? (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h3>
              <p className="text-sm text-muted mb-1">{pub.authors}</p>
              <p className="text-sm text-faint">
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
