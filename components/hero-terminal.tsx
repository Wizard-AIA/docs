"use client"

import { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"

export interface TerminalTab {
  id: string
  label: string
  command: string
}

export function HeroTerminal({
  command,
  tabs,
  label = "terminal",
  size = "md",
}: {
  command?: string
  tabs?: TerminalTab[]
  label?: string
  size?: "sm" | "md"
}) {
  const [activeTabId, setActiveTabId] = useState<string>(tabs && tabs.length > 0 ? tabs[0].id : "")
  const [copied, setCopied] = useState(false)

  const activeCommand = tabs && tabs.length > 0
    ? (tabs.find((t) => t.id === activeTabId)?.command ?? tabs[0].command)
    : (command ?? "")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard denied — command is still visible to copy by hand
    }
  }

  return (
    <div
      className="group relative w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(236,168,214,0.35)] transition-shadow duration-500 hover:shadow-[0_0_70px_-15px_rgba(236,168,214,0.5)]"
    >
      {/* Ambient gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-20"
        style={{
          background: "linear-gradient(90deg, #eca8d6, #a78bfa, #67e8f9)",
        }}
      />

      {/* Title bar / Tabs */}
      <div className="relative flex items-center justify-between border-b border-white/10 px-3.5 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[10px] sm:text-[11px] text-white/40 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-white/30" />
            {label}
          </span>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/10">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTabId
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-mono rounded transition-colors ${
                    isActive
                      ? "bg-white/20 text-white font-medium shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`relative flex items-center gap-2 sm:gap-3 ${size === "sm" ? "px-3.5 py-2.5 sm:px-4 sm:py-3" : "px-3.5 py-3 sm:px-5 sm:py-4"}`}>
        <span className="select-none font-mono text-[#eca8d6] text-xs sm:text-sm shrink-0" aria-hidden="true">
          $
        </span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[12px] sm:text-sm md:text-base text-white/90 scrollbar-none">
          {activeCommand}
          <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] animate-[blink_1.1s_steps(1)_infinite] bg-[#eca8d6] align-middle" />
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Copy command"
        >
          {copied ? <Check className="h-4 w-4 text-[#eca8d6]" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
