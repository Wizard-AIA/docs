import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Reveal } from "@/components/reveal"
import { REPO_URL } from "@/lib/wizard"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Wizard: the local-first autonomous AI data analyst, its architecture, open-source BSD-3-Clause license, and creator.",
  alternates: {
    canonical: "/about",
  },
}

function GitHubLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navigation />

      <section className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-12 pt-32 sm:pt-40 pb-24">
        <Reveal>
          <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-muted-foreground mb-6">
            <span className="w-6 sm:w-8 h-px bg-foreground/30" />
            About
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display tracking-tight mb-6">
            Built in the open.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Wizard is a local-first, autonomous data analysis agent — a manager model that plans and a worker
            model that writes code, investigating a real dataset in a sandboxed process until it has an answer
            it can independently verify. It's built as an open project: the code, the reasoning behind it, and
            the way it's governed are all public.
          </p>
        </Reveal>

        <Reveal delay={80} id="license" className="mt-20 scroll-mt-28 border-t border-border pt-12">
          <h2 className="text-2xl font-display mb-3">Open source</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Wizard is released under the <strong className="text-foreground">BSD 3-Clause license</strong> — a
            permissive license. You can use it, modify it, and ship it in a commercial product without asking
            permission or paying anything; the only real condition is keeping the copyright notice and
            disclaimer intact, and not using the project's name to endorse a derivative without asking. Like
            almost all open-source licenses, it comes with no warranty.
          </p>
          <GitHubLink href={`${REPO_URL}/blob/master/LICENSE`}>Read the full license on GitHub</GitHubLink>
        </Reveal>

        <Reveal delay={80} id="contributing" className="mt-16 scroll-mt-28 border-t border-border pt-12">
          <h2 className="text-2xl font-display mb-3">Contributing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Contributions to the backend, frontend, or CLI go through the same review path as everything else:
            fork, branch, and a pull request against <span className="font-mono text-foreground">master</span>.
            Commits follow the Conventional Commits format, and it's enforced automatically — CI won't pass
            without it. Changes to anything that executes generated code (the sandbox, the code guard, session
            handling) are held to a higher bar and need tests that demonstrate the new boundary actually holds,
            not just that the happy path works.
          </p>
          <GitHubLink href={`${REPO_URL}/blob/master/CONTRIBUTING.md`}>Read the contributing guide on GitHub</GitHubLink>
        </Reveal>

        <Reveal delay={80} id="security" className="mt-16 scroll-mt-28 border-t border-border pt-12">
          <h2 className="text-2xl font-display mb-3">Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Generated code runs in an OS-contained subprocess or a locked-down Docker container by default —
            that boundary is treated as the project's most sensitive surface. If you find a way through it, or
            any other vulnerability, the ask is simple: don't open a public issue or post a proof of concept.
            Report it privately first, so there's a fix out before the details are.
          </p>
          <GitHubLink href={`${REPO_URL}/blob/master/SECURITY.md`}>Read the full security policy on GitHub</GitHubLink>
        </Reveal>

        <Reveal delay={80} id="code-of-conduct" className="mt-16 scroll-mt-28 border-t border-border pt-12">
          <h2 className="text-2xl font-display mb-3">Community standards</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The short version: be someone people want to collaborate with. Disagreements about code and design
            are normal and welcome; personal attacks, harassment, and bad-faith arguments aren't. The full
            policy is adapted from the Contributor Covenant, and it's the same standard for everyone —
            maintainers included.
          </p>
          <GitHubLink href={`${REPO_URL}/blob/master/CODE_OF_CONDUCT.md`}>Read the code of conduct on GitHub</GitHubLink>
        </Reveal>

        <Reveal delay={100} className="mt-20 flex flex-wrap gap-3 border-t border-border pt-12">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Read the docs
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            View the repository
          </a>
        </Reveal>
      </section>

      <FooterSection />
    </main>
  )
}
