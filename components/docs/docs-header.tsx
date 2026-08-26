"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DocsSidebarNav } from "@/components/docs/docs-sidebar"
import { DocsSearchTrigger } from "@/components/docs/docs-search-dialog"
import { REPO_URL } from "@/lib/wizard"
import { findDocPage, findSectionForSlug } from "@/lib/docs-nav"
import type { DocSearchEntry } from "@/lib/docs-search"

export function DocsHeader({ entries }: { entries: DocSearchEntry[] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const slug = pathname.replace(/^\/docs\/?/, "")
  const page = findDocPage(slug)
  const section = findSectionForSlug(slug)

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center p-2 rounded-lg border border-border bg-secondary/60 text-foreground shadow-sm transition-all hover:bg-secondary active:scale-95 lg:hidden"
            aria-label="Open docs navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex shrink-0 items-baseline gap-1.5">
            <span className="font-display text-lg tracking-tight text-foreground">Wizard</span>
            <span className="h-1 w-1 rounded-full bg-[#eca8d6]" />
          </Link>

          <div className="hidden min-w-0 items-center gap-1.5 border-l border-border/70 pl-4 font-mono text-xs text-muted-foreground sm:flex">
            <Link href="/docs" className="shrink-0 transition-colors hover:text-foreground">
              docs
            </Link>
            {section && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                <span className="shrink-0">{section.title.toLowerCase()}</span>
              </>
            )}
            {page && (
              <>
                <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                <span className="truncate text-foreground">{page.title}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <DocsSearchTrigger entries={entries} />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground hidden sm:inline-block"
          >
            GitHub
          </a>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] overflow-y-auto p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="font-display text-lg">Documentation</SheetTitle>
          </SheetHeader>
          <div className="mb-4 sm:hidden">
            <DocsSearchTrigger entries={entries} />
          </div>
          <DocsSidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
