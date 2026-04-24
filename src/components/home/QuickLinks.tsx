import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/research",
    title: "Research",
    description: "Topics I explore and questions I find compelling",
    accent: "bg-pastel-blue/20 hover:bg-pastel-blue/30 border-pastel-blue/40",
  },
  {
    href: "/experience",
    title: "Experience",
    description: "Past roles, internships, and research positions",
    accent: "bg-pastel-green/20 hover:bg-pastel-green/30 border-pastel-green/40",
  },
  {
    href: "/publications",
    title: "Publications",
    description: "Papers, preprints, and conference presentations",
    accent: "bg-pastel-blue/20 hover:bg-pastel-blue/30 border-pastel-blue/40",
  },
  {
    href: "/projects",
    title: "Projects",
    description: "Things I've built, from experiments to finished work",
    accent: "bg-pastel-blue/20 hover:bg-pastel-blue/30 border-pastel-blue/40",
  },
  {
    href: "/coursework",
    title: "Coursework",
    description: "Courses I've taken and am currently taking",
    accent: "bg-pastel-green/20 hover:bg-pastel-green/30 border-pastel-green/40",
  },
  {
    href: "/favorites",
    title: "Favorites",
    description: "Books and films that have stayed with me",
    accent: "bg-pastel-blue/20 hover:bg-pastel-blue/30 border-pastel-blue/40",
  },
  {
    href: "/photos",
    title: "Photos",
    description: "Things I've seen and wanted to hold onto",
    accent: "bg-pastel-green/20 hover:bg-pastel-green/30 border-pastel-green/40",
  },
  {
    href: "/now",
    title: "Now",
    description: "What I'm thinking about and working on right now",
    accent: "bg-pastel-green/20 hover:bg-pastel-green/30 border-pastel-green/40",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Writing on ideas, discoveries, and things I've learned",
    accent: "bg-surface-muted hover:bg-surface-border border-surface-border",
  },
];

export default function QuickLinks() {
  return (
    <section className="pb-20">
      <h2 className="text-lg font-semibold text-slate-500 uppercase tracking-widest mb-6">
        Explore
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sections.map(({ href, title, description, accent }) => (
          <Link
            key={href}
            href={href}
            className={`group rounded-2xl border p-5 transition-colors ${accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{title}</p>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
              </div>
              <ArrowRight
                size={16}
                className="shrink-0 mt-0.5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
