import type { ReactNode } from "react"
import { DocsHeader } from "@/components/docs/docs-header"
import { DocsSidebarNav } from "@/components/docs/docs-sidebar"
import { DocsFooter } from "@/components/docs/docs-footer"
import { getDocsSearchIndex } from "@/lib/docs-search"

export default function DocsLayout({ children }: { children: ReactNode }) {
  const entries = getDocsSearchIndex()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsHeader entries={entries} />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-10 px-4 py-10 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <DocsSidebarNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <DocsFooter />
    </div>
  )
}
