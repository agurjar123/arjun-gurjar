export type Course = {
  code: string;
  name: string;
  tags?: string[];
};

export type SemesterGroup = {
  semester: string;
  status: "completed" | "current";
  honors?: string[];
  courses: Course[];
};

export const semesters: SemesterGroup[] = [
  {
    semester: "Fall 2026",
    status: "current",
    courses: [
      { code: "COMPSCI 294-302", name: "Graduate Computational Single Cell Immunology", tags: ["applied"] },
      { code: "COMPSCI 189", name: "Machine Learning", tags: ["theory"] },
      { code: "MCELLBI 102", name: "Principles of Biochemistry and Molecular Biology", tags: ["biology"] },
      { code: "MCELLBI 110", name: "Macromolecular Synthesis and Cellular Function", tags: ["biology"] },
    ],
  },
  {
    semester: "Spring 2026",
    status: "completed",
    courses: [
      { code: "BIOENG 134", name: "Biodesign Automation", tags: ["applied"] },
      { code: "BIOENG C142", name: "Machine Learning, Statistical Models, and Optimization for Molecular Problems", tags: ["applied"] },
      { code: "COMPSCI 70", name: "Discrete Mathematics and Probability Theory", tags: ["theory"] },
      { code: "EECS 127", name: "Optimization Models in Engineering", tags: ["theory"] },
      { code: "MCELLBI 199", name: "Supervised Independent Study and Research" },
    ],
  },
  {
    semester: "Fall 2025",
    status: "completed",
    honors: ["Dean's List", "Honors to Date"],
    courses: [
      { code: "BIOENG C149", name: "Computational Functional Genomics", tags: ["biology"] },
      { code: "CHEM 3AL", name: "Organic Chemistry Laboratory" },
      { code: "CHEM 3B", name: "Chemical Structure and Reactivity" },
      { code: "COMPSCI 61B", name: "Data Structures" },
      { code: "MCELLBI 149", name: "The Human Genome", tags: ["biology"] },
    ],
  },
  {
    semester: "Summer 2025",
    status: "completed",
    courses: [
      { code: "DATA C100", name: "Principles & Techniques of Data Science" },
      { code: "MCELLBI N184", name: "Intro to CRISPR: From Basic Biology to Genome Editing Technology", tags: ["biology"] },
      { code: "PSYCH 1", name: "General Psychology" },
    ],
  },
  {
    semester: "Spring 2025",
    status: "completed",
    honors: ["Honors to Date"],
    courses: [
      { code: "CHEM 3A", name: "Chemical Structure and Reactivity" },
      { code: "CMPBIO 98BC", name: "Berkeley Connect in Computational Biology" },
      { code: "COMPSCI 61A", name: "The Structure and Interpretation of Computer Programs" },
      { code: "MATH 53", name: "Multivariable Calculus" },
      { code: "MCELLBI 104", name: "Genetics, Genomics, and Cell Biology", tags: ["biology"] },
    ],
  },
  {
    semester: "Fall 2024",
    status: "completed",
    honors: ["Dean's List"],
    courses: [
      { code: "CHEM 1A", name: "General Chemistry" },
      { code: "CHEM 1AL", name: "General Chemistry Laboratory" },
      { code: "DATA C8", name: "Foundations of Data Science" },
      { code: "MATH 54", name: "Linear Algebra and Differential Equations" },
    ],
  },
];
