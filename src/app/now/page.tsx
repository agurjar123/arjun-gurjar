import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Now — Arjun Gurjar",
  description: "What I'm thinking about and working on right now",
};

export default function NowPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Now"
        subtitle="What I'm currently thinking about, reading, and building."
      />

      <p className="text-slate-400 text-sm">Check back soon.</p>

      <p className="mt-8 text-xs text-slate-400">
        Inspired by{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600"
        >
          nownownow.com
        </a>
      </p>
    </Container>
  );
}
