import { updates } from "@/data/updates";

export default function UpdatesTimeline() {
  const items = [...updates].reverse(); // newest first

  return (
    <section aria-labelledby="updates-heading">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">Recent</p>
      <h2
        id="updates-heading"
        className="mb-8 font-serif text-2xl font-semibold tracking-tight text-foreground"
      >
        Updates
      </h2>

      <ol className="relative ml-1 border-l border-border">
        {items.map((update, i) => (
          <li key={i} className="relative pl-6 pb-8 last:pb-0">
            <span
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background"
              aria-hidden
            />
            <time className="block font-mono text-xs uppercase tracking-wider text-faint">
              {update.date}
            </time>
            <p className="mt-1.5 leading-relaxed text-foreground/90">
              {update.link ? (
                <a
                  href={update.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {update.text}
                </a>
              ) : (
                update.text
              )}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
