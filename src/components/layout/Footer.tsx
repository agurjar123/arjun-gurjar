import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Arjun Gurjar</p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/agurjar123"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            GitHub
          </Link>
          <Link
            href="mailto:arjungurjar@berkeley.edu"
            className="hover:text-slate-800 transition-colors"
          >
            Email
          </Link>
          <Link
            href="https://www.linkedin.com/in/arjun-gurjar-472015217/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-800 transition-colors"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
