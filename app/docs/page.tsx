import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Official documentation for Wizard: architecture, task routing, local Ollama/DeepSeek setup, sandboxing, data connectors, and troubleshooting.",
  alternates: {
    canonical: "/docs",
  },
}

const sections = [
  {
    title: "Getting Started",
    description:
      "Step-by-step installation for macOS, Linux and Windows using standalone binaries, Docker Compose, or source.",
    href: "/docs/getting-started/installation",
  },
  {
    title: "Concepts",
    description:
      "The ReAct agent loop, dual Manager/Worker model dispatch, data modes and privacy, execution and sandboxing.",
    href: "/docs/concepts/architecture",
  },
  {
    title: "Guides",
    description: "Practical playbooks for exploratory data analysis, model training, and exporting an analysis.",
    href: "/docs/guides/exploratory-data-analysis",
  },
  {
    title: "Reference",
    description: "Every configuration option, the FastAPI REST routes, and the WebSocket streaming event frames.",
    href: "/docs/reference/configuration",
  },
  {
    title: "Troubleshooting",
    description: "Edge cases and gotchas collected from real runs — read this before filing an issue.",
    href: "/docs/troubleshooting/edge-cases",
  },
]

const dataModes = [
  {
    capability: "Privacy guarantee",
    local: "100% on-device — zero data egress",
    cloud: "External LLM API calls permitted",
  },
  {
    capability: "Model backends",
    local: "Ollama, LM Studio, local vLLM",
    cloud: "OpenAI, Anthropic, custom gateways",
  },
  {
    capability: "Embeddings",
    local: "Local sentence embeddings (embeddinggemma)",
    cloud: "Remote embedding APIs",
  },
  {
    capability: "Network egress",
    local: "Denied by default at the sandbox layer",
    cloud: "Outbound package install on demand",
  },
]

const howItWorks = [
  { title: "Manager plans & reasons", body: "Formulates hypotheses and chooses the next analytical move." },
  { title: "Worker generates code", body: "Writes targeted Python using DuckDB, Polars, or pandas." },
  { title: "AST guard screens code", body: "Prevents dangerous system operations or interpreter traversal." },
  {
    title: "Execution in sandbox",
    body: "Runs inside OS-contained subprocesses (Landlock/seccomp on Linux, sandbox-exec on macOS, Job Objects on Windows) or Docker.",
  },
  {
    title: "Real feedback & self-correction",
    body: "The manager inspects real output and tracebacks, self-correcting mistakes automatically.",
  },
  {
    title: "Trust verification",
    body: "Re-derives headline numbers by an alternative route and flags any ungrounded figures.",
  },
]

export default function DocsHomePage() {
  return (
    <div className="min-w-0 max-w-4xl py-8 lg:py-10 pl-0 lg:pl-6">
      <Reveal>
        <div className="mb-3 inline-flex items-center gap-2 font-mono text-xs text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-[#eca8d6]" />
          <span>Documentation Hub</span>
        </div>
        <h1 className="mb-4 font-display text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
          Wizard Docs
        </h1>
        <p className="mb-8 max-w-2xl text-[16px] leading-relaxed text-white/70">
          A local-first autonomous data analysis agent. Investigates, executes real code in secure sandboxes,
          self-corrects on errors, and independently verifies conclusions.
        </p>
      </Reveal>

      <Reveal delay={80} className="mb-16 flex flex-wrap gap-3">
        <Link
          href="/docs/getting-started/installation"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90 shadow-sm"
        >
          Download &amp; Install
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/docs/getting-started/quickstart"
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/[0.08] hover:border-white/30"
        >
          2-Minute Quickstart
        </Link>
      </Reveal>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-white/40">
        Explore Documentation
      </h2>
      <div className="mb-20 grid gap-4 sm:grid-cols-2">
        {sections.map((section, i) => (
          <Reveal key={section.title} delay={i * 60}>
            <Link
              href={section.href}
              className="group block rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-[#eca8d6]/40 hover:bg-white/[0.04]"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-display text-base font-medium text-white group-hover:text-[#eca8d6] transition-colors">
                  {section.title}
                </h3>
                <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <p className="text-sm leading-relaxed text-white/60">{section.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="mb-6 font-display text-2xl lg:text-3xl font-semibold tracking-tight text-white border-b border-white/10 pb-3">
          How Wizard Works
        </h2>
      </Reveal>
      <ol className="mb-20 space-y-3.5">
        {howItWorks.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} as="li" className="flex gap-4 text-[15px] leading-relaxed">
            <span className="font-mono text-xs font-semibold text-[#eca8d6] mt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-white/75">
              <strong className="font-semibold text-white">{step.title}:</strong> {step.body}
            </p>
          </Reveal>
        ))}
      </ol>

      <Reveal>
        <h2 className="mb-6 font-display text-2xl lg:text-3xl font-semibold tracking-tight text-white border-b border-white/10 pb-3">
          Local vs Cloud Data Modes
        </h2>
      </Reveal>
      <Reveal delay={80} className="mb-8 overflow-x-auto rounded-xl border border-white/10 bg-black/40 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-white/90">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-white">Capability</th>
              <th className="px-5 py-3 text-left font-semibold text-[#eca8d6]">Local mode</th>
              <th className="px-5 py-3 text-left font-semibold text-white/70">Cloud permitted</th>
            </tr>
          </thead>
          <tbody>
            {dataModes.map((row) => (
              <tr key={row.capability} className="transition-colors hover:bg-white/[0.02]">
                <td className="border-t border-white/5 px-5 py-3.5 font-medium text-white/90">{row.capability}</td>
                <td className="border-t border-white/5 px-5 py-3.5 text-white/80">{row.local}</td>
                <td className="border-t border-white/5 px-5 py-3.5 text-white/60">{row.cloud}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  )
}
