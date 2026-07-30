"use client";

import { useState } from "react";
import { X, Trash2, Plus } from "lucide-react";
import {
  saveTimelineEvent,
  deleteTimelineEvent,
  firebaseReady,
  type TimelineEvent,
} from "@/lib/firebase";

export default function TimelineEditor({
  events,
  onClose,
}: {
  events: TimelineEvent[];
  onClose: () => void;
}) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const [draft, setDraft] = useState({ date: "", title: "", note: "" });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.date || !draft.title.trim()) return;
    await saveTimelineEvent(draft);
    setDraft({ date: "", title: "", note: "" });
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] bs-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-semibold text-foreground">
            Our timeline
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-muted transition-colors hover:text-accent"
          >
            <X size={18} />
          </button>
        </div>

        {!firebaseReady && (
          <p className="mb-4 text-xs text-faint">
            Firebase isn&apos;t configured yet, so changes won&apos;t save.
          </p>
        )}

        <p className="mb-3 text-xs text-faint">
          The timeline sorts by date — change a date to move a moment.
        </p>

        <div className="space-y-3">
          {sorted.map((ev) => (
            <EventRow key={ev.id} event={ev} />
          ))}
          {sorted.length === 0 && (
            <p className="text-sm text-muted">No moments yet — add your first below.</p>
          )}
        </div>

        <form
          onSubmit={add}
          className="mt-5 space-y-2 rounded-2xl border border-dashed border-border p-4"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent">
            add a moment
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <input
              placeholder="what happened"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <input
            placeholder="note (optional)"
            value={draft.note}
            onChange={(e) => setDraft({ ...draft, note: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            <Plus size={14} /> Add
          </button>
        </form>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: TimelineEvent }) {
  const [e, setE] = useState<TimelineEvent>(event);
  const [saved, setSaved] = useState(false);

  async function save() {
    await saveTimelineEvent(e);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div className="rounded-2xl border border-border p-3">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={e.date}
          onChange={(ev) => setE({ ...e, date: ev.target.value })}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
        />
        <input
          value={e.title}
          onChange={(ev) => setE({ ...e, title: ev.target.value })}
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
        />
        <button
          onClick={() => event.id && deleteTimelineEvent(event.id)}
          aria-label="Delete"
          className="shrink-0 text-muted transition-colors hover:text-red-500"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <input
        value={e.note ?? ""}
        onChange={(ev) => setE({ ...e, note: ev.target.value })}
        placeholder="note"
        className="mt-2 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
      />
      <button
        onClick={save}
        className="mt-2 font-mono text-[11px] uppercase tracking-wider text-accent transition-colors hover:text-accent-strong"
      >
        {saved ? "saved ✓" : "save"}
      </button>
    </div>
  );
}
