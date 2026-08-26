"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function HeroTerminal({
  command,
  label = "terminal",
  size = "md",
}: {
  command: string
  label?: string
  size?: "sm" | "md"
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard denied — command is still visible to copy by hand
    }
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/70 backdrop-blur-md shadow-[0_0_60px_-20px_rgba(236,168,214,0.35)] transition-shadow duration-500 hover:shadow-[0_0_70px_-15px_rgba(236,168,214,0.5)]"
    >
      {/* Ambient gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-20"
        style={{
          background: "linear-gradient(90deg, #eca8d6, #a78bfa, #67e8f9)",
        }}
      />

      {/* Title bar */}
      <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-white/30">{label}</span>
      </div>

      {/* Body */}
      <div className={`relative flex items-center gap-3 ${size === "sm" ? "px-4 py-3" : "px-5 py-4"}`}>
        <span className="select-none font-mono text-[#eca8d6]" aria-hidden="true">
          $
        </span>
        <code className={`flex-1 overflow-x-auto whitespace-nowrap font-mono text-white/90 ${size === "sm" ? "text-sm" : "text-base"}`}>
          {command}
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
