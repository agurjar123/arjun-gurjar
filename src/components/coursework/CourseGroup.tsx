import Tag from "@/components/ui/Tag";

export type Course = {
  code: string;
  name: string;
  tags?: string[];
};

export default function CourseGroup({
  category,
  courses,
  accent,
}: {
  category: string;
  courses: Course[];
  accent?: "blue" | "green";
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            accent === "green" ? "bg-pastel-green" : "bg-pastel-blue"
          }`}
        />
        <h2 className="font-semibold text-slate-700">{category}</h2>
      </div>
      <div className="space-y-2">
        {courses.map((course) => (
          <div
            key={course.code}
            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 border-b border-surface-border last:border-0"
          >
            <span className="text-xs font-mono text-slate-400 shrink-0 w-20">{course.code}</span>
            <span className="text-sm text-slate-700 flex-1">{course.name}</span>
            {course.tags && (
              <div className="flex gap-1 flex-wrap">
                {course.tags.map((tag) => (
                  <Tag key={tag} variant={accent === "green" ? "green" : "blue"}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
