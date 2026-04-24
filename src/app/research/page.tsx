import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import ResearchCard from "@/components/research/ResearchCard";
import { researchInterests } from "@/data/research";

export const metadata: Metadata = {
  title: "Research — Arjun Gurjar",
  description: "Research interests and topics I explore",
};

export default function ResearchPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Research"
        subtitle="Questions and areas that pull my attention."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {researchInterests.map((interest) => (
          <ResearchCard key={interest.title} {...interest} />
        ))}
      </div>
    </Container>
  );
}
