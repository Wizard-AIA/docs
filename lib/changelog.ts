// Structured release history — same facts as the GitHub releases, kept here
// as data so the /changelog page can render its own designed layout instead
// of linking out to GitHub for release notes.

export interface Release {
  version: string;
  tag: string; // GitHub release tag, for the optional "view on GitHub" link
  kind: "launch" | "feature" | "docs";
  title: string;
  date: string; // ISO date
  highlights: { title: string; body: string }[];
}

export const RELEASES: Release[] = [
  {
    version: "v1.0.4",
    tag: "v1.0.4",
    kind: "feature",
    title: "Persistent Workspace Context, Live Datasets Sidebar & Interactive Settings Workbench",
    date: "2026-08-28",
    highlights: [
      {
        title: "Global persistent workspace context",
        body: "Elevated the chat streaming state, WebSocket transport, investigation trail, and dataset state to the root WorkspaceProvider. Tab switching across Chat, Data, Skills, Models, and Settings no longer interrupts execution turns or clears conversational history.",
      },
      {
        title: "Real-time dataset sidebar & live execution pulse",
        body: "Added an active datasets panel directly in the main navigation sidebar with live row counts, fast dataset switching, and an animated live pulsing badge that tracks active background execution.",
      },
      {
        title: "Interactive runtime & environment settings workbench",
        body: "Upgraded settings from static readouts to interactive management with runtime execution backends (host, docker, inprocess), OS-level sandboxing, reasoning depth tiers, verification gates, and atomic .env file persistence on the backend.",
      },
      {
        title: "Synchronized OpenAPI & TypeScript contracts",
        body: "Automated end-to-end schema synchronization and contract validation across backend FastAPI schemas and frontend TypeScript models.",
      },
    ],
  },
  {
    version: "v1.0.3",
    tag: "v1.0.3",
    kind: "feature",
    title: "Universal Cross-Platform Installers, Blueprint Diagrams & Documentation Suite",
    date: "2026-08-28",
    highlights: [
      {
        title: "Universal 1-command installer suite",
        body: "Shipped automated single-command installers for Linux (curl -fsSL https://wizardw2.vercel.app/install.sh | bash) and Windows PowerShell (irm https://wizardw2.vercel.app/install.ps1 | iex), alongside the official Homebrew tap and Scoop package manifest.",
      },
      {
        title: "Fixed 3-column documentation architecture",
        body: "Redesigned the documentation shell with isolated independent scroll containers (Left Navigation, Middle Reading Content, Right Table of Contents) so sidebars remain fixed in place while navigating articles.",
      },
      {
        title: "Blueprint architecture diagram canvas",
        body: "Implemented a dedicated blueprint rendering canvas with non-ligature monospace font grid and verified specification badges for all architecture and workflow flowcharts.",
      },
      {
        title: "Global CLI symlink path resolution",
        body: "Enhanced the Go supervisor CLI with symlink traversal to resolve application roots when executed globally from any directory outside the git checkout.",
      },
      {
        title: "CodeGuard AST & sandbox hardening",
        body: "Expanded static AST security analysis across 31 banned modules, 11 builtins, and 22 dunder access patterns with graceful LLM provider error handling.",
      },
    ],
  },
  {
    version: "v1.0.2",
    tag: "v1.0.2",
    kind: "docs",
    title: "Ecosystem Documentation & Community Governance",
    date: "2026-08-26",
    highlights: [
      {
        title: "Ecosystem documentation overhaul",
        body: "Refreshed the docs site with custom styling, card layouts, and clearer architecture walkthroughs.",
      },
      {
        title: "Community skill registry",
        body: "Populated the skills repository with curated domain skills — cohort-analysis, data-quality-triage, outlier-detection, time-series-forecasting — with automated registry compilation.",
      },
      {
        title: "Standardized issue forms",
        body: "Cross-platform GitHub issue forms with dropdown selectors for operating system, execution backend, and LLM provider.",
      },
      {
        title: "Organization profile refresh",
        body: "A direct standalone download matrix for macOS (arm64/amd64), Linux (amd64/arm64), and Windows.",
      },
    ],
  },
  {
    version: "v1.0.1",
    tag: "v1.0.1",
    kind: "feature",
    title: "Analytics, Task Routing, Arrow Streaming & Hardening",
    date: "2026-08-25",
    highlights: [
      {
        title: "Polars engine integration",
        body: "Added Polars support alongside DuckDB and pandas for fast, multi-threaded DataFrame processing on large datasets.",
      },
      {
        title: "Smart tiered task router",
        body: "A deterministic classifier for lightweight, standard, and reasoning-heavy turns, with safe dynamic downscaling to smaller installed models.",
      },
      {
        title: "Zero-copy Apache Arrow streaming",
        body: "A high-throughput binary Arrow IPC streaming endpoint and frontend decoder for instant large-dataset previews.",
      },
      {
        title: "Security & fuzzing",
        body: "Continuous property-based fuzz testing for AST code guards and file-ingest headers, plus OpenSSF Scorecard token permissions.",
      },
      {
        title: "Dynamic skill RAG & caching",
        body: "Full integration of the semantic result cache and dynamic skill RAG retrieval.",
      },
    ],
  },
  {
    version: "v1.0.0",
    tag: "v1.0.0",
    kind: "launch",
    title: "First Consumer Release",
    date: "2026-08-25",
    highlights: [
      {
        title: "Standalone prebuilt binaries",
        body: "Pre-compiled standalone zip packages for macOS (arm64/amd64), Linux (amd64/arm64), and Windows (amd64).",
      },
      {
        title: "One-command CLI",
        body: "Introduced wizard init and wizard start — a background supervisor daemon for both services.",
      },
      {
        title: "Evidence-backed control plane",
        body: "Multi-hypothesis tracking, adversarial verification, result grounding checks, and transparent assumption extraction.",
      },
      {
        title: "OS-native sandboxing",
        body: "Secure subprocess execution with Landlock/seccomp on Linux, sandbox-exec on macOS, and Windows Job Objects.",
      },
      {
        title: "Autonomous feedback loop",
        body: "A Manager/Worker ReAct agent cycle with automatic Python traceback recovery.",
      },
    ],
  },
];
