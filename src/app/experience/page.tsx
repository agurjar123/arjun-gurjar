import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import TimelineItem from "@/components/experience/TimelineItem";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Past roles, internships, and research positions",
};

export default function ExperiencePage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Experience"
        subtitle="Roles I've held and things I've worked on."
      />

      <div className="flex flex-wrap gap-4 mb-8 font-mono text-xs uppercase tracking-wider text-faint">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          Research
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-muted" />
          Industry / Consulting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-faint" />
          Writing
        </span>
      </div>

      <div>
        {experiences.map((exp, i) => (
          <TimelineItem
            key={`${exp.org}-${exp.start}`}
            {...exp}
            isLast={i === experiences.length - 1}
          />
        ))}
      </div>
    </Container>
  );
}
