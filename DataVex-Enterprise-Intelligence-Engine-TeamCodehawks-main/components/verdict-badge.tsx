"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const verdictConfig = {
  pursue: {
    label: "Pursue",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  reject: {
    label: "Reject",
    icon: XCircle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  review: {
    label: "Review",
    icon: AlertCircle,
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
}

interface VerdictBadgeProps {
  verdict: "pursue" | "reject" | "review"
  size?: "sm" | "md" | "lg"
  animate?: boolean
}

export function VerdictBadge({
  verdict,
  size = "md",
  animate = true,
}: VerdictBadgeProps) {
  const config = verdictConfig[verdict]
  const Icon = config.icon
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  }
  const iconSizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }

  const Wrapper = animate ? motion.span : "span"
  const animationProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 } as const,
        animate: { scale: 1, opacity: 1 } as const,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {}

  return (
    <Wrapper
      {...animationProps}
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        sizeClasses[size],
        config.className
      )}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </Wrapper>
  )
}
