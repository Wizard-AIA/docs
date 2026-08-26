"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { DOCS_NAV, findSectionForSlug } from "@/lib/docs-nav"

export function DocsSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const activeSection = findSectionForSlug(pathname.replace(/^\/docs\//, ""))?.title

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(DOCS_NAV.map((s) => s.title))
  )

  useEffect(() => {
    if (activeSection) setOpenSections((prev) => new Set(prev).add(activeSection))
  }, [activeSection])

  return (
    <nav className="space-y-1 font-mono text-[13px]">
      {DOCS_NAV.map((section) => {
        const isOpen = openSections.has(section.title)
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() =>
                setOpenSections((prev) => {
                  const next = new Set(prev)
                  if (next.has(section.title)) next.delete(section.title)
                  else next.add(section.title)
                  return next
                })
              }
              className="group flex w-full items-center gap-1.5 py-1.5 text-left text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronRight
                className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
              />
              {section.title}
            </button>

            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <ul className="relative ml-[5px] border-l border-border/70 pb-1.5 pl-4">
                  {section.pages.map((page) => {
                    const href = `/docs/${page.slug}`
                    const active = pathname === href
                    return (
                      <li key={page.slug} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-4 top-1/2 h-px w-3 -translate-y-1/2 bg-border/70"
                        />
                        <Link
                          href={href}
                          onClick={onNavigate}
                          className={`relative block rounded-md py-1.5 pl-2.5 pr-2 leading-tight transition-colors ${
                            active
                              ? "text-foreground before:absolute before:-left-[calc(1rem+1px)] before:top-0 before:h-full before:w-px before:bg-[#eca8d6]"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {page.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </nav>
  )
}
