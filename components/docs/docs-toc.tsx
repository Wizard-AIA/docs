"use client"

import { useEffect, useState } from "react"
import type { DocHeading } from "@/lib/docs-content"

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 1 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="text-sm">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">On this page</h3>
      <ul className="relative space-y-1 border-l border-border/70">
        {headings.map((h) => {
          const active = h.id === activeId
          return (
            <li
              key={h.id}
              className="relative"
              style={{ paddingLeft: h.depth === 3 ? "1.75rem" : "1rem" }}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute -left-px top-0 h-full w-px bg-[#eca8d6]"
                />
              )}
              <a
                href={`#${h.id}`}
                className={`block py-0.5 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
