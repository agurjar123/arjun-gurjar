import Image from "next/image";
import { Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import UpdatesTimeline from "@/components/home/UpdatesTimeline";

function BioLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent transition-colors hover:text-accent-strong"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <Container className="py-16 space-y-20">

      {/* Intro + Photo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        <div className="md:col-span-2 flex flex-col gap-5">
          <p className="font-serif text-2xl text-foreground leading-snug">
            👋 I&apos;m Arjun, a 3rd year at UC Berkeley studying MCB and Data Science.
          </p>

          <div className="space-y-3 text-foreground leading-relaxed">
            <p>
              I&apos;m interested in working on problems in BioML, functional genomics, and mech interp
              to enable digital biology and precision medicine. Currently I&apos;m working at{" "}
              <BioLink href="https://noetik.ai">Noetik</BioLink>{" "}
              on cancer foundation models. I&apos;m also part of the{" "}
              <BioLink href="https://innovativegenomics.org/ctg/advanced-translational-genetics-laboratory/">
                Advanced Translational Genetics Lab
              </BioLink>{" "}
              at the{" "}
              <BioLink href="https://innovativegenomics.org">Innovative Genomics Institute</BioLink>{" "}
              where I work on combinatorial pooled optical screens, deep mutational scanning, and stem
              cell models for disease.
            </p>
            <p>
              I helped set up{" "}
              <BioLink href="https://www.instagram.com/ucb_compbio/">Computational Biology @ Berkeley</BioLink>,{" "}
              started the CompBio Bootcamp, and worked with{" "}
              <BioLink href="https://research.google">Google Research</BioLink>{" "}
              on interpreting variant calling models. I am also a part of{" "}
              <BioLink href="https://www.phoenixconsultinggroup.org/">Phoenix Consulting Group</BioLink>{" "}
              where I led a project with the{" "}
              <BioLink href="https://www.nationalmssociety.org">National MS Society</BioLink>{" "}
              on representation learning for multiple sclerosis patient journey mapping. Previously I was a
              part of the{" "}
              <BioLink href="https://www.spitzerlab.org/">UCSF–Gladstone Spitzer Lab</BioLink>{" "}
              working on engineering dendritic cells to overcome immunosuppressive tumor microenvironments.
            </p>
            <p>
              I also produce science YouTube videos and write scripts as{" "}
              <BioLink href="https://www.youtube.com/@tldrscience">TLDR Science</BioLink>.
            </p>
          </div>

          {/* Icon contacts */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href="mailto:arjungurjar@berkeley.edu"
              aria-label="Email"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              <Mail size={16} />
            </a>
            <a
              href="https://x.com/arjunmgurjar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/arjun-gurjar-472015217/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
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
              className="w-9 h-9 rounded-xl bg-surface-muted border border-border flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Photo */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]">
            <Image
              src="/images/arjun-coffee.jpg"
              alt="Arjun Gurjar"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Updates timeline */}
      <UpdatesTimeline />

    </Container>
  );
}
