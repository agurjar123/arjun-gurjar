import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="py-20 sm:py-28">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pastel-blue shrink-0">
            <Image
              src="/images/arjun-professional.jpeg"
              alt="Arjun Gurjar"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
              Hello, I&apos;m
            </p>
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

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/about"
            className="px-5 py-2.5 rounded-2xl bg-pastel-blue text-sky-900 font-medium text-sm hover:bg-pastel-blue-light transition-colors"
          >
            About me
          </Link>
          <Link
            href="/research"
            className="px-5 py-2.5 rounded-2xl bg-pastel-green text-green-900 font-medium text-sm hover:bg-pastel-green-light transition-colors"
          >
            Research
          </Link>
          <Link
            href="/publications"
            className="px-5 py-2.5 rounded-2xl bg-surface-muted text-slate-700 font-medium text-sm border border-surface-border hover:bg-surface-border transition-colors"
          >
            Publications
          </Link>
        </div>
      </div>
    </section>
  );
}
