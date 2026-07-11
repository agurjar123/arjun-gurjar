import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import type { ResearchInterest } from "@/data/research";

export default function ResearchCard({ title, description, tags }: ResearchInterest) {
  return (
    <Card hover>
      <h2 className="font-serif text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag} variant="accent">
            {tag}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
