import type { Metadata } from "next"
import { ArrowUpRight, Rocket, Sparkles, BookOpen } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { FooterSection } from "@/components/landing/footer-section"
import { Reveal } from "@/components/reveal"
import { RELEASES, type Release } from "@/lib/changelog"
import { REPO_URL } from "@/lib/wizard"

export const metadata: Metadata = {
  title: "Changelog & Releases",
  description: "Explore the release history, new features, model integrations, and performance improvements in Wizard.",
  alternates: {
    canonical: "/changelog",
  },
}

const KIND_META: Record<Release["kind"], { label: string; icon: typeof Rocket }> = {
  launch: { label: "Launch", icon: Rocket },
  feature: { label: "Feature", icon: Sparkles },
  docs: { label: "Docs", icon: BookOpen },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />

      {/* Header */}
      <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.15]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute h-px bg-white/20" style={{ top: `${16.6 * (i + 1)}%`, left: 0, right: 0 }} />
          ))}
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <Reveal>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-white/50 mb-8">
              <span className="w-8 h-px bg-white/30" />
              Every shipped change
            </span>
            <h1 className="text-6xl md:text-7xl lg:text-[110px] font-display tracking-tight leading-[0.9]">
              Change<span className="text-stroke">log.</span>
            </h1>
            <p className="mt-8 max-w-lg text-white/50 text-lg">
              What shipped, when, and why — kept here instead of buried in commit history.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative pb-32 lg:pb-40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-3 bottom-3 w-px bg-white/10 md:left-[139px]"
            />

            <div className="space-y-20 lg:space-y-28">
              {RELEASES.map((release, i) => {
                const meta = KIND_META[release.kind]
                const Icon = meta.icon
                const isLatest = i === 0

                return (
                  <Reveal key={release.version} delay={i * 80} className="relative grid gap-6 md:grid-cols-[140px_1fr]">
                    {/* Left rail — version + date, sticky */}
                    <div className="relative md:sticky md:top-28 md:self-start">
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 ${
                          isLatest ? "border-[#eca8d6] bg-[#eca8d6]" : "border-white/30 bg-black"
                        }`}
                      />
                      <div className="pl-6 md:pl-8">
                        {isLatest && (
                          <span className="mb-2 inline-block rounded-full bg-[#eca8d6] px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-black">
                            Latest
                          </span>
                        )}
                        <div className="font-display text-3xl tracking-tight">{release.version}</div>
                        <div className="mt-1 font-mono text-xs text-white/40">{formatDate(release.date)}</div>
                      </div>
                    </div>

                    {/* Right — content */}
                    <div className="pl-6 md:pl-0">
                      <div className="mb-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40">
                        <Icon className="h-3.5 w-3.5" />
                        {meta.label}
                      </div>
                      <h2 className="mb-8 font-display text-3xl tracking-tight lg:text-4xl">{release.title}</h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {release.highlights.map((h) => (
                          <div
                            key={h.title}
                            className="hover-lift rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25"
                          >
                            <h3 className="mb-1.5 text-sm font-medium text-white">{h.title}</h3>
                            <p className="text-sm leading-relaxed text-white/50">{h.body}</p>
                          </div>
                        ))}
                      </div>

                      <a
                        href={`${REPO_URL}/releases/tag/${release.tag}`}
                        target="_blank"
                        rel="noreferrer"
                        className="group mt-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
                      >
                        View diff &amp; assets on GitHub
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  )
}
