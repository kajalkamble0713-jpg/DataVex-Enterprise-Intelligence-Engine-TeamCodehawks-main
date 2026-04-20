"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { AgentIcon } from "@/components/agent-icon"
import { FadeIn } from "@/components/page-transition"
import { agents } from "@/lib/mock-data"

export function HowItWorksTeaser() {
  return (
    <section className="px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
            Powered by{" "}
            <span className="text-gradient">eight intelligent agents</span>
          </h2>
          <p className="mb-12 text-muted-foreground">
            Each agent brings a unique perspective to every analysis, creating a
            comprehensive intelligence picture.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center gap-2"
              >
                <AgentIcon
                  icon={agent.icon}
                  color={agent.color}
                  size="md"
                />
                <span className="text-xs font-medium text-muted-foreground">
                  {agent.name}
                </span>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Link
            href="/how-it-works"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Explore the agent minds
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
