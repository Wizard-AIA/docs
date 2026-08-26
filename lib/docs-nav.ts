// Mirrors Wizard-AIA/docs' mkdocs.yml nav tree exactly (verified via `gh api`).
// Single source of truth for the sidebar, prev/next links, and the search index.

export interface DocPage {
  title: string;
  slug: string; // matches a file at content/docs/<slug>.md
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}

export const DOCS_NAV: DocSection[] = [
  {
    title: "Getting Started",
    pages: [
      { title: "Installation", slug: "getting-started/installation" },
      { title: "Quickstart", slug: "getting-started/quickstart" },
      { title: "The wizard CLI", slug: "getting-started/cli" },
    ],
  },
  {
    title: "Concepts",
    pages: [
      { title: "Architecture & Control Plane", slug: "concepts/architecture" },
      { title: "Task Routing & Tiers", slug: "concepts/routing-and-tiers" },
      { title: "Data Modes & Privacy", slug: "concepts/data-modes-and-privacy" },
      { title: "Execution & Sandboxing", slug: "concepts/execution-and-sandboxing" },
      { title: "Permissions & Consent", slug: "concepts/permissions-and-consent" },
      { title: "Skills", slug: "concepts/skills" },
      { title: "Connectors & Streaming", slug: "concepts/connectors" },
    ],
  },
  {
    title: "Guides",
    pages: [
      { title: "Exploratory Data Analysis", slug: "guides/exploratory-data-analysis" },
      { title: "Model Training", slug: "guides/model-training" },
      { title: "Exporting an Analysis", slug: "guides/exporting-an-analysis" },
      { title: "Installing a Skill from GitHub", slug: "guides/installing-a-skill" },
    ],
  },
  {
    title: "Reference",
    pages: [
      { title: "Configuration", slug: "reference/configuration" },
      { title: "API & Event Protocol", slug: "reference/api" },
    ],
  },
  {
    title: "Troubleshooting",
    pages: [{ title: "Edge Cases & Gotchas", slug: "troubleshooting/edge-cases" }],
  },
];

export const ALL_DOC_PAGES: DocPage[] = DOCS_NAV.flatMap((section) => section.pages);

export function findDocPage(slug: string): DocPage | undefined {
  return ALL_DOC_PAGES.find((p) => p.slug === slug);
}

export function findSectionForSlug(slug: string): DocSection | undefined {
  return DOCS_NAV.find((section) => section.pages.some((p) => p.slug === slug));
}

export function getAdjacentPages(slug: string): { prev?: DocPage; next?: DocPage } {
  const index = ALL_DOC_PAGES.findIndex((p) => p.slug === slug);
  if (index === -1) return {};
  return {
    prev: index > 0 ? ALL_DOC_PAGES[index - 1] : undefined,
    next: index < ALL_DOC_PAGES.length - 1 ? ALL_DOC_PAGES[index + 1] : undefined,
  };
}
