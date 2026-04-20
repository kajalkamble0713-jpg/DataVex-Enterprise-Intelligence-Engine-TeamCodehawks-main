"use client"

import { Brain, Shield, MessageSquareText, Lightbulb } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { StaggerContainer, StaggerItem } from "@/components/page-transition"

const features = [
  {
    icon: Brain,
    title: "Multi-Agent Research",
    description:
      "Eight specialized AI agents collaboratively research, analyze, and assess every prospect from multiple angles.",
    color: "#6366f1",
  },
  {
    icon: Shield,
    title: "Reject-First Logic",
    description:
      "A dedicated Risk Agent actively argues against pursuing — ensuring only high-value leads pass through.",
    color: "#ef4444",
  },
  {
    icon: MessageSquareText,
    title: "Personalized Outreach",
    description:
      "AI-generated outreach messages tailored to each prospect's specific situation, signals, and pain points.",
    color: "#14b8a6",
  },
  {
    icon: Lightbulb,
    title: "Thought Leadership",
    description:
      "Bonus content ideas generated from each analysis to fuel your team's marketing and consulting positioning.",
    color: "#f59e0b",
  },
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <GlassCard className="flex h-full flex-col gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    border: `1px solid ${feature.color}30`,
                  }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
