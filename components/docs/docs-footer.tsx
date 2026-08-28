"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { REPO_URL, DOCS_EDIT_BASE_URL } from "@/lib/wizard"
import { findDocPage } from "@/lib/docs-nav"

export function DocsFooter() {
  const pathname = usePathname()
  const slug = pathname.replace(/^\/docs\/?/, "")
  const page = findDocPage(slug)

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
        <p>BSD 3-Clause · local-first, no telemetry by default</p>
        <div className="flex items-center gap-6">
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          {page && (
            <a
              href={`${DOCS_EDIT_BASE_URL}/${page.slug}.md`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              Edit this page
            </a>
          )}
          <Link href="/" className="hover:text-foreground">
            Back to site
          </Link>
        </div>
      </div>
    </footer>
  )
}
