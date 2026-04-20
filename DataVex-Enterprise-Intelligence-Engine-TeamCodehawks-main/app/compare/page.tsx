"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { ArrowLeftRight, Globe, Building2, Users, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GlassCard, GlassCardStrong } from "@/components/glass-card"
import { VerdictBadge } from "@/components/verdict-badge"
import { PageTransition, FadeIn } from "@/components/page-transition"
import { mockAnalyses, type Analysis } from "@/lib/mock-data"

function CompanyPanel({ analysis }: { analysis: Analysis | null }) {
  if (!analysis) {
    return (
      <GlassCard hover={false} className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Select a company</p>
      </GlassCard>
    )
  }

  return (
    <motion.div
      key={analysis.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard hover={false} className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {analysis.companyName}
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              {analysis.domain}
            </p>
          </div>
          <VerdictBadge verdict={analysis.verdict} size="sm" animate={false} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            {analysis.industry}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {analysis.employeeCount}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {analysis.location}
          </div>
          <div className="text-sm font-semibold text-primary">
            {analysis.confidenceScore}% confidence
          </div>
        </div>

        <div className="border-t border-border/50 pt-3">
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Key Signals
          </h4>
          <ul className="space-y-1.5">
            {analysis.signals.slice(0, 3).map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border/50 pt-3">
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Risk Factors
          </h4>
          <ul className="space-y-1.5">
            {analysis.riskFactors.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default function ComparePage() {
  const [companyA, setCompanyA] = useState<string>("")
  const [companyB, setCompanyB] = useState<string>("")

  const analysisA = useMemo(
    () => mockAnalyses.find((a) => a.id === companyA) || null,
    [companyA]
  )
  const analysisB = useMemo(
    () => mockAnalyses.find((a) => a.id === companyB) || null,
    [companyB]
  )

  const radarData = useMemo(() => {
    if (!analysisA && !analysisB) return []
    const metrics = [
      { key: "marketFit", label: "Market Fit" },
      { key: "financialHealth", label: "Financial Health" },
      { key: "techModernity", label: "Tech Modernity" },
      { key: "growthPotential", label: "Growth Potential" },
      { key: "competitivePosition", label: "Competitive Position" },
    ] as const
    return metrics.map((m) => ({
      metric: m.label,
      ...(analysisA ? { [analysisA.companyName]: analysisA.scores[m.key] } : {}),
      ...(analysisB ? { [analysisB.companyName]: analysisB.scores[m.key] } : {}),
    }))
  }, [analysisA, analysisB])

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FadeIn>
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <span className="text-gradient">Compare</span> Prospects
            </h1>
            <p className="text-lg text-muted-foreground">
              Side-by-side analysis of two companies.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Select value={companyA} onValueChange={setCompanyA}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select first company" />
              </SelectTrigger>
              <SelectContent>
                {mockAnalyses
                  .filter((a) => a.id !== companyB)
                  .map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.companyName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <ArrowLeftRight className="h-5 w-5 text-muted-foreground shrink-0" />

            <Select value={companyB} onValueChange={setCompanyB}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select second company" />
              </SelectTrigger>
              <SelectContent>
                {mockAnalyses
                  .filter((a) => a.id !== companyA)
                  .map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.companyName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <CompanyPanel analysis={analysisA} />
          <CompanyPanel analysis={analysisB} />
        </div>

        <AnimatePresence>
          {(analysisA || analysisB) && radarData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8"
            >
              <GlassCardStrong hover={false} className="mx-auto max-w-2xl">
                <h3 className="mb-4 text-center text-lg font-semibold text-foreground">
                  Score Comparison
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                    />
                    {analysisA && (
                      <Radar
                        name={analysisA.companyName}
                        dataKey={analysisA.companyName}
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    )}
                    {analysisB && (
                      <Radar
                        name={analysisB.companyName}
                        dataKey={analysisB.companyName}
                        stroke="var(--success)"
                        fill="var(--success)"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-2">
                  {analysisA && (
                    <span className="flex items-center gap-2 text-xs font-medium text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {analysisA.companyName}
                    </span>
                  )}
                  {analysisB && (
                    <span className="flex items-center gap-2 text-xs font-medium text-success">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {analysisB.companyName}
                    </span>
                  )}
                </div>
              </GlassCardStrong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
