import { ALL_DOC_PAGES, findSectionForSlug } from "@/lib/docs-nav";
import { getDocSource, extractHeadings } from "@/lib/docs-content";

export interface DocSearchEntry {
  title: string;
  section: string;
  href: string;
  isHeading: boolean;
}

// Server-only (reads content/docs/*.md via fs) — computed once in app/docs/layout.tsx
// and handed to the client search dialog as plain data, never imported client-side.
export function getDocsSearchIndex(): DocSearchEntry[] {
  const entries: DocSearchEntry[] = [];

  for (const page of ALL_DOC_PAGES) {
    const section = findSectionForSlug(page.slug)?.title ?? "";
    const { body } = getDocSource(page.slug);
    entries.push({ title: page.title, section, href: `/docs/${page.slug}`, isHeading: false });

    for (const heading of extractHeadings(body)) {
      entries.push({
        title: heading.text,
        section: page.title,
        href: `/docs/${page.slug}#${heading.id}`,
        isHeading: true,
      });
    }
  }

  return entries;
}
