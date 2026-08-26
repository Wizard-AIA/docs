"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyCommand({ command, lines }: { command?: string; lines?: string[] }) {
  const [copied, setCopied] = useState(false)
  const displayLines = lines ?? [command ?? ""]
  const copyText = displayLines.map((l) => l.replace(/\s{2,}#.*$/, "")).join("\n")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard denied — command is still visible to copy by hand
    }
  }

  return (
    <div className="group relative w-full max-w-full min-w-0 flex items-start gap-2.5 sm:gap-3 rounded-lg border border-white/10 bg-black px-3.5 sm:px-4 py-3 font-mono text-xs sm:text-sm text-white/90">
      <span className="mt-0.5 select-none text-white/30 shrink-0" aria-hidden="true">$</span>
      <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed font-mono">
        {displayLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Copy command"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  )
}
