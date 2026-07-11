"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import ThemeToggle from "@/components/ui/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/coursework", label: "Courses" },
  { href: "/work", label: "Work" },
  { href: "/multimodal-shelf", label: "Shelf" },
  { href: "/photos", label: "Photos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            Arjun Gurjar
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.slice(1).map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-colors",
                  pathname === href
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-muted"
                )}
              >
                {label}
              </Link>
            ))}
            <span className="mx-1 h-5 w-px bg-border" aria-hidden />
            <ThemeToggle />
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-full text-muted hover:text-foreground hover:bg-surface-muted transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors",
                  pathname === href
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:text-foreground hover:bg-surface-muted"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
