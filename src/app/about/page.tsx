import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import { semesters } from "@/data/coursework";

export const metadata: Metadata = {
  title: "About — Arjun Gurjar",
  description: "Personal background and story",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="About"
        subtitle="A bit about who I am and where I come from."
      />

      {/* Hero row: professional photo + bio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-surface-border shadow-[var(--shadow-soft)]">
            <Image
              src="/images/arjun-professional.jpeg"
              alt="Arjun Gurjar"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-5 text-slate-600 leading-relaxed">
          <p>
            Hi! I&apos;m Arjun, a second-year student at UC Berkeley studying Computer Science and
            Molecular & Cellular Biology, with a minor in Bioengineering. I&apos;m interested
            in the intersection of machine learning and biology — specifically in using computational
            tools to understand biological systems at the mechanistic level.
          </p>
          <p>
            Right now I&apos;m working on two research threads: using mechanistic interpretability
            techniques (sparse autoencoders) to probe DeepVariant, Google&apos;s genomic variant
            caller, and building functional genomic pipelines for pooled optical screens at the
            Innovative Genomics Institute. I find the question of what models &quot;learn&quot; about
            biology just as interesting as what they can predict.
          </p>
          <p>
            Before Berkeley, I spent time at Stanford — both in a brain imaging lab (calcium microscopy)
            and a cardiovascular genomics lab (atherosclerosis, CRISPR). I occasionally write science scripts
            for a YouTube channel, which keeps me honest about communicating
            ideas clearly.
          </p>
          <p>
            Outside of work: I read a lot (fiction, philosophy, biology), watch films that take ideas
            seriously, and think about questions that don&apos;t have clean answers. I&apos;m always
            happy to talk.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <a
              href="mailto:arjungurjar@berkeley.edu"
              className="px-4 py-2 rounded-2xl bg-pastel-blue text-sky-900 text-sm font-medium hover:bg-pastel-blue-light transition-colors"
            >
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/arjun-gurjar-472015217/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-surface-muted text-slate-700 text-sm font-medium border border-surface-border hover:bg-surface-border transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/agurjar123"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-surface-muted text-slate-700 text-sm font-medium border border-surface-border hover:bg-surface-border transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Quick facts */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "University", value: "UC Berkeley, Class of 2028" },
          { label: "Major", value: "CS + MCB, Minor in Bioengineering" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl bg-pastel-blue/10 border border-pastel-blue/30 px-5 py-4"
          >
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-slate-800 font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Coursework */}
      <div className="mt-16">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Coursework</h2>
        <div className="flex flex-col gap-6">
          {semesters.map((sem) => (
            <div key={sem.semester}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-700">{sem.semester}</span>
                {sem.status === "current" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pastel-green/30 text-green-800 font-medium">Current</span>
                )}
              </div>
              <ul className="text-sm text-slate-500 space-y-1 pl-1">
                {sem.courses.map((course) => (
                  <li key={course.code} className="flex gap-2">
                    <span className="text-slate-400 font-mono text-xs pt-0.5 shrink-0">{course.code}</span>
                    <span>{course.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
