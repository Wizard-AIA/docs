# Quickstart

This walks through your first question, once [Installation](installation.md)
is done and the app is running at **http://localhost:3000**.

## 1. Upload data

Drag a CSV, TSV, Excel, JSON, NDJSON, Parquet, or Feather file onto the
composer, or connect a database — see [Connectors](../concepts/connectors.md).
Large files are sampled for analysis while the full file stays available in
the workspace. Every loaded table becomes addressable to generated code as
`tables['name']`, so cross-table questions need no extra setup step.

## 2. Ask a real question

Type it in plain language — "which customer segment had the highest churn
last quarter, and why" rather than "compute churn by segment". The point of
the [agentic loop](../concepts/architecture.md) is that it's allowed to look
before committing to an approach.

## 3. Watch it work

Every stage streams as it happens: the manager's reasoning, each move it
makes and what it found, the generated code, the program's stdout, and the
final answer token by token. If a step fails, you'll see the traceback and
the retry — that's the [self-correction loop](../concepts/architecture.md),
not a bug.

## 4. Pick a depth (optional)

Three depths are available in the composer:

- **Fast** — one pass, no verification. Cheapest, least self-checking.
- **Auto** (default) — the agent decides how much investigation the question
  needs.
- **Deep** — investigate thoroughly, with a decision round-trip on every
  iteration and a verification pass at the end, regardless of model size.

## 5. Read the trust signals, not just the answer

- Any number in the answer that doesn't trace back to real execution output
  is flagged — the agent doesn't get to invent a figure that looks plausible.
- Silent decisions the code made (dropped nulls, an inner join, a top-N cut,
  a coerced date) are listed alongside the answer, because each one changes
  what the number means.
- The headline result is independently recomputed by a different route; a
  mismatch is reported prominently rather than quietly resolved.

## 6. Keep the work

Every analysis is written out as a runnable script you can re-run next month
against fresh data — see [Exporting an Analysis](../guides/exporting-an-analysis.md).
If you find yourself asking a structurally similar question again later,
Wizard may offer to save it as a reusable [skill](../concepts/skills.md).

## Where next

- [Architecture](../concepts/architecture.md) if you want to know what's
  actually happening in that loop.
- [Data Modes & Privacy](../concepts/data-modes-and-privacy.md) before you
  point Wizard at anything sensitive and consider a cloud provider.
- [Edge Cases & Gotchas](../troubleshooting/edge-cases.md) for the behaviors
  that surprise people first.
