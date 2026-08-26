"use client"

import { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"

export function DocCodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false)

  const isShell = ["bash", "sh", "zsh", "shell"].includes(language.toLowerCase())

  const handleCopy = async () => {
    try {
      // Strip leading "$ " if copying a shell block
      const cleanCode = isShell ? code.replace(/^\$\s+/gm, "") : code
      await navigator.clipboard.writeText(cleanCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard fallback
    }
  }

  const lines = code.split("\n")

  return (
    <div className="group relative my-6 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/80 shadow-md backdrop-blur">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3.5 sm:px-4 py-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-white/50">
          {isShell ? <Terminal className="h-3.5 w-3.5 text-[#eca8d6]" /> : null}
          <span className="uppercase tracking-wider text-[10px] sm:text-[11px] font-semibold text-white/60">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#eca8d6]" />
              <span className="text-[#eca8d6]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="w-full max-w-full overflow-x-auto p-3.5 sm:p-4 text-[12.5px] sm:text-[13.5px] font-mono leading-relaxed text-white/90">
        <pre className="whitespace-pre">
          <code>
            {lines.map((line, idx) => {
              // Dim comment lines
              const isComment = line.trim().startsWith("#") || line.trim().startsWith("//")
              return (
                <div key={idx} className={`table-row ${isComment ? "text-white/40 italic" : ""}`}>
                  <span className="table-cell">{line || "\n"}</span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </div>
  )
}
