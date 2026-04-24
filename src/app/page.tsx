import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import { updates } from "@/data/updates";

export default function Home() {
  return (
    <Container className="py-16 space-y-20">

      {/* Name */}
      <h1 className="text-5xl sm:text-6xl font-bold text-slate-800 tracking-tight">
        Arjun Gurjar
      </h1>

      {/* Photo + Bio */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
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

        <div className="md:col-span-2 flex flex-col gap-4">
          <p className="text-lg font-semibold text-slate-800 leading-snug">
            CS + MCB student at UC Berkeley working at the intersection of machine learning and biology.
          </p>

          <div className="space-y-3 text-slate-600 leading-relaxed text-sm">
            <p>
              I&apos;m currently on two research threads: using mechanistic interpretability
              techniques (sparse autoencoders) to probe DeepVariant, Google&apos;s genomic variant
              caller, and building functional genomic pipelines for pooled optical screens at the
              Innovative Genomics Institute. I find the question of what models &quot;learn&quot; about
              biology just as interesting as what they can predict.
            </p>
            <p>
              Before Berkeley, I spent time at Stanford in a brain imaging lab (calcium microscopy)
              and a cardiovascular genomics lab (atherosclerosis, CRISPR). I occasionally write science
              scripts for a YouTube channel, which keeps me honest about communicating ideas clearly.
            </p>
            <p>
              Outside of work: I read a lot, watch films that take ideas seriously, and think about
              questions that don&apos;t have clean answers.
            </p>
          </div>

          {/* Icon contacts */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href="mailto:arjungurjar@berkeley.edu"
              aria-label="Email"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-surface-border transition-colors"
            >
              <Mail size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/arjun-gurjar-472015217/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-surface-border transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/agurjar123"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-surface-border flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-surface-border transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>

          {/* Fact chips */}
          <div className="flex flex-wrap gap-3 pt-1">
            {/* University + Major combined */}
            <div className="rounded-2xl bg-pastel-blue/10 border border-pastel-blue/30 px-4 py-2">
              <p className="text-slate-800 font-semibold text-sm">UC Berkeley</p>
              <p className="text-xs text-slate-500 italic mt-0.5">CS + MCB · Minor in Bioengineering</p>
            </div>

            {/* Current role */}
            <div className="rounded-2xl bg-pastel-green/10 border border-pastel-green/30 px-4 py-2">
              <p className="text-slate-800 font-semibold text-sm">Innovative Genomics Institute</p>
              <p className="text-xs text-slate-500 italic mt-0.5">Research · Current</p>
            </div>

            {/* Upcoming internship */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2">
              <p className="text-slate-800 font-semibold text-sm">Noetik</p>
              <p className="text-xs text-slate-500 italic mt-0.5">ML Intern · Summer 2026</p>
            </div>

            {/* Courses link */}
            <Link
              href="/coursework"
              className="rounded-2xl bg-surface-muted border border-surface-border px-4 py-2 hover:bg-surface-border transition-colors"
            >
              <p className="text-slate-700 font-semibold text-sm">Courses</p>
              <p className="text-xs text-slate-500 italic mt-0.5">View all →</p>
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
