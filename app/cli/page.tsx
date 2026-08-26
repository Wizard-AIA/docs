import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { CopyCommand } from "@/components/copy-command"
import { Reveal } from "@/components/reveal"
import { DOCS_URL } from "@/lib/wizard"

export const metadata: Metadata = {
  title: "CLI reference — Wizard",
  description: "The full wizard CLI subcommand reference, setup recipes and configuration table.",
}

const CLI_COMMANDS = [
  {
    command: "wizard init",
    description:
      "Checks Python 3.12+/Node 20+/uv/pnpm (and optional Ollama) are on PATH; copies backend/.env.example, creates a managed venv, installs backend requirements, builds the frontend's production bundle. --pull-models also pulls a default manager/worker pair.",
  },
  {
    command: "wizard start",
    description:
      "Launches backend + frontend as a detached background supervisor, waits until the backend answers healthy, checks API version compatibility, opens a browser. --backend-port/--frontend-port override 8000/3000; --no-browser skips opening one.",
  },
  {
    command: "wizard stop",
    description: "Idempotent. Asks the supervisor to stop and waits for cleanup; falls back to a forced kill of recorded pids.",
  },
  {
    command: "wizard status / wizard doctor",
    description:
      "Same command. Local checks (what's running, log sizes, API_PROVIDER/DATA_MODE, EXECUTION_BACKEND) plus a render of the backend's own GET /api/config.",
  },
  {
    command: "wizard attach",
    description: "Prints status, then follows backend.log/frontend.log live, source-prefixed, until Ctrl+C. Read-only.",
  },
  {
    command: "wizard logs",
    description: "One-shot: prints the log file paths; --tail N also prints the last N lines of each.",
  },
  {
    command: "wizard update",
    description:
      "git pull --ff-only, reinstalls dependencies the same way init does, re-checks the compat marker. Restarts the daemon afterward if it was running before.",
  },
  {
    command: "wizard skills add/list/update/discard/remove/token",
    description: "Fronts the built-in skill installer — fetch, pin to a commit, show contents, ask before writing.",
  },
  {
    command: "wizard version",
    description: "Prints this binary's compiled-in compat version.",
  },
]

const SETUP_RECIPES = [
  {
    name: "Local-only",
    tagline: "Nothing leaves your machine. No API key.",
    command: "wizard init",
  },
  {
    name: "Hybrid",
    tagline: "Keep local models, make a cloud key available for either role.",
    command: "wizard init --data-mode hybrid --anthropic-key sk-ant-...",
  },
  {
    name: "Cloud-only",
    tagline: "No local weights needed — Anthropic, OpenAI, Gemini, or any gateway.",
    command: "wizard init --provider anthropic --anthropic-key sk-ant-...",
  },
  {
    name: "Any OpenAI-compatible gateway",
    tagline: "Groq, OpenRouter, Together, vLLM.",
    command: "wizard init --provider custom_gateway --gateway-url https://api.groq.com/openai/v1 --gateway-key gsk_...",
  },
]

const ENV_KEYS = [
  { key: "API_PROVIDER", value: "ollama", purpose: "Default backend: ollama, lmstudio, anthropic, openai, gemini or custom_gateway" },
  { key: "DATA_MODE", value: '"" (derives)', purpose: "local-only, hybrid or cloud-only — what may leave this machine" },
  { key: "MODEL_NAME", value: '""', purpose: "Pin the reasoning model. Empty = use what the provider has" },
  { key: "WORKER_MODEL_NAME", value: '""', purpose: "Pin the code model. Empty = use what the provider has" },
  { key: "AGENT_TIER", value: "auto", purpose: "auto, compact, balanced or full — how long an investigation may run" },
  { key: "AGENT_VERIFY", value: "True", purpose: "Recompute the headline result a second way" },
  { key: "EXECUTION_BACKEND", value: "host", purpose: "host (subprocess, no Docker), docker or inprocess" },
  { key: "SANDBOX_TIER", value: "standard", purpose: "core, standard or full — how much toolkit the image installs" },
  { key: "HOST_SANDBOX", value: "best-effort", purpose: "off, best-effort or require — OS containment for the host runtime" },
  { key: "PLOT_FORMAT", value: "html", purpose: "html for interactive Plotly, png for static" },
  { key: "CORS_ALLOW_ORIGINS", value: "http://localhost:3000", purpose: "Comma-separated allowlist" },
  { key: "API_KEY", value: '""', purpose: "When set, mutating routes require X-API-Key" },
]

