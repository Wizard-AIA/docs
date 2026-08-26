import type { ReactNode } from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { CopyCommand } from "@/components/copy-command"
import { slugifyHeading } from "@/lib/docs-content"

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textContent).join("")
  if (node && typeof node === "object" && "props" in node) {
    return textContent((node as { props: { children?: ReactNode } }).props.children)
  }
  return ""
}

function heading(level: 2 | 3) {
  const Tag = level === 2 ? "h2" : "h3"
  const className =
    level === 2
      ? "mt-12 mb-4 scroll-mt-24 font-display text-2xl tracking-tight text-foreground first:mt-0"
      : "mt-8 mb-3 scroll-mt-24 text-lg font-medium text-foreground"
  return function DocHeading({ children }: { children?: ReactNode }) {
    const id = slugifyHeading(textContent(children))
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }
}

export function DocContent({ markdown }: { markdown: string }) {
  return (
    <div className="text-[15px] leading-relaxed text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 font-display text-4xl tracking-tight text-foreground">{children}</h1>
          ),
          h2: heading(2),
          h3: heading(3),
          p: ({ children }) => <p className="mb-4 text-foreground/80">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-foreground/80">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-foreground/80">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          hr: () => <hr className="my-10 border-border" />,
          a: ({ href, children }) => {
            const isExternal = /^https?:\/\//.test(href ?? "")
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  {children}
                </a>
              )
            }
            return (
              <Link
                href={href ?? "#"}
                className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
              >
                {children}
              </Link>
            )
          },
          table: ({ children }) => (
            <div className="mb-6 overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b border-border bg-muted/40">{children}</thead>,
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-medium text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-border px-4 py-2.5 align-top text-foreground/80">{children}</td>
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className ?? "")
            const raw = String(children).replace(/\n$/, "")

            if (!match) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
                  {children}
                </code>
              )
            }

            return <CopyCommand lines={raw.split("\n")} />
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
