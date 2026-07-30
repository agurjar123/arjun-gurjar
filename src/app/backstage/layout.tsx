import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BackstageBackground from "@/components/backstage/BackstageBackground";

export const metadata: Metadata = {
  title: "Backstage",
  robots: { index: false, follow: false },
};

// Almond-themed shell for the private section. The `data-theme="almond"` wrapper
// overrides the site tokens for this subtree only (see globals.css), and there's
// no site Navbar/Footer here since backstage lives outside the (site) group.
export default function BackstageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      data-theme="almond"
      className="relative min-h-screen text-foreground"
    >
      <BackstageBackground />
      <Link
        href="/"
        className="fixed left-3 top-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur-sm transition-colors hover:text-accent sm:left-5 sm:top-5"
      >
        <ArrowLeft size={13} />
        arjun gurjar
      </Link>
      {children}
    </div>
  );
}
