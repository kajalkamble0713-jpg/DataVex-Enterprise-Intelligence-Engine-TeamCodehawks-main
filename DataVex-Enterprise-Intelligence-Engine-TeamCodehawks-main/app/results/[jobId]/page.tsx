"use client"

import { useState, useEffect, use } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Globe,
  Building2,
  Users,
  MapPin,
  DollarSign,
  Sparkles,
  Plus,
} from "lucide-react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { GlassCard, GlassCardStrong } from "@/components/glass-card"
import { VerdictBadge } from "@/components/verdict-badge"
import { AgentIcon } from "@/components/agent-icon"
import { CopyButton } from "@/components/copy-button"
import { PageTransition, FadeIn } from "@/components/page-transition"
import {
  getAnalysis,
  getAnalysisByDomain,
  simulateAnalysis,
  agents as agentList
} from "@/lib/mock-data"
import type { Analysis, AgentStep } from "@/lib/mock-data"
import { analyzeViaBackend, type BackendAnalysis } from "@/lib/api"

import { StockChart } from "@/components/stock-chart"
import { SolutionMatchmaker } from "@/components/solution-matchmaker"
import { UrgencyBanner } from "@/components/urgency-banner"
import { DecisionBreakdown } from "@/components/decision-breakdown"

const Verdict3DCanvas = dynamic(
  () => import("@/components/3d/Verdict3DCanvas").then((m) => m.Verdict3DCanvas),
  { ssr: false }
)
const TraceTimeline3DCanvas = dynamic(
  () => import("@/components/3d/TraceTimeline3DCanvas").then((m) => m.TraceTimeline3DCanvas),
  { ssr: false }
)

// Loading state component
function AnalysisLoader() {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const steps = agentList.map((a) => `${a.name} analyzing...`)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % steps.length)
    }, 1200)
    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 95))
    }, 150)
    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
    }
  }, [steps.length])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Sparkles className="h-12 w-12 text-primary" />
      </motion.div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Analyzing Prospect
      </h2>
      <div className="mb-4 w-full max-w-sm">
        <Progress value={progress} className="h-2" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm text-muted-foreground"
        >
          {steps[step]}
        </motion.p>
      </AnimatePresence>
      <div className="mt-8 flex items-center gap-2">
        {agentList.map((agent, i) => (
          <motion.div
            key={agent.name}
            animate={
              i <= step
                ? { opacity: 1, scale: 1 }
                : { opacity: 0.3, scale: 0.8 }
            }
            transition={{ duration: 0.3 }}
          >
            <AgentIcon
              icon={agent.icon}
              color={i <= step ? agent.color : "#64748b"}
              size="sm"
              animate={false}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Typewriter text
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      i++
      if (i <= text.length) {
        setDisplayed(text.slice(0, i))
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, 12)
    return () => clearInterval(timer)
  }, [text])

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground font-mono">
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
        />
      )}
    </p>
  )
}

