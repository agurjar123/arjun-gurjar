import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm thinking about and working on right now",
};

export default function NowPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        eyebrow="Coming soon"
        title="Now"
        subtitle="What I'm currently thinking about, reading, and building."
      />

      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Check back soon</p>
      </div>

      <p className="mt-8 font-mono text-xs text-faint">
        Inspired by{" "}
        <a
          href="https://nownownow.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          nownownow.com
        </a>
      </p>
    </Container>
  );
}
