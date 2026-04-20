"use client"

import { Target, CheckCircle2, Sparkles, ArrowRight } from "lucide-react"
import { GlassCard } from "./glass-card"
import { motion } from "framer-motion"

interface SolutionMatchmakerProps {
  solution: {
    name: string
    reason: string
    features: string[]
  }
}

export function SolutionMatchmaker({ solution }: SolutionMatchmakerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <GlassCard 
        hover={false} 
        className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden"
      >
        {/* Animated background gradient */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50"
          style={{ backgroundSize: "200% 200%" }}
        />

        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg shadow-primary/30">
                <Target className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                  🎯 AI-Recommended Solution
                </h3>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {solution.name}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full" />
            </div>
          </div>

          {/* Reason */}
          <div className="mb-6 p-4 rounded-lg bg-background/50 border border-primary/20">
            <p className="text-sm leading-relaxed text-foreground font-medium">
              {solution.reason}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Key Capabilities
              </h4>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
            </div>
            
            <div className="grid gap-3">
              {solution.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-success/10 to-transparent border border-success/20 hover:border-success/40 transition-colors"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                  <span className="text-sm text-foreground font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-primary/20"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Perfect fit for this prospect</span>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <span>Learn More</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
