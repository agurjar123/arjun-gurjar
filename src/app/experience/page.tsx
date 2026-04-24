import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import TimelineItem from "@/components/experience/TimelineItem";
import { experiences } from "@/data/experience";

export const metadata: Metadata = {
  title: "Experience — Arjun Gurjar",
  description: "Past roles, internships, and research positions",
};

export default function ExperiencePage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Experience"
        subtitle="Roles I've held and things I've worked on."
      />

      <div className="flex flex-wrap gap-4 mb-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-blue border-2 border-pastel-blue" />
          Research
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pastel-green border-2 border-pastel-green" />
          Industry / Consulting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-100 border-2 border-amber-300" />
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
