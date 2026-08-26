import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { DocContent } from "@/components/docs/doc-content"
import { DocsToc } from "@/components/docs/docs-toc"
import { Reveal } from "@/components/reveal"
import { getAllDocSlugs, getDocSource, extractHeadings } from "@/lib/docs-content"
import { findDocPage, getAdjacentPages } from "@/lib/docs-nav"

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug: slug.split("/") }))
}

function slugFromParams(slugParts: string[]): string {
  return slugParts.join("/")
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug: slugParts } = await params
  const slug = slugFromParams(slugParts)
  const page = findDocPage(slug)
  if (!page) return {}
  return {
    title: `${page.title} — Wizard Docs`,
  }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params
  const slug = slugFromParams(slugParts)
  const page = findDocPage(slug)
  if (!page) notFound()

  const { body } = getDocSource(slug)
  const headings = extractHeadings(body)
  const { prev, next } = getAdjacentPages(slug)

  return (
    <div className="flex gap-10">
      <article className="min-w-0 max-w-3xl flex-1">
        <Reveal key={slug}>
          <DocContent markdown={body} />
        </Reveal>

        <Reveal delay={150} className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-8">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group flex items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground"
            >
              {next.title}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </Reveal>
      </article>

      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-24">
          <DocsToc headings={headings} />
        </div>
      </aside>
    </div>
  )
}