export default function CliPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />

      <section className="max-w-[900px] mx-auto px-6 lg:px-12 pt-40 pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            Reference
          </span>
          <h1 className="text-5xl md:text-6xl font-display tracking-tight mb-4">
            The wizard CLI.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            A single static binary that manages the backend and frontend as a background
            service — the same subcommands on Linux, macOS and Windows.
          </p>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-display mb-6">Subcommands</h2>
          </Reveal>
          <div className="border border-border divide-y divide-border">
            {CLI_COMMANDS.map((cmd, i) => (
              <Reveal key={cmd.command} delay={i * 40} as="div" className="p-5">
                <code className="text-sm font-mono text-foreground">{cmd.command}</code>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{cmd.description}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-display mb-2">Setup recipes</h2>
            <p className="text-sm text-muted-foreground mb-6">
              <span className="font-mono">wizard init</span> configures a local, hybrid or fully
              cloud install in one run — every flag is also safe to run again against an
              already-configured <span className="font-mono">backend/.env</span>.
            </p>
          </Reveal>
          <div className="space-y-6">
            {SETUP_RECIPES.map((recipe, i) => (
              <Reveal key={recipe.name} delay={i * 60}>
                <h3 className="text-sm font-medium mb-1">{recipe.name} — {recipe.tagline}</h3>
                <CopyCommand command={recipe.command} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16">
          <h2 className="text-2xl font-display mb-2">Configuration</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Copy <span className="font-mono">backend/.env.example</span> to{" "}
            <span className="font-mono">backend/.env</span>. Everything has a working default.
          </p>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Default</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ENV_KEYS.map((row) => (
                  <tr key={row.key}>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-foreground">{row.key}</td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-muted-foreground">{row.value}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Resource limits — <span className="font-mono">LLM_NUM_THREAD</span>,{" "}
            <span className="font-mono">SANDBOX_MEM_LIMIT</span>,{" "}
            <span className="font-mono">SESSION_MAX_ACTIVE</span> — are left unset on purpose.
            They&apos;re derived from the machine at boot; setting one pins it.
          </p>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-display mb-6">Common issues</h2>
          </Reveal>
          <div className="space-y-6">
            <Reveal>
              <h3 className="text-sm font-medium mb-1">A question takes many minutes, or never finishes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check whether <span className="font-mono text-foreground">MODEL_NAME</span> is a reasoning
                model (<span className="font-mono">deepseek-r1</span>, <span className="font-mono">qwq</span>) —
                by far the most common cause. Use a plain instruct model for the manager role; a reasoning
                model is fine as the worker.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h3 className="text-sm font-medium mb-1">Is LLM_NUM_THREAD set in backend/.env?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Delete it. Local inference is memory-bandwidth bound, so more threads than physical cores
                is contention, not throughput. Unset, it&apos;s measured from the machine.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h3 className="text-sm font-medium mb-1">&quot;Local subprocess&quot; instead of &quot;Docker container&quot;</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Docker is unreachable, so code runs in a subprocess of the backend — bounded, interruptible,
                and it keeps variables between steps, but not isolated from your filesystem.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-16 pt-8 border-t border-border">
          <Link
            href={`${DOCS_URL}/getting-started/cli`}
            className="text-sm underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Full CLI guide in the docs →
          </Link>
        </Reveal>
      </section>

      <FooterSection />
    </main>
  )
}
