"use client";

import { useEffect, useRef, useState } from "react";
import { Undo2, Trash2, X } from "lucide-react";
import { subscribeChat, sendChatMessage, deleteChatMessage } from "@/lib/firebase";

type Drawing = { id?: string; from: "arjun" | "seher"; prompt: string; image: string };

const COLORS = ["#2b2b2b", "#c0392b", "#2e6da4", "#27893f", "#8c5a3b", "#d6607f", "#e8a03d"];
const SIZES = [3, 6, 12];

export default function DrawReveal({
  dayId,
  intro,
  prompts,
}: {
  dayId: string;
  intro?: string;
  prompts: string[];
}) {
  const [me, setMe] = useState<"arjun" | "seher">("seher");
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [prompt, setPrompt] = useState(prompts[0] ?? "");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const undoRef = useRef<ImageData[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("backstage_me");
      if (s === "arjun" || s === "seher") setMe(s);
    } catch {
      /* ignore */
    }
  }, []);

  // Saved drawings live in this day's chat as JSON.
  useEffect(
    () =>
      subscribeChat(dayId, (msgs) => {
        const parsed: Drawing[] = [];
        for (const m of msgs) {
          if (!m.text || m.text[0] !== "{") continue;
          try {
            const o = JSON.parse(m.text);
            if (o?.kind === "drawing") {
              parsed.push({ id: m.id, from: m.from, prompt: o.prompt, image: o.image });
            }
          } catch {
            /* ignore */
          }
        }
        setDrawings(parsed);
      }),
    [dayId]
  );

  // Size the canvas to its container (accounting for device pixel ratio), on a
  // white background so it exports cleanly as a JPEG.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = parent.clientWidth;
    const cssH = Math.round(cssW * 0.7);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function pointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function pushUndo() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    undoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoRef.current.length > 20) undoRef.current.shift();
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pushUndo();
    drawingRef.current = true;
    lastRef.current = pointFromEvent(e);
    // a dot for taps
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && lastRef.current) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lastRef.current.x, lastRef.current.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    setDirty(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const p = pointFromEvent(e);
    const last = lastRef.current;
    if (!ctx || !last) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
  }

  function onPointerUp() {
    drawingRef.current = false;
    lastRef.current = null;
  }

  function undo() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const prev = undoRef.current.pop();
    if (!canvas || !ctx || !prev) return;
    ctx.putImageData(prev, 0, 0);
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    pushUndo();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setDirty(false);
  }

  async function save() {
    const canvas = canvasRef.current;
    if (!canvas || !dirty) return;
    setSaving(true);
    const image = canvas.toDataURL("image/jpeg", 0.6);
    await sendChatMessage(dayId, {
      from: me,
      text: JSON.stringify({ kind: "drawing", prompt, image }),
    });
    clear();
    setSaving(false);
  }

  return (
    <div>
      {intro && <p className="mb-4 leading-relaxed text-foreground/90">{intro}</p>}

      {/* Prompt chips */}
      <div className="mb-3 flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => setPrompt(p)}
            className={
              "rounded-full border px-3 py-1.5 text-sm transition-colors " +
              (prompt === p
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-muted hover:border-accent/50")
            }
          >
            {p}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          className="block w-full touch-none cursor-crosshair"
        />
      </div>

      {/* Toolbar */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              style={{ background: c }}
              className={
                "h-6 w-6 rounded-full border-2 transition-transform " +
                (color === c ? "scale-110 border-foreground" : "border-white/70")
              }
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-label={`Brush ${s}`}
              className={
                "flex h-7 w-7 items-center justify-center rounded-full border transition-colors " +
                (size === s ? "border-accent bg-accent-soft" : "border-border")
              }
            >
              <span
                className="rounded-full bg-foreground"
                style={{ width: s, height: s }}
              />
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={undo}
            aria-label="Undo"
            className="rounded-full border border-border p-1.5 text-muted transition-colors hover:text-accent"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={clear}
            aria-label="Clear"
            className="rounded-full border border-border p-1.5 text-muted transition-colors hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            {saving ? "saving…" : "save drawing"}
          </button>
        </div>
      </div>

      {/* Gallery */}
      {drawings.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-accent">
            the gallery
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {drawings.map((d) => (
              <figure
                key={d.id ?? d.image.slice(-16)}
                className="group relative overflow-hidden rounded-xl border border-border bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={d.prompt} className="block w-full" />
                <figcaption className="flex items-center gap-1 px-2 py-1 text-[11px] text-muted">
                  <span className="truncate">{d.prompt}</span>
                  <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-wider text-faint">
                    {d.from}
                  </span>
                </figcaption>
                <button
                  onClick={() => d.id && deleteChatMessage(dayId, d.id)}
                  aria-label="Delete drawing"
                  className="absolute right-1.5 top-1.5 rounded-full bg-surface/90 p-1 text-faint opacity-0 shadow transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
