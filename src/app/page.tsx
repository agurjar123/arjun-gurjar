import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { updates } from "@/data/updates";
import { semesters } from "@/data/coursework";

export default function Home() {
  return (
    <Container className="py-16 space-y-20">

      {/* Hero */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-pastel-blue shrink-0">
            <Image
              src="/images/arjun-professional.jpeg"
              alt="Arjun Gurjar"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Hello, I&apos;m</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight leading-tight">
              Arjun Gurjar
            </h1>
          </div>
        </div>

        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
          CS + MCB student at UC Berkeley. I work at the intersection of machine learning and
          biology — currently using mechanistic interpretability to probe genomic deep learning
          models, and building functional genomic pipelines for pooled optical screens.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href="mailto:arjungurjar@berkeley.edu"
            className="px-4 py-2 rounded-2xl bg-pastel-blue text-sky-900 font-medium text-sm hover:bg-pastel-blue-light transition-colors"
          >
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/arjun-gurjar-472015217/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl bg-surface-muted text-slate-700 font-medium text-sm border border-surface-border hover:bg-surface-border transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/agurjar123"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl bg-surface-muted text-slate-700 font-medium text-sm border border-surface-border hover:bg-surface-border transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Bio */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-surface-border shadow-[var(--shadow-soft)]">
            <Image
              src="/images/arjun-professional.jpeg"
              alt="Arjun Gurjar"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 text-slate-600 leading-relaxed">
          <p>
            Hi! I&apos;m Arjun, a second-year student at UC Berkeley studying Computer Science and
            Molecular &amp; Cellular Biology, with a minor in Bioengineering. I&apos;m interested
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
            and a cardiovascular genomics lab (atherosclerosis, CRISPR). I occasionally write science
            scripts for a YouTube channel, which keeps me honest about communicating ideas clearly.
          </p>
          <p>
            Outside of work: I read a lot (fiction, philosophy, biology), watch films that take ideas
            seriously, and think about questions that don&apos;t have clean answers. I&apos;m always
            happy to talk.
          </p>

          {/* Fact chips */}
          <div className="pt-2 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-pastel-blue/10 border border-pastel-blue/30 px-4 py-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">University</p>
              <p className="text-slate-800 font-semibold text-sm">UC Berkeley, Class of 2028</p>
            </div>
            <div className="rounded-2xl bg-pastel-blue/10 border border-pastel-blue/30 px-4 py-2">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Major</p>
              <p className="text-slate-800 font-semibold text-sm">CS + MCB, Minor in Bioengineering</p>
            </div>
            <Link
              href="/coursework"
              className="rounded-2xl bg-surface-muted border border-surface-border px-4 py-2 hover:bg-surface-border transition-colors"
            >
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Coursework</p>
              <p className="text-slate-700 font-semibold text-sm">
                {semesters.find((s) => s.status === "current")?.semester ?? "View all"} →
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Updates */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Updates</h2>
        <div className="flex flex-col gap-3">
          {updates.map((update, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-xs text-slate-400 font-mono shrink-0 w-16 pt-0.5">{update.date}</span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {update.link ? (
                  <a
                    href={update.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-700 transition-colors underline underline-offset-2 decoration-slate-300"
                  >
                    {update.text}
                  </a>
                ) : (
                  update.text
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

    </Container>
  );
}
