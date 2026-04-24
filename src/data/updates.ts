export type Update = {
  date: string;
  text: string;
  link?: string;
};

export const updates: Update[] = [
  {
    date: "Feb 2026",
    text: "Presented at ACTRIMS Forum 2026 — MS patient trajectory analysis across 447k patients.",
  },
  {
    date: "Feb 2026",
    text: "Selected for lightning talk at ARC Symposium for T cell priming CRISPR screen work.",
  },
  {
    date: "Oct 2024",
    text: "Won Y Combinator Bio/AI Hackathon with tri-modal LUAD clinical decision support system.",
    link: "https://github.com/agurjar123/yc-aixbio-hackathon",
  },
  {
    date: "Aug 2024",
    text: "Started undergraduate research at the Innovative Genomics Institute (IGI), UC Berkeley.",
  },
  {
    date: "Aug 2024",
    text: "Began CS + MCB at UC Berkeley.",
  },
];
