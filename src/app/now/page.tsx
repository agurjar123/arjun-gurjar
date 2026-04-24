import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Now — Arjun Gurjar",
  description: "What I'm thinking about and working on right now",
};

const items = [
  {
    category: "Reading",
    thoughts: [
      "Working through Gödel, Escher, Bach — taking it slow and enjoying the puzzles",
      "Catching up on recent papers on protein language models and structure prediction",
    ],
  },
  {
    category: "Working on",
    thoughts: [
      "Building intuition for deep learning architectures through hands-on experiments",
      "This website — trying to make it a genuine reflection of how I think",
    ],
  },
  {
    category: "Thinking about",
    thoughts: [
      "How to do good research: what makes a question worth asking?",
      "The relationship between interpretability and understanding in ML",
      "Whether the framing of 'AI safety' as distinct from 'AI capability' is the right one",
    ],
  },
  {
    category: "Learning",
    thoughts: [
      "Bayesian statistics — going back to fundamentals",
      "Rust, slowly and with much confusion",
    ],
  },
];

export default function NowPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Now"
        subtitle={`What I'm currently thinking about, reading, and building. Last updated April 2025.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ category, thoughts }) => (
          <Card key={category} className="bg-white">
            <h2 className="font-semibold text-slate-800 mb-3">{category}</h2>
            <ul className="space-y-2">
              {thoughts.map((thought, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pastel-blue shrink-0" />
                  {thought}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

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
