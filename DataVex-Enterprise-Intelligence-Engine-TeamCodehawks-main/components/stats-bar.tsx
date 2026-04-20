"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/page-transition"

const stats = [
  { value: 12, suffix: "+", label: "Companies Analyzed" },
  { value: 8, suffix: "", label: "AI Agents" },
  { value: 94, suffix: "%", label: "Confidence Rate" },
  { value: 3, suffix: "s", label: "Avg. Analysis Time" },
]

function Counter({
  end,
  suffix,
  label,
}: {
  end: number
  suffix: string
  label: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1200
          const steps = 30
          const increment = end / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {count}
        {suffix}
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function StatsBar() {
  return (
    <section className="border-y border-border/50 bg-muted/30 px-4 py-16 lg:px-8">
      <FadeIn>
        <motion.div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <Counter
              key={stat.label}
              end={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>
      </FadeIn>
    </section>
  )
}
