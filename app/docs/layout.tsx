import type { ReactNode } from "react"
import { DocsHeader } from "@/components/docs/docs-header"
import { DocsSidebarNav } from "@/components/docs/docs-sidebar"
import { getDocsSearchIndex } from "@/lib/docs-search"

export default function DocsLayout({ children }: { children: ReactNode }) {
  const entries = getDocsSearchIndex()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <DocsHeader entries={entries} />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 overflow-hidden">
        {/* Left Navigation Sidebar - fixed and independently scrollable */}
        <aside className="hidden h-full w-64 shrink-0 overflow-y-auto border-r border-white/5 py-8 pr-6 pl-4 lg:block [scrollbar-width:thin]">
          <DocsSidebarNav />
        </aside>
        {/* Middle and Right container */}
        <main className="min-w-0 flex-1 h-full overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
