"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

// Clears the session so the password gate reappears — lets you switch between
// Arjun (open) and Seher (pshaw). Only shows once logged in.
export default function LogoutButton() {
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    const read = () => {
      try {
        setMe(
          localStorage.getItem("backstage_unlocked") === "1"
            ? localStorage.getItem("backstage_me") || "in"
            : null
        );
      } catch {
        /* ignore */
      }
    };
    read();
    // Re-check when login happens (same tab) or storage changes (other tabs).
    window.addEventListener("backstage-auth", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("backstage-auth", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!me) return null;

  function logout() {
    try {
      localStorage.removeItem("backstage_unlocked");
      localStorage.removeItem("backstage_me");
      sessionStorage.removeItem("backstage_greeted");
    } catch {
      /* ignore */
    }
    window.location.href = "/backstage";
  }

  return (
    <button
      onClick={logout}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted backdrop-blur-sm transition-colors hover:text-accent"
    >
      <LogOut size={12} />
      log out{me !== "in" ? ` · ${me}` : ""}
    </button>
  );
}
