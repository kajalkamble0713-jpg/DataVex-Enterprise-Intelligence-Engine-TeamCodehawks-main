"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useShow3DHero } from "@/hooks/use-webgl"

const HeroGlobeCanvas = dynamic(
  () => import("@/components/3d/HeroGlobeCanvas").then((m) => m.HeroGlobeCanvas),
  { ssr: false }
)

// Temporarily disabled to prevent client-side errors
const DisabledHeroGlobeCanvas = () => null

const headlines = [
  "Turn companies into opportunities.",
  "Turn data into decisions.",
  "Turn insights into action.",
]

function ParticleField() {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number; type: 'indigo' | 'teal' | 'coral' }>
  >([])

  useEffect(() => {
    setMounted(true)
    const generated = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 6,
      type: ['indigo', 'teal', 'coral'][Math.floor(Math.random() * 3)] as 'indigo' | 'teal' | 'coral'
    }))
    setParticles(generated)
  }, [])

  if (!mounted) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 particle-field" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 neural-grid opacity-30" />
      <div className="absolute inset-0 particle-field" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${
            p.type === 'indigo' ? 'bg-indigo/20' : 
            p.type === 'teal' ? 'bg-teal/20' : 
            'bg-coral/20'
          }`}
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo/10 via-transparent to-background"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

export function AnimatedHero() {
  const router = useRouter()
  const show3D = useShow3DHero()
  const [mounted, setMounted] = useState(false)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [domain, setDomain] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [mounted])

  const handleAnalyze = useCallback(() => {
    if (domain.trim()) {
      router.push(`/results/${encodeURIComponent(domain.trim())}`)
    }
  }, [domain, router])

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 overflow-hidden">
      {show3D ? (
        <HeroGlobeCanvas />
      ) : (
        <ParticleField />
      )}

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex items-center gap-3 rounded-full border border-indigo/30 bg-indigo/5 px-6 py-3 glass-morphism"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="h-4 w-4 text-indigo" />
          </motion.div>
          <span className="text-sm font-medium text-gradient-cyber">
            Multi-Agent AI Intelligence
          </span>
        </motion.div>

        <div className="mb-8 h-[5rem] sm:h-[6rem] md:h-[7rem] flex items-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={headlineIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl text-foreground"
            >
              <span className="text-gradient-cyber">{headlines[headlineIndex]}</span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Our multi-agent AI researches any company and tells you if
          they&apos;re worth pursuing &mdash; and why.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAnalyze()
            }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter company domain..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`h-14 premium-card pr-4 pl-4 text-base transition-all duration-300 ${
                  isFocused
                    ? "glow-indigo scale-[1.02]"
                    : ""
                }`}
                aria-label="Company domain to analyze"
              />
              {isFocused && (
                <motion.div
                  layoutId="focus-ring"
                  className="absolute inset-0 rounded-lg border-2 border-indigo/50 glow-indigo"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="group h-14 gap-3 px-8 text-base font-semibold magnetic-button premium-card"
              disabled={!domain.trim()}
            >
              <span className="relative z-10">Analyze</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo to-teal opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              />
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid grid-cols-3 gap-8 text-center"
        >
          {[
            { value: "10M+", label: "Companies Analyzed" },
            { value: "99.8%", label: "Accuracy Rate" },
            { value: "2.3s", label: "Avg. Analysis Time" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + index * 0.1, duration: 0.6 }}
              className="glass-morphism rounded-lg p-4"
            >
              <div className="text-2xl font-bold text-gradient-cyber">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
          <motion.div 
            className="h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-indigo to-transparent"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
