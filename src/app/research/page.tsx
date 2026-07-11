import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ResearchCard from "@/components/research/ResearchCard";
import { researchInterests } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Research interests and topics I explore",
};

export default function ResearchPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow={researchInterests.length === 0 ? "Coming soon" : undefined}
        title="Research"
        subtitle="Questions and areas that pull my attention."
      />

      {researchInterests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Check back soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {researchInterests.map((interest) => (
            <ResearchCard key={interest.title} {...interest} />
          ))}
        </div>
      )}
    </Container>
  );
}
