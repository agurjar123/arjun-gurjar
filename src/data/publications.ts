export type Publication = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  type: "conference" | "journal" | "preprint";
  url?: string;
  highlight?: string;
};

export const publications: Publication[] = [
  {
    title: "A Claims-Based Analysis of 447,222 MS Patients: Revealing Pre-Diagnostic Trajectories with Process Mining and Representation Learning",
    authors: "Gurjar A, et al.",
    venue: "Americas Committee for Treatment and Research in Multiple Sclerosis (ACTRIMS)",
    year: "Feb 2026",
    type: "conference",
  },
  {
    title: "Unveiling genes in dendritic cells that enhance T cell priming through functional multiplexed single cell–cell interaction analysis",
    authors: "Valente C., Apostolova M., Campos C., Weiner A., Gurjar A., Yasar F., Sabri S., Spitzer M.H.",
    venue: "Society for Immunotherapy of Cancer (SITC) 2025 & Lightning talk, ARC Symposium: Advancing Research Connections",
    year: "2025 / Feb 2026",
    type: "conference",
    highlight: "Selected lightning talk at ARC Symposium",
  },
  {
    title: "The Emerging Role of Oligodendrocytes in Alzheimer's Disease",
    authors: "Gurjar A.",
    venue: "Curieux Academic Journal",
    year: "2024",
    type: "journal",
  },
  {
    title: "The Effect of Clemastine Fumarate on C. Elegans in a Hyperglycemic Model of PAD Oxidative Stress",
    authors: "Gurjar A.",
    venue: "SSRN",
    year: "2024",
    type: "preprint",
  },
];
