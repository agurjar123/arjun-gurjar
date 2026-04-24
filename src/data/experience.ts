export type Experience = {
  role: string;
  org: string;
  department?: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  type: "research" | "industry" | "leadership" | "writing";
};

export const experiences: Experience[] = [
  {
    role: "Project Manager",
    org: "Google Research",
    department: "Computational Biology at Berkeley",
    location: "Berkeley, CA",
    start: "Jan 2026",
    end: "Present",
    type: "research",
    bullets: [
      "Leading a team of 7 in collaboration with the Google Research team behind DeepVariant, a deep learning CNN for genomic variant calling, to probe the model's internal representations using mechanistic interpretability techniques",
      "Leveraging sparse autoencoders to systematically profile and cluster model embeddings to decode how well representations capture GIAB genomic stratifications, ENCODE functional annotations, sequencing platform, human ancestry (1000 Genomes), and cross-species generalization",
    ],
  },
  {
    role: "Project Principal",
    org: "Roche",
    department: "Phoenix Consulting Group",
    location: "Berkeley, CA",
    start: "Jan 2026",
    end: "Present",
    type: "industry",
    bullets: [
      "Supervising a team of 7 investigating how AI can reduce operational friction, improve decision confidence, and scale learning and leadership within Roche's HR and People & Organizational Growth (P&OG) function",
      "Contributed to midterm deliverable diagnosing AI value creation through trend analysis and industry case studies; built final deliverable prescribing a responsible deployment roadmap with regulatory mapping (GDPR, EU AI Act, US law)",
    ],
  },
  {
    role: "Undergraduate Researcher",
    org: "Advanced Translational Genetics Lab",
    department: "Innovative Genomics Institute",
    location: "Berkeley, CA",
    start: "Jan 2025",
    end: "Present",
    type: "research",
    bullets: [
      "Building unified analysis pipelines for pooled optical screens, including multi-channel fluorescence alignment, automated cell segmentation, and spatial transcriptomics integration across large-scale datasets",
      "Led a project building stem cell models for functional genomic annotation of GBA1 mutations relevant to Gaucher's Disease and Parkinson's",
      "Contributing to projects on building stem cell models of cancer and improving CRISPR editing efficiency via HDR enhancers",
    ],
  },
  {
    role: "Project Manager",
    org: "National MS Society",
    department: "Phoenix Consulting Group",
    location: "Berkeley, CA",
    start: "Sep 2025",
    end: "Jan 2026",
    type: "industry",
    bullets: [
      "Selected as youngest project manager for Berkeley's premier healthcare consulting organization (<1% acceptance rate)",
      "Built end-to-end representation learning pipeline using Doc2Vec to encode longitudinal ICD-10 claim sequences into 128-dimensional patient trajectory embeddings across 447,222 MS patients",
      "Applied stratified GMMs to identify prodromal phenotype clusters, validated against Time-to-Diagnosis outcomes; led team of 8",
    ],
  },
  {
    role: "Undergraduate Researcher",
    org: "Spitzer Lab",
    department: "UCSF Dept. of Head & Neck Surgery",
    location: "San Francisco, CA",
    start: "Jun 2025",
    end: "Aug 2025",
    type: "research",
    bullets: [
      "Built bioinformatics pipelines to process Cellanome platform data, integrate datasets, fine-tune cell cluster labeling, and identify top DE hits",
      "Led a project using flow cytometry to profile OT-I/II T cell responses to dendritic cell (DC) priming; used pooled CRISPR screens and cell-cell interaction analysis to determine therapeutic targets that rescue DC priming in immunosuppressive tumor environments",
      "Won 1st place in UCSF ImmunoX Hackathon for CITE-seq integration analysis",
    ],
  },
  {
    role: "Life Sciences Business Development Intern",
    org: "ASO Therapeutics",
    department: "Berkeley Skydeck",
    location: "Berkeley, CA",
    start: "Sep 2024",
    end: "Jun 2025",
    type: "industry",
    bullets: [
      "Analyzed TCGA data to determine cancer type-specific responsiveness to lead drug candidate; produced 10-page report identifying top therapeutic targets based on overexpression patterns",
      "Analyzed clinical trials landscape data and built indication positioning strategy; synthesized ASCO and NCCN treatment guidelines to distill treatment sequencing protocols based on tumor characteristics",
    ],
  },
  {
    role: "Cardiovascular Functional Genomics Research Intern",
    org: "Quertermous Lab",
    department: "Stanford University",
    location: "Stanford, CA",
    start: "Jun 2024",
    end: "Sep 2024",
    type: "research",
    bullets: [
      "Investigated the 9p21 locus in the formation of atherosclerosis in coronary artery disease",
      "Investigated CRISPR-A/I cell lines to identify transcription factor motifs and mutations; conducted time course scRNA-seq/clustering analysis",
    ],
  },
  {
    role: "Brain Imaging Research Intern",
    org: "Stanford Schnitzer Lab",
    department: "Stanford University",
    location: "Stanford, CA",
    start: "Nov 2022",
    end: "Jun 2023",
    type: "research",
    bullets: [
      "Developed pipeline for visualizing data from calcium microscopy videos, generated raster plots, and built software to detect activation traces and dendritic spline outlines",
      "Built computing setups on strict budgets to enable research workflows",
    ],
  },
  {
    role: "Science Writer and Content Creator",
    org: "TLDR Science",
    department: "Patrick Kelly Teaches (115k+ subscribers)",
    location: "Remote",
    start: "Aug 2020",
    end: "Present",
    type: "writing",
    bullets: [
      "Paid contractor researching science history topics and writing scripts for YouTube/Patreon/Nebula content",
      "Selected as Breakthrough Junior Challenge Finalist (Top 15 from 100+ countries and thousands of competitors)",
      "Featured on Fox KTVU and Mercury News",
    ],
  },
];
