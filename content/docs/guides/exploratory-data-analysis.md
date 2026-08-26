# Guide: Exploratory Data Analysis

A structured way to ask Wizard for a first, rigorous pass over a dataset you
haven't worked with before. You don't need to type any of this as a rigid
script — the agent's own [agentic loop](../concepts/architecture.md) will
already investigate and revise as it goes. This guide is useful as a
checklist for what a *thorough* EDA covers, and as a way to steer the agent
if its first pass misses something you specifically want checked.

## 1. Load and inspect

Ask for the shape, columns, and dtypes, plus a look at the first few rows.
This is normally the agent's own first move via the deterministic `inspect`
action — no model call needed for it.

## 2. Data quality

- Missing values, and their pattern (random vs. concentrated in specific
  columns or rows).
- Duplicate rows.
- Type mismatches — a numeric column stored as text is the single most
  common surprise in a real dataset.

## 3. Univariate analysis

**Numeric columns:**

- Summary statistics (mean, median, std, min, max).
- A normality check, not just an eyeballed histogram.
- Outlier detection (IQR or Z-score) — and a decision about whether an
  outlier is a data error or a real extreme value, which changes what you
  do about it.
- Histograms with a density overlay, and boxplots.

**Categorical columns:**

- Value counts.
- Bar or pie charts for low-cardinality columns; a table for high-cardinality
  ones, where a chart would just be noise.

## 4. Bivariate analysis

- **Numeric vs. numeric** — a correlation matrix (Pearson and/or Spearman,
  depending on whether the relationship looks linear), a heatmap, and
  scatter plots for the pairs that turn out to matter.
- **Numeric vs. categorical** — grouped aggregations and boxplots/violin
  plots split by category.
- **Categorical vs. categorical** — a contingency table, and a chi-square
  test of independence if the question is actually about association, not
  just description.

## 5. Multivariate analysis

For datasets with more than a couple of relevant dimensions: pairplots for
smaller datasets, or a dimensionality-reduction pass (PCA/t-SNE) for
higher-dimensional ones, purely as a way to *see* structure before deciding
what to model.

## 6. Summary

The point of an EDA isn't the individual charts — it's a synthesized answer
to "what's actually going on in this data, and what would I need to be
careful about before drawing conclusions from it." Ask explicitly for that
summary if the agent's answer stops short of it: data quality issues found,
the real trends, and anything that looked like an anomaly worth a second
look.
