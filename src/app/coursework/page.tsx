import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import { semesters } from "@/data/coursework";

export const metadata: Metadata = {
  title: "Coursework — Arjun Gurjar",
  description: "Courses I've taken at UC Berkeley",
};

export default function CourseworkPage() {
  return (
    <Container className="py-16">
      <SectionHeader
        title="Coursework"
        subtitle="Courses I've taken at UC Berkeley, by semester."
      />

      <div className="flex flex-col gap-6">
        {semesters.map(({ semester, status, honors, courses }) => (
          <div
            key={semester}
            className="rounded-2xl bg-white border border-surface-border shadow-[var(--shadow-card)] overflow-hidden"
          >
            {/* Semester header */}
            <div
              className={`px-6 py-4 flex items-center justify-between border-b border-surface-border ${
                status === "current" ? "bg-pastel-blue/10" : "bg-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-slate-800">{semester}</h2>
                {status === "current" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pastel-blue/40 text-sky-800 font-medium">
                    Current
                  </span>
                )}
              </div>
              {honors && honors.length > 0 && (
                <div className="flex gap-2 flex-wrap justify-end">
                  {honors.map((h) => (
                    <span
                      key={h}
                      className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium"
                    >
                      ★ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Course list */}
            <div className="divide-y divide-surface-border">
              {courses.map((course) => (
                <div
                  key={course.code}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-3"
                >
                  <span className="text-xs font-mono text-slate-400 shrink-0 w-28">
                    {course.code}
                  </span>
                  <span className="text-sm text-slate-700 flex-1">{course.name}</span>
                  {course.tags && (
                    <div className="flex gap-1 flex-wrap">
                      {course.tags.map((tag) => (
                        <Tag key={tag} variant="blue">
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
