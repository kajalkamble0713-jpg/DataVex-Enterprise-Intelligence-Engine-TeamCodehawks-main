"use client"

import { Zap, Clock, AlertTriangle, TrendingUp } from "lucide-react"
import { GlassCard } from "./glass-card"
import { motion } from "framer-motion"

interface UrgencyBannerProps {
  urgencyFactor: string
}

export function UrgencyBanner({ urgencyFactor }: UrgencyBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <GlassCard 
        hover={false} 
        className="border-2 border-warning/50 bg-gradient-to-r from-warning/15 via-warning/10 to-warning/5 relative overflow-hidden"
      >
        {/* Animated pulse effect */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-warning/20 to-transparent"
        />

        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Animated icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5
              }}
              className="flex-shrink-0"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-warning via-warning/80 to-warning/60 shadow-lg shadow-warning/40">
                <Zap className="h-8 w-8 text-white" fill="currentColor" />
              </div>
            </motion.div>

            <div className="flex-1 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-warning animate-pulse" />
                  <h3 className="text-xs font-bold text-warning uppercase tracking-wider">
                    ⚡ URGENT OPPORTUNITY
                  </h3>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Why Act Now
                </h2>
                <div className="h-1 w-32 bg-gradient-to-r from-warning to-transparent rounded-full" />
              </div>

              {/* Urgency message */}
              <div className="p-4 rounded-lg bg-background/60 border-l-4 border-warning">
                <p className="text-sm leading-relaxed text-foreground font-semibold">
                  {urgencyFactor}
                </p>
              </div>

              {/* Priority indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-muted-foreground font-medium">Time Sensitivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-warning" />
                    <span className="text-warning font-bold">HIGH PRIORITY</span>
                  </div>
                </div>
                
                <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-warning via-warning/80 to-warning/60 relative"
                  >
                    <motion.div
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Action prompt */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 pt-2 text-sm"
              >
                <div className="flex-1 h-px bg-gradient-to-r from-warning/50 to-transparent" />
                <span className="text-warning font-semibold">Contact immediately for best results</span>
                <div className="flex-1 h-px bg-gradient-to-l from-warning/50 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
