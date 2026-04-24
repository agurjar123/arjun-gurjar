export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  status: "complete" | "ongoing" | "archived";
};

export const projects: Project[] = [
  {
    title: "DeepVariant Interpretability",
    description:
      "Mechanistic interpretability analysis of DeepVariant, Google's deep learning CNN for genomic variant calling. Using sparse autoencoders to profile and cluster model embeddings and decode how representations capture GIAB genomic stratifications, ENCODE functional annotations, human ancestry (1000 Genomes), and cross-species generalization.",
    tags: ["PyTorch", "sparse autoencoders", "interpretability", "genomics"],
    status: "ongoing",
  },
  {
    title: "Pooled Optical Screen Pipelines",
    description:
      "Unified analysis pipelines for pooled optical screens at the Innovative Genomics Institute. Includes multi-channel fluorescence alignment, automated cell segmentation, and spatial transcriptomics integration across large-scale datasets. Used to study GBA1 mutations relevant to Gaucher's Disease and Parkinson's.",
    tags: ["Python", "spatial transcriptomics", "image analysis", "CRISPR"],
    status: "ongoing",
  },
  {
    title: "MS Patient Trajectory Embeddings",
    description:
      "End-to-end representation learning pipeline using Doc2Vec to encode longitudinal ICD-10 claim sequences into 128-dimensional patient trajectory embeddings across 447,222 MS patients. Applied stratified GMMs to identify prodromal phenotype clusters, validated against Time-to-Diagnosis outcomes.",
    tags: ["NLP", "Doc2Vec", "GMMs", "EHR data", "Python"],
    status: "complete",
  },
  {
    title: "T Cell Priming CRISPR Screen Analysis",
    description:
      "Bioinformatics pipeline for Cellanome platform data processing, CITE-seq integration, and cell-cell interaction analysis to identify therapeutic targets that rescue dendritic cell priming of T cells in immunosuppressive tumor environments. Won 1st place at UCSF ImmunoX Hackathon.",
    tags: ["CITE-seq", "CRISPR screens", "ScanPy", "scRNA-seq"],
    status: "complete",
  },
  {
    title: "Calcium Imaging Analysis Pipeline",
    description:
      "Software pipeline for processing calcium microscopy video data at Stanford Schnitzer Lab. Generates raster plots and detects activation traces and dendritic spline outlines from fluorescence imaging data.",
    tags: ["Python", "MATLAB", "image processing", "neuroscience"],
    status: "archived",
  },
  {
    title: "This Website",
    description:
      "Personal site built to be a genuine reflection of how I think — not a portfolio. Next.js App Router, Tailwind CSS v4, markdown blog, and a lot of time spent on rounded corners.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/agurjar123",
    status: "ongoing",
  },
];
