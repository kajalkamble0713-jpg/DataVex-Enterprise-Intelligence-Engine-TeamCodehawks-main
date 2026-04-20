"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowDown,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgentIcon } from "@/components/agent-icon"
import { GlassCard } from "@/components/glass-card"
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/page-transition"
import { agents } from "@/lib/mock-data"

const AgentNetworkCanvas = dynamic(
  () => import("@/components/3d/AgentNetworkCanvas").then((m) => m.AgentNetworkCanvas),
  { ssr: false }
)

function AgentFlowNode({
  agent,
  index,
  isActive,
}: {
  agent: (typeof agents)[0]
  index: number
  isActive: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={
            isActive
              ? {
                  boxShadow: [
                    `0 0 0 0 ${agent.color}00`,
                    `0 0 0 8px ${agent.color}20`,
                    `0 0 0 0 ${agent.color}00`,
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-xl"
        >
          <AgentIcon icon={agent.icon} color={agent.color} size="lg" />
        </motion.div>
        {index < agents.length - 1 && (
          <div className="my-2 h-8 w-px bg-border" />
        )}
      </div>
      <div className="flex-1 pb-4">
        <h3 className="mb-1 text-lg font-semibold text-foreground">
          {agent.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {agent.description}
        </p>
        {isActive && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="mt-3 h-1 rounded-full bg-gradient-to-r from-primary/60 to-primary/20"
          />
        )}
      </div>
    </motion.div>
  )
}

function RejectFirstVisual() {
  return (
    <FadeIn>
      <GlassCard hover={false} className="max-w-2xl mx-auto">
        <h3 className="mb-6 text-center text-xl font-bold text-foreground">
          Reject-First Decision Logic
        </h3>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 border border-warning/20">
              <XCircle className="h-8 w-8 text-warning" />
            </div>
            <span className="text-xs font-semibold text-warning">
              Risk Agent
            </span>
            <span className="text-xs text-muted-foreground">
              Argues Against
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
            <ArrowDown className="h-5 w-5 text-muted-foreground sm:hidden" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-chart-3/10 border border-chart-3/20">
              <AlertTriangle className="h-8 w-8 text-chart-3" />
            </div>
            <span className="text-xs font-semibold text-chart-3">
              Decision Arbiter
            </span>
            <span className="text-xs text-muted-foreground">
              Weighs Objections
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
            <ArrowDown className="h-5 w-5 text-muted-foreground sm:hidden" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 border border-success/20">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <span className="text-xs font-semibold text-success">
              Approved
            </span>
            <span className="text-xs text-muted-foreground">
              Only If Justified
            </span>
          </motion.div>
        </div>
      </GlassCard>
    </FadeIn>
  )
}

function DemoSimulation() {
  const [running, setRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const runDemo = () => {
    setRunning(true)
    setCurrentStep(0)
    agents.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i)
        if (i === agents.length - 1) {
          setTimeout(() => setRunning(false), 1500)
        }
      }, (i + 1) * 800)
    })
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-md text-center">
        <h3 className="mb-4 text-xl font-bold text-foreground">
          See It In Action
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Run a sample analysis and watch each agent activate in sequence.
        </p>
        <Button
          onClick={runDemo}
          disabled={running}
          className="group gap-2"
          size="lg"
        >
          <Play className="h-4 w-4" />
          {running ? "Running Analysis..." : "Run Sample Analysis"}
        </Button>

        <AnimatePresence>
          {currentStep >= 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              {agents.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  animate={
                    i <= currentStep
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0.3, scale: 0.8 }
                  }
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center gap-1"
                >
                  <AgentIcon
                    icon={agent.icon}
                    color={i <= currentStep ? agent.color : "#64748b"}
                    size="sm"
                    animate={false}
                  />
                  <span
                    className="text-[10px] font-medium transition-colors"
                    style={{
                      color: i <= currentStep ? agent.color : "#64748b",
                    }}
                  >
                    {i <= currentStep ? "Done" : "Pending"}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  )
}

export default function HowItWorksPage() {
  const [activeAgent, setActiveAgent] = useState(0)

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8">
        <FadeIn>
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How{" "}
              <span className="text-gradient">DataVex</span>{" "}
              Works
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Eight specialized AI agents work in concert to research, analyze,
              challenge, and ultimately decide whether a company is worth
              pursuing.
            </p>
          </div>
        </FadeIn>

        <section className="mb-20">
          <FadeIn>
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              The Agent Pipeline
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur">
              <AgentNetworkCanvas />
            </div>
          </FadeIn>
          <div className="mx-auto max-w-xl">
            {agents.map((agent, i) => (
              <div
                key={agent.name}
                onMouseEnter={() => setActiveAgent(i)}
              >
                <AgentFlowNode
                  agent={agent}
                  index={i}
                  isActive={activeAgent === i}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <FadeIn>
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              The Core Differentiator
            </h2>
          </FadeIn>
          <RejectFirstVisual />
        </section>

        <section className="mb-8">
          <DemoSimulation />
        </section>
      </div>
    </PageTransition>
  )
}
