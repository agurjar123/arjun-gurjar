"use client";

import { useState } from "react";
import { GitBranch, ExternalLink } from "lucide-react";
import Tag from "@/components/ui/Tag";
import type { Project } from "@/data/projects";

const statusLabel: Record<Project["status"], string> = {
  ongoing: "Ongoing",
  complete: "Complete",
  archived: "Archived",
};

const statusColor: Record<Project["status"], string> = {
  ongoing: "bg-pastel-green/30 text-green-800",
  complete: "bg-pastel-blue/30 text-sky-800",
  archived: "bg-surface-muted text-slate-500",
};

export default function ProjectCard({ title, description, tags, github, demo, status, highlight }: Project) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="[perspective:1000px] cursor-pointer h-52"
      onClick={() => setFlipped((v) => !v)}
    >
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl bg-white border border-surface-border p-5 flex flex-col justify-between shadow-[var(--shadow-card)]">
          <div>
            {highlight && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 inline-block mb-2">
                ★ {highlight}
              </span>
            )}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-semibold text-slate-800 leading-snug">{title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${statusColor[status]}`}>
                {statusLabel[status]}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag} variant="gray">{tag}</Tag>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-slate-400">+{tags.length - 3}</span>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl bg-white border border-pastel-blue/40 p-5 flex flex-col justify-between shadow-[var(--shadow-card)] overflow-hidden">
          <p className="text-sm text-slate-600 leading-relaxed overflow-y-auto flex-1 pr-1">
            {description}
          </p>
          <div className="flex gap-3 pt-3 border-t border-surface-border mt-3 shrink-0">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <GitBranch size={13} />
                GitHub
              </a>
            )}
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ExternalLink size={13} />
                Demo
              </a>
            )}
            <span className="ml-auto text-xs text-slate-400 italic">click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
