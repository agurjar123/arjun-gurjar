import { GitBranch, ExternalLink } from "lucide-react";
import Card from "@/components/ui/Card";
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
  return (
    <Card hover className="flex flex-col gap-3">
      {highlight && (
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 self-start">
          ★ {highlight}
        </span>
      )}

      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${statusColor[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed flex-1">{description}</p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Tag key={tag} variant="gray">
            {tag}
          </Tag>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <GitBranch size={14} />
            GitHub
          </a>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ExternalLink size={14} />
            Demo
          </a>
        )}
      </div>
    </Card>
  );
}
