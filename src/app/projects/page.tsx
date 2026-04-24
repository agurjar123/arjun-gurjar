import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects — Arjun Gurjar",
  description: "Things I've built",
};

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Projects"
        subtitle="Things I've built, from experiments to finished work."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </Container>
  );
}
