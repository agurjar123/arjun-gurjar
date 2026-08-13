"use client";

import { useEffect, useState } from "react";
import DayCard from "./DayCard";
import { days } from "@/data/backstage/days";
import { markDaySolved, subscribeSolved } from "@/lib/firebase";

const KEY = "backstage_solved";

export default function AdventGrid() {
  const [solved, setSolved] = useState<Set<string>>(new Set());

  // Seed from this device's localStorage, then keep in sync with Firebase so a
  // day she's already opened stays unlocked on any device / after a cache clear.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSolved(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
    return subscribeSolved((ids) => {
      setSolved((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        try {
          localStorage.setItem(KEY, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      });
    });
  }, []);

  function markSolved(id: string) {
    setSolved((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(KEY, JSON.stringify([...next]));
      } catch {
        /* ignore */
      }
      return next;
    });
    void markDaySolved(id); // persist across devices
  }

  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {ordered.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          solved={solved.has(day.id)}
          onSolve={markSolved}
        />
      ))}
    </div>
  );
}
