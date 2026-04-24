export type Update = {
  date: string;
  text: string;
  link?: string;
};

export const updates: Update[] = [
  {
    date: "Jan 2025",
    text: "Started undergraduate research at the Innovative Genomics Institute (IGI), UC Berkeley.",
  },
  {
    date: "Mar 2025",
    text: "Won Y Combinator Bio/AI Hackathon with tri-modal LUAD clinical decision support system.",
    link: "https://github.com/agurjar123/yc-aixbio-hackathon",
  },
  {
    date: "Nov 2025",
    text: "Dendritic cell priming work accepted to SITC 2025.",
  },
  {
    date: "Jan 2026",
    text: "Started teaching the Computational Biology bootcamp at UC Berkeley.",
  },
  {
    date: "Feb 2026",
    text: "Presented MS patient trajectory analysis at ACTRIMS Forum 2026 in San Diego.",
  },
  {
    date: "Feb 2026",
    text: "Dendritic cell priming work accepted for presentation at the ARC Symposium.",
  },
];
