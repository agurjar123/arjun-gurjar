export type ResearchInterest = {
  title: string;
  description: string;
  tags: string[];
};

export const researchInterests: ResearchInterest[] = [
  {
    title: "Mechanistic Interpretability of Genomic ML Models",
    description:
      "Using sparse autoencoders and representation analysis to understand what deep learning models learn when trained on genomic sequences. Currently applying these techniques to DeepVariant to decode how its embeddings capture functional annotations, genomic stratifications, and human ancestry — with the goal of generating interpretable biological hypotheses from model internals.",
    tags: ["mechanistic interpretability", "sparse autoencoders", "DeepVariant", "deep learning"],
  },
  {
    title: "Functional Genomics & CRISPR Screens",
    description:
      "Pooled optical screens, spatial transcriptomics, and CRISPR-based perturbation approaches for functional genomic annotation. I'm especially interested in combining high-throughput genetic perturbations with single-cell readouts to identify causal variants and therapeutic targets — in contexts ranging from neurodegenerative disease (GBA1/Parkinson's) to tumor immunology.",
    tags: ["CRISPR screens", "functional genomics", "spatial transcriptomics", "pooled screens"],
  },
  {
    title: "Single-Cell Genomics & Tumor Immunology",
    description:
      "Single-cell and multi-omics approaches (scRNA-seq, CITE-seq, cell-cell interaction analysis) to understand how immune cells behave in complex environments. Particularly interested in the circuits that govern dendritic cell priming of T cells in immunosuppressive tumor microenvironments, and how perturbation screens can identify targets to restore anti-tumor immunity.",
    tags: ["scRNA-seq", "CITE-seq", "tumor immunology", "T cell priming", "ScanPy"],
  },
  {
    title: "ML for Complex Disease Phenotyping",
    description:
      "Representation learning and probabilistic modeling approaches for characterizing disease trajectories from large-scale clinical data. My work on MS patient trajectories using Doc2Vec and Gaussian mixture models points toward a broader interest: how do we extract clinically meaningful signal from noisy, high-dimensional longitudinal records?",
    tags: ["representation learning", "NLP", "disease trajectories", "EHR data"],
  },
];
