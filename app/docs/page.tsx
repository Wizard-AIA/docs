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
    <div className="max-w-4xl">
      <Reveal>
        <h1 className="mb-4 font-display text-4xl tracking-tight text-foreground lg:text-5xl">Wizard Docs</h1>
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A local-first autonomous data analysis agent. Investigates, executes real code in secure sandboxes,
          self-corrects on errors, and independently verifies conclusions.
        </p>
      </Reveal>

      <Reveal delay={80} className="mb-16 flex flex-wrap gap-3">
        <Link
          href="/docs/getting-started/installation"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Download &amp; Install
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/docs/getting-started/quickstart"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          5-Minute Quickstart
        </Link>
      </Reveal>

      <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">Explore the docs</h2>
      <div className="mb-20 grid gap-4 sm:grid-cols-2">
        {sections.map((section, i) => (
          <Reveal key={section.title} delay={i * 60}>
            <Link
              href={section.href}
              className="group block rounded-lg border border-border p-5 transition-colors hover:border-foreground/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-foreground">{section.title}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="mb-6 font-display text-2xl tracking-tight text-foreground">How Wizard works</h2>
      </Reveal>
      <ol className="mb-20 space-y-3">
        {howItWorks.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} as="li" className="flex gap-3 text-sm">
            <span className="font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-foreground/80">
              <span className="font-medium text-foreground">{step.title}:</span> {step.body}
            </p>
          </Reveal>
        ))}
      </ol>

      <Reveal>
        <h2 className="mb-6 font-display text-2xl tracking-tight text-foreground">Local vs cloud data modes</h2>
      </Reveal>
      <Reveal delay={80} className="mb-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-2.5 text-left font-medium text-foreground">Capability</th>
              <th className="px-4 py-2.5 text-left font-medium text-foreground">Local mode</th>
              <th className="px-4 py-2.5 text-left font-medium text-foreground">Cloud permitted</th>
            </tr>
          </thead>
          <tbody>
            {dataModes.map((row) => (
              <tr key={row.capability}>
                <td className="border-t border-border px-4 py-2.5 font-medium text-foreground">{row.capability}</td>
                <td className="border-t border-border px-4 py-2.5 text-foreground/80">{row.local}</td>
                <td className="border-t border-border px-4 py-2.5 text-foreground/80">{row.cloud}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  )
}
