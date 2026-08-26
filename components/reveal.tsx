"use client"

import type { ElementType, ReactNode } from "react"
import { useInView } from "@/hooks/use-in-view"

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  y = 20,
  id,
}: {
  children: ReactNode
  delay?: number
  as?: ElementType
  className?: string
  y?: number
  id?: string
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref}
      id={id}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0"
      } ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transform: isVisible ? undefined : `translateY(${y}px)`,
      }}
    >
      {children}
    </Tag>
  )
}
