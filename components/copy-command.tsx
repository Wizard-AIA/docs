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
    <div className="group relative flex items-start gap-3 rounded-lg border border-white/10 bg-black px-4 py-3 font-mono text-sm text-white/90">
      <span className="mt-0.5 select-none text-white/30" aria-hidden="true">$</span>
      <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
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
