export type Project = {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  status: "complete" | "ongoing" | "archived";
  highlight?: string;
};

export const projects: Project[] = [
  {
    title: "Tri-Modal LUAD Clinical Decision Support",
    description:
      "Winning project at the Y Combinator Bio/AI Hackathon. Tri-modal immunotherapy-readiness system fusing H&E whole-slide image pathology, bulk RNA-seq transcriptomics, and clinical data to classify tumor microenvironments as Hot/Warm/Cold and support treatment sequencing, clinical trial matching, and agentic co-pilot queries.",
    tags: ["Python", "TypeScript", "multimodal ML", "pathology", "transcriptomics", "LLM agent"],
    github: "https://github.com/agurjar123/yc-aixbio-hackathon",
    status: "complete",
    highlight: "YC Bio/AI Hackathon Winner",
  },
  {
    title: "DeepVariant Interpretability",
    description:
      "Mechanistic interpretability analysis of DeepVariant, Google's deep learning CNN for genomic variant calling. Using sparse autoencoders to profile and cluster model embeddings to decode how representations capture GIAB genomic stratifications, ENCODE functional annotations, human ancestry (1000 Genomes), and cross-species generalization.",
    tags: ["PyTorch", "sparse autoencoders", "interpretability", "genomics"],
    github: "https://github.com/agurjar123",
    status: "ongoing",
  },
  {
    title: "Pooled Optical Screen Pipelines",
    description:
      "Unified analysis pipelines for pooled optical screens at the Innovative Genomics Institute. Includes multi-channel fluorescence alignment, automated cell segmentation, and spatial transcriptomics integration across large-scale datasets.",
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
    highlight: "1st Place — UCSF ImmunoX Hackathon",
    status: "complete",
  },
  {
    title: "This Website",
    description:
      "Personal site built to be a genuine reflection of how I think — not a portfolio. Next.js App Router, Tailwind CSS v4, markdown blog, and a lot of time spent on rounded corners.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/agurjar123/arjun-gurjar",
    status: "ongoing",
  },
];
