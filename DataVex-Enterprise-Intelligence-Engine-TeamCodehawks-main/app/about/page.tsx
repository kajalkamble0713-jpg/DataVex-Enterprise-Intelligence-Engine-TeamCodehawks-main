"use client"

import { Target, Eye, Zap, Users } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/page-transition"

const values = [
  {
    icon: Target,
    title: "Precision Over Volume",
    description:
      "We believe in pursuing fewer, better-qualified leads rather than spraying and praying. Every analysis is thorough, deliberate, and honest.",
    color: "#6366f1",
  },
  {
    icon: Eye,
    title: "Transparent Intelligence",
    description:
      "Every decision comes with a full reasoning trace. No black boxes. You see exactly why an AI agent reached its conclusion.",
    color: "#14b8a6",
  },
  {
    icon: Zap,
    title: "Speed With Depth",
    description:
      "What takes a research team days, our multi-agent system accomplishes in seconds — without sacrificing analytical rigor.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "Built for Teams",
    description:
      "Designed for enterprise sales, marketing, and consulting teams who need strategic intelligence, not just data.",
    color: "#8b5cf6",
  },
]

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <FadeIn>
          <div className="mb-20 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About{" "}
              <span className="text-gradient">DataVex</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Where strategy meets intelligence.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <GlassCard hover={false} className="mx-auto mb-20 max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Our Mission
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                DataVex was born from a simple frustration: sales teams waste
                enormous time researching companies that were never going to be
                a fit. Meanwhile, perfect prospects slip through the cracks
                because no one had time to dig deep enough.
              </p>
              <p>
                We built the Prospect Intelligence Engine to change that. Our
                multi-agent AI system doesn&apos;t just collect data &mdash; it
                thinks critically about every prospect, argues both sides, and
                delivers a clear, defensible recommendation.
              </p>
              <p>
                The result? Your team spends time on the companies that matter,
                armed with insights that would take a human analyst days to
                compile.
              </p>
            </div>
          </GlassCard>
        </FadeIn>

        <section className="mb-20">
          <FadeIn>
            <h2 className="mb-10 text-center text-3xl font-bold text-foreground">
              What We Believe
            </h2>
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <GlassCard className="flex h-full flex-col gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${value.color}15`,
                      border: `1px solid ${value.color}30`,
                    }}
                  >
                    <value.icon
                      className="h-6 w-6"
                      style={{ color: value.color }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        <FadeIn>
          <GlassCard hover={false} className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              The Technology
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              DataVex uses a proprietary multi-agent architecture where eight
              specialized AI agents collaborate, debate, and challenge each
              other&apos;s conclusions. This adversarial approach ensures that
              every recommendation is battle-tested before it reaches your team.
              Our reject-first logic means only truly viable prospects make it
              through.
            </p>
          </GlassCard>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
