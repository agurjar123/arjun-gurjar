"use client";

import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Item = { id?: string; name: string; qty: number };

export default function ShoppingReveal({
  dayId,
  intro,
}: {
  dayId: string;
  intro?: string;
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Items are stored as JSON in chat messages (reuses the chat Firebase rule).
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Item[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o && o.kind === "item") {
              parsed.push({ id: m.id, name: o.name, qty: o.qty ?? 1 });
            }
          } catch {
            /* ignore non-item messages */
          }
        }
        setItems(parsed);
      }),
    [dayId]
  );

  const total = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);

  async function addItem() {
    const n = name.trim();
    if (!n) return;
    setName("");
    setQty(1);
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind: "item", name: n, qty }),
    });
  }

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Cart header */}
        <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-4 py-3">
          <ShoppingCart size={16} className="text-accent" />
          <span className="font-serif text-lg font-semibold text-foreground">
            your cart
          </span>
          <span className="ml-auto rounded-full bg-accent px-2.5 py-0.5 font-mono text-[11px] text-white">
            {total} {total === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-faint">
            cart&apos;s empty — add what you need below 🛒
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((it) => (
              <li
                key={it.id ?? it.name}
                className="group flex items-center gap-3 px-4 py-2.5"
              >
                <span className="flex h-6 min-w-6 items-center justify-center rounded-md border border-border px-1.5 font-mono text-xs text-muted">
                  {it.qty}
                </span>
                <span className="text-foreground">{it.name}</span>
                <button
                  onClick={() => it.id && deleteChatMessage(dayId, it.id)}
                  aria-label="Remove item"
                  className="ml-auto text-faint opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <X size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add row */}
        <div className="flex items-center gap-2 border-t border-border px-3 py-3">
          <div className="flex items-center rounded-full border border-border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Fewer"
              className="px-2 py-1.5 text-muted transition-colors hover:text-accent"
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center font-mono text-sm text-foreground">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="More"
              className="px-2 py-1.5 text-muted transition-colors hover:text-accent"
            >
              <Plus size={13} />
            </button>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem();
            }}
            placeholder="add an item…"
            className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-foreground outline-none transition-colors focus:border-accent"
          />
          <button
            onClick={addItem}
            className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
          >
            add
          </button>
        </div>
      </div>
    </div>
  );
}
