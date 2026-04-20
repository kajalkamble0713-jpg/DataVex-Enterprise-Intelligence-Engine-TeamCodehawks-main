"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Target, BarChart3, Code2 } from "lucide-react"
import { GlassCard, GlassCardStrong } from "@/components/glass-card"
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/page-transition"
import {
  mockAnalyses,
  industryStats,
  verdictStats,
  technologyWeights,
} from "@/lib/mock-data"

const BarChart3DCanvas = dynamic(
  () => import("@/components/3d/BarChart3DCanvas").then((m) => m.BarChart3DCanvas),
  { ssr: false }
)

function AnimatedCounter({
  end,
  label,
  suffix = "",
  icon: Icon,
  color,
}: {
  end: number
  label: string
  suffix?: string
  icon: React.ElementType
  color: string
}) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    setHasAnimated(true)
    const duration = 1500
    const steps = 40
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
    return () => clearInterval(timer)
  }, [end, hasAnimated])

  return (
    <GlassCard hover={false} className="flex items-center gap-4">
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
        }}
      >
        <Icon className="h-6 w-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">
          {count}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </GlassCard>
  )
}

const PIE_COLORS = ["var(--success)", "var(--warning)", "var(--chart-3)"]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">{payload[0].value} analyses</p>
    </div>
  )
}

export default function InsightsPage() {
  const pursueRate = Math.round(
    (mockAnalyses.filter((a) => a.verdict === "pursue").length /
      mockAnalyses.length) *
      100
  )

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Aggregated{" "}
              <span className="text-gradient">Insights</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Intelligence patterns across all analyses.
            </p>
          </div>
        </FadeIn>

        {/* Animated counters */}
        <StaggerContainer className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <AnimatedCounter
              end={mockAnalyses.length}
              label="Total Analyses"
              icon={BarChart3}
              color="#6366f1"
            />
          </StaggerItem>
          <StaggerItem>
            <AnimatedCounter
              end={pursueRate}
              suffix="%"
              label="Pursue Rate"
              icon={Target}
              color="#14b8a6"
            />
          </StaggerItem>
          <StaggerItem>
            <AnimatedCounter
              end={mockAnalyses.filter((a) => a.verdict === "pursue").length}
              label="Recommended"
              icon={TrendingUp}
              color="#10b981"
            />
          </StaggerItem>
          <StaggerItem>
            <AnimatedCounter
              end={technologyWeights.length}
              label="Technologies Tracked"
              icon={Code2}
              color="#f59e0b"
            />
          </StaggerItem>
        </StaggerContainer>

        {/* 3D Bar chart - Industry */}
        <FadeIn delay={0.05}>
          <GlassCardStrong hover={false} className="mb-12">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Analyses by Industry (3D)
            </h3>
            <BarChart3DCanvas
              data={industryStats.map((d) => ({
                name: d.name,
                value: d.count,
                color: "#6366f1",
              }))}
            />
          </GlassCardStrong>
        </FadeIn>

        {/* Charts row */}
        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <GlassCardStrong hover={false} className="h-full">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Analyses by Industry
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={industryStats} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="var(--primary)"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </GlassCardStrong>
          </FadeIn>

          <FadeIn delay={0.2}>
            <GlassCardStrong hover={false} className="h-full">
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Verdict Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={verdictStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {verdictStats.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0].payload
                      return (
                        <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-lg">
                          <p className="font-semibold text-foreground">
                            {d.name}
                          </p>
                          <p className="text-muted-foreground">
                            {d.value} analyses
                          </p>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6">
                {verdictStats.map((v, i) => (
                  <span
                    key={v.name}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[i] }}
                    />
                    {v.name} ({v.value})
                  </span>
                ))}
              </div>
            </GlassCardStrong>
          </FadeIn>
        </div>

        {/* Technology cloud */}
        <FadeIn delay={0.3}>
          <GlassCardStrong hover={false}>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Technology Landscape
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {technologyWeights.map((tech, i) => (
                <motion.span
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5 font-mono text-foreground"
                  style={{
                    fontSize: `${Math.max(11, tech.weight * 3.5)}px`,
                    opacity: 0.4 + tech.weight * 0.12,
                  }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </GlassCardStrong>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
