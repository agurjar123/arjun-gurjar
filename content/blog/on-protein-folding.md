---
title: "What AlphaFold Got Right (and What It Didn't Solve)"
date: "2025-04-10"
excerpt: "AlphaFold2 was a landmark. But the protein folding problem isn't fully solved, and understanding why reveals something interesting about scientific progress."
tags: ["biology", "machine learning", "structural biology"]
---

In 2020, DeepMind's AlphaFold2 achieved something that had eluded biology for fifty years: accurate prediction of protein structure from sequence. CASP14 scores that had previously plateaued jumped dramatically. The scientific community, not usually prone to hyperbole, called it a solution to the protein folding problem.

It was a landmark result. But the framing — "solved" — has always struck me as a bit off.

## What AlphaFold actually does

AlphaFold2 predicts the *static, equilibrium structure* of a single protein chain, given its amino acid sequence. It does this extraordinarily well. For many proteins, its predictions are indistinguishable from experimental structures resolved by X-ray crystallography or cryo-EM.

The key inputs are:
1. The target sequence
2. A multiple sequence alignment (MSA) — homologs of the protein from other organisms
3. Templates — experimentally known structures of similar proteins

The MSA is crucial. AlphaFold learns, in part, by identifying correlated mutations across evolution: if position 47 and position 112 tend to mutate together, they're probably spatially close (because mutations that disrupt an interface get selected against).

## What it doesn't do

Protein biology is full of phenomena that static structure prediction doesn't capture:

**Conformational dynamics.** Proteins aren't rigid. Many are intrinsically disordered; others oscillate between conformations that are functionally important. AlphaFold gives you one structure.

**Protein-protein interactions.** While AlphaFold-Multimer extended the framework to complexes, predicting how arbitrary proteins interact — and how that interaction changes with cellular context — remains hard.

**Function prediction.** Structure doesn't determine function in a simple way. Two proteins with nearly identical folds can have completely different activities. Knowing shape doesn't tell you what a protein *does*.

**Orphan proteins.** AlphaFold relies heavily on evolutionary information. For proteins with no known homologs — novel sequences, designed proteins, viral proteins from emerging pathogens — the MSA is shallow or empty, and performance degrades.

## What this means for science

AlphaFold changed biology. The structure database has grown by orders of magnitude. Researchers can now generate structural hypotheses in minutes that would have required months of experimental work. Drug discovery, enzyme engineering, and basic mechanistic research have all benefited.

But it's a tool for generating hypotheses, not a replacement for experiments. A predicted structure still needs to be validated for most applications. And the hard problems — dynamics, function, interactions in the messy cellular environment — are still hard.

I think this is actually fine. Science is a series of partial solutions, each of which reveals new questions. AlphaFold solved something that *felt* like the whole problem but turned out to be one well-specified subproblem within a much larger landscape.

That's usually what progress looks like.
