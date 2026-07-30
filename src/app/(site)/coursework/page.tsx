import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import { semesters } from "@/data/coursework";

export const metadata: Metadata = {
  title: "Coursework",
  description: "Courses I've taken at UC Berkeley",
};

export default function CourseworkPage() {
  const honors = Array.from(new Set(semesters.flatMap((s) => s.honors ?? [])));

  return (
    <Container className="py-16">
      <SectionHeader
        title="Coursework"
        subtitle="Courses I've taken at UC Berkeley, by semester."
      />

      {honors.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {honors.map((h) => (
            <span
              key={h}
              className="font-mono text-[11px] tracking-wide px-3 py-1 rounded-full bg-accent-soft text-accent"
            >
              ★ {h}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {semesters.map(({ semester, status, courses }) => (
          <div
            key={semester}
            className="rounded-2xl bg-surface border border-border shadow-[var(--shadow-card)] overflow-hidden"
          >
            {/* Semester header */}
            <div
              className={`px-6 py-4 flex items-center justify-between border-b border-border ${
                status === "current" ? "bg-accent-soft" : "bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-lg font-semibold text-foreground">{semester}</h2>
                {status === "current" && (
                  <span className="font-mono text-[11px] tracking-wide px-2.5 py-0.5 rounded-full bg-accent text-background font-medium">
                    Current
                  </span>
                )}
              </div>
            </div>

            {/* Course list */}
            <div className="divide-y divide-border">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-3"
                >
                  <span className="text-xs font-mono text-faint shrink-0 w-28">
                    {course.code}
                  </span>
                  <span className="text-sm text-foreground flex-1">{course.name}</span>
                  {course.tags && (
                    <div className="flex gap-1 flex-wrap">
                      {course.tags.map((tag) => (
                        <Tag key={tag} variant="accent">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
