import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/research",
    title: "Research",
    description: "Topics I explore and questions I find compelling",
  },
  {
    href: "/experience",
    title: "Experience",
    description: "Past roles, internships, and research positions",
  },
  {
    href: "/publications",
    title: "Publications",
    description: "Papers, preprints, and conference presentations",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Things I've built, from experiments to finished work",
  },
  {
    href: "/coursework",
    title: "Coursework",
    description: "Courses I've taken and am currently taking",
  },
  {
    href: "/favorites",
    title: "Favorites",
    description: "Books and films that have stayed with me",
  },
  {
    href: "/photos",
    title: "Photos",
    description: "Things I've seen and wanted to hold onto",
  },
  {
    href: "/now",
    title: "Now",
    description: "What I'm thinking about and working on right now",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Writing on ideas, discoveries, and things I've learned",
  },
];

export default function QuickLinks() {
  return (
    <section className="pb-20">
      <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent">Explore</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif text-lg font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted mt-1">{description}</p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 mt-0.5 text-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
