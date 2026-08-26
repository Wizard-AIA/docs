"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Hash, Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { DocSearchEntry } from "@/lib/docs-search"

export function DocsSearchTrigger({ entries }: { entries: DocSearchEntry[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const grouped = Array.from(new Set(entries.map((e) => e.section)))

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search docs…</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Jump to any page or section"
      >
        <CommandInput placeholder="Search the docs…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {grouped.map((section) => (
            <CommandGroup key={section} heading={section}>
              {entries
                .filter((e) => e.section === section)
                .map((entry) => (
                  <CommandItem
                    key={entry.href}
                    value={`${entry.section} ${entry.title}`}
                    onSelect={() => {
                      setOpen(false)
                      router.push(entry.href)
                    }}
                  >
                    {entry.isHeading ? (
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    {entry.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
