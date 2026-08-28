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
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 items-start px-4 lg:px-8">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto py-8 pr-6 border-r border-white/5 lg:block [scrollbar-width:thin]">
          <DocsSidebarNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <DocsFooter />
    </div>
  )
}