// Agent timeline
function AgentTimeline({ trace }: { trace: AgentStep[] }) {
  return (
    <div className="space-y-4">
      {trace.map((step, i) => {
        const agent = agentList.find((a) => a.name === step.agent)
        return (
          <motion.div
            key={step.agent}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex items-start gap-4"
          >
            <div className="flex flex-col items-center">
              <AgentIcon
                icon={step.icon}
                color={agent?.color || "#6366f1"}
                size="md"
                animate={false}
              />
              {i < trace.length - 1 && (
                <div className="my-1 h-6 w-px bg-border" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-foreground">
                  {step.agent}
                </h4>
                <span className="text-xs text-muted-foreground">
                  {step.duration}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.summary}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Dossier tab
function DossierTab({ analysis }: { analysis: Analysis }) {
  const radarData = [
    { metric: "Market Fit", value: analysis.scores.marketFit },
    { metric: "Financial Health", value: analysis.scores.financialHealth },
    { metric: "Tech Modernity", value: analysis.scores.techModernity },
    { metric: "Growth Potential", value: analysis.scores.growthPotential },
    { metric: "Competitive Position", value: analysis.scores.competitivePosition },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard hover={false}>
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Company Profile
          </h3>
          <div className="space-y-3">
            {[
              { icon: Globe, label: "Domain", value: analysis.domain },
              { icon: Building2, label: "Industry", value: analysis.industry },
              { icon: Users, label: "Employees", value: analysis.employeeCount },
              { icon: DollarSign, label: "Revenue", value: analysis.revenue },
              { icon: MapPin, label: "Location", value: analysis.location },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {item.label}:
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border/50 pt-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border/50 bg-muted/50 px-2 py-0.5 font-mono text-xs text-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        <div className="flex flex-col gap-6">
          <GlassCard hover={false}>
            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Score Radar
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                />
                <Radar
                  dataKey="value"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard hover={false}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Key Signals
            </h4>
            <ul className="space-y-2">
              {analysis.signals.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      {/* Stock Chart - Full Width */}
      {analysis.stockData && (
        <StockChart stockData={analysis.stockData} />
      )}
    </div>
  )
}

// Map backend API response to the Analysis interface used by all UI components
function mapBackendToAnalysis(b: BackendAnalysis): Analysis {
  const d = (b.dossier ?? {}) as Record<string, unknown>
  const arbiter = (() => {
    try {
      // decisionReasoning may contain JSON with extra fields
      if (typeof b.decisionReasoning === "string" && b.decisionReasoning.startsWith("{")) {
        return JSON.parse(b.decisionReasoning) as Record<string, unknown>
      }
    } catch { /* ignore */ }
    return {} as Record<string, unknown>
  })()

  const toStrArr = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String)
    return []
  }

  const verdictMap: Record<string, Analysis["verdict"]> = {
    PURSUE: "pursue",
    IGNORE: "reject",
  }

  return {
    id: b.jobId,
    domain: b.domain,
    companyName: (d.name as string) || b.domain.split(".")[0]?.replace(/^\w/, c => c.toUpperCase()) || b.domain,
    date: b.createdAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    verdict: verdictMap[b.verdict ?? ""] ?? "review",
    confidenceScore: typeof b.confidenceScore === "number" ? b.confidenceScore : 75,
    industry: (d.industry as string) || "General",
    employeeCount: (d.employeeCount as string) || "Unknown",
    revenue: (d.revenue as string) || "Undisclosed",
    location: (d.location as string) || "Unknown",
    summary: (b.decisionReasoning ?? (d.description as string)) || "Analysis completed via AI agent pipeline.",
    technologies: toStrArr(d.technologies),
    signals: toStrArr(arbiter.signals).length > 0 ? toStrArr(arbiter.signals) : toStrArr(d.recentDevelopments),
    riskFactors: toStrArr(arbiter.riskFactors),
    outreachMessage: b.outreachMessage ?? "",
    bonusContent: typeof b.bonusContent === "object" && b.bonusContent
      ? (b.bonusContent as Record<string, unknown>).content as string ?? JSON.stringify(b.bonusContent)
      : "",
    stockData: b.stockData ? {
      ticker: b.stockData.ticker,
      latestClose: b.stockData.latestClose,
      change1Week: b.stockData.change1Week,
      change1Month: b.stockData.change1Month,
      change1Year: b.stockData.change1Year,
      trend: b.stockData.trend,
      urgencySignal: b.stockData.urgencySignal
    } : undefined,
    recommendedSolution: b.recommendedSolution,
    urgencyFactor: b.urgencyFactor,
    decisionFactors: b.decisionFactors,
    decisionScore: b.decisionScore,
    marketAnalysis: b.marketAnalysis ? {
      growthSignals: Array.isArray((b.marketAnalysis as any).growthSignals) 
        ? (b.marketAnalysis as any).growthSignals 
        : [],
      risks: Array.isArray((b.marketAnalysis as any).risks) 
        ? (b.marketAnalysis as any).risks 
        : []
    } : undefined,
    dossier: typeof d === "object" ? {
      name: d.name as string,
      employeeCount: d.employeeCount as string,
      revenue: d.revenue as string,
      industry: d.industry as string,
      recentDevelopments: Array.isArray(d.recentDevelopments) ? d.recentDevelopments as string[] : []
    } : undefined,
    agentTrace: (b.trace ?? []).map((t: Record<string, unknown>) => ({
      agent: (t.agent as string) || "Agent",
      status: (t.status as AgentStep["status"]) || "complete",
      summary: (t.output as string)?.substring(0, 150) + (((t.output as string)?.length || 0) > 150 ? "..." : "") || "Analysis completed",
      duration: (t.duration as string) || "0.00s",
      icon: (t.icon as string) || "cpu",
    })),
    scores: {
      marketFit: 70,
      financialHealth: 70,
      techModernity: 70,
      growthPotential: 70,
      competitivePosition: 70,
    },
  }
}

// Main results page
export default function ResultsPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const { jobId } = use(params)
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const decoded = decodeURIComponent(jobId)

      // 1. Check mock data first (instant for known IDs / domains)
      const foundById = getAnalysis(decoded)
      if (foundById) {
        if (isMounted) setAnalysis(foundById)
        if (isMounted) setLoading(false)
        return
      }

      const foundByDomain = getAnalysisByDomain(decoded)
      if (foundByDomain) {
        if (isMounted) setAnalysis(foundByDomain)
        if (isMounted) setLoading(false)
        return
      }

      // 2. Try real backend API
      try {
        const backendResult = await analyzeViaBackend(decoded)
        if (backendResult && isMounted) {
          const mapped = mapBackendToAnalysis(backendResult)
          setAnalysis(mapped)
          setLoading(false)
          return
        }
      } catch {
        // Backend unavailable — fall through to mock
      }

      // 3. Fallback: generate mock analysis
      const generated = await simulateAnalysis(decoded)
      if (isMounted) {
        setAnalysis(generated)
        setLoading(false)
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [jobId])

  if (loading) {
    return (
      <PageTransition>
        <AnalysisLoader />
      </PageTransition>
    )
  }

  if (!analysis) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            Analysis Not Found
          </h2>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header */}
        <FadeIn>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <Link href="/past-analyses">
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Back to analyses">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  {analysis.companyName}
                </h1>
                <VerdictBadge verdict={analysis.verdict} size="lg" />
              </div>
              <p className="ml-11 text-sm text-muted-foreground">
                {analysis.domain} &middot;{" "}
                {new Date(analysis.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </FadeIn>

        {/* Summary */}
        <FadeIn delay={0.1}>
          <GlassCardStrong hover={false} className="mb-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {analysis.summary}
            </p>
          </GlassCardStrong>
        </FadeIn>

        {/* Solution Matchmaker & Urgency Indicator - Only for PURSUE verdicts */}
        {analysis.verdict === "pursue" && (
          <>
            {analysis.urgencyFactor && (
              <FadeIn delay={0.15}>
                <div className="mb-6">
                  <UrgencyBanner urgencyFactor={analysis.urgencyFactor} />
                </div>
              </FadeIn>
            )}
            
            {analysis.recommendedSolution && (
              <FadeIn delay={0.2}>
                <div className="mb-8">
                  <SolutionMatchmaker solution={analysis.recommendedSolution} />
                </div>
              </FadeIn>
            )}
          </>
        )}

        {/* Tabs */}
        <FadeIn delay={0.25}>
          <Tabs defaultValue="dossier" className="w-full">
            <TabsList className="mb-6 w-full justify-start bg-muted/50 h-auto flex-wrap">
              {["dossier", "verdict", "outreach", "bonus", "trace"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="capitalize data-[state=active]:bg-background"
                  >
                    {tab}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <TabsContent value="dossier">
              <motion.div
                key="tab-dossier"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DossierTab analysis={analysis} />
              </motion.div>
            </TabsContent>

            <TabsContent value="verdict">
              <motion.div
                key="tab-verdict"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <GlassCard hover={false}>
                  <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="flex-shrink-0">
                      <Verdict3DCanvas verdict={analysis.verdict} />
                    </div>
                    <div className="flex items-center gap-4 sm:flex-1">
                      <VerdictBadge
                        verdict={analysis.verdict}
                        size="lg"
                      />
                      <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {analysis.verdict === "pursue"
                          ? "Recommended for Pursuit"
                          : analysis.verdict === "reject"
                          ? "Not Recommended"
                          : "Further Review Needed"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {analysis.confidenceScore}% confidence score
                      </p>
                    </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                      Supporting Signals
                    </h4>
                    <ul className="space-y-2">
                      {analysis.signals.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                      Risk Factors
                    </h4>
                    <ul className="space-y-2">
                      {analysis.riskFactors.map((r, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassCard>

                {/* Comprehensive Decision Breakdown */}
                {analysis.decisionFactors && analysis.decisionScore !== undefined && (
                  <DecisionBreakdown
                    verdict={analysis.verdict}
                    score={analysis.decisionScore}
                    factors={analysis.decisionFactors}
                    dossier={analysis.dossier}
                    marketAnalysis={analysis.marketAnalysis}
                    stockData={analysis.stockData}
                  />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="outreach">
              <motion.div
                key="tab-outreach"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Generated Outreach
                    </h3>
                    <CopyButton text={analysis.outreachMessage} />
                  </div>
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                    <TypewriterText text={analysis.outreachMessage} />
                  </div>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="bonus">
              <motion.div
                key="tab-bonus"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Thought Leadership Content
                    </h3>
                    <CopyButton text={analysis.bonusContent} />
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/30 p-4">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        duration: 2,
                        repeat: 2,
                        ease: "easeInOut",
                      }}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
                    />
                    <p className="relative whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {analysis.bonusContent}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </TabsContent>

            <TabsContent value="trace">
              <motion.div
                key="tab-trace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false} className="mb-6">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Agent Reasoning Trace
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                    <TraceTimeline3DCanvas trace={analysis.agentTrace} />
                  </div>
                </GlassCard>
                <GlassCard hover={false}>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Step Details
                  </h3>
                  <AgentTimeline trace={analysis.agentTrace} />
                </GlassCard>
              </motion.div>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
