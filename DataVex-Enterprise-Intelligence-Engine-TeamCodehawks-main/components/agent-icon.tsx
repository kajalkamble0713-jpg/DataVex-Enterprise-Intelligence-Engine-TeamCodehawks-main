"use client"

import { motion } from "framer-motion"
import {
  Search,
  TrendingUp,
  Cpu,
  DollarSign,
  Shield,
  Gavel,
  Mail,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  search: Search,
  "trending-up": TrendingUp,
  cpu: Cpu,
  "dollar-sign": DollarSign,
  shield: Shield,
  gavel: Gavel,
  mail: Mail,
  lightbulb: Lightbulb,
}

interface AgentIconProps {
  icon: string
  color?: string
  size?: "sm" | "md" | "lg"
  animate?: boolean
  className?: string
}

export function AgentIcon({
  icon,
  color = "#6366f1",
  size = "md",
  animate = true,
  className,
}: AgentIconProps) {
  const Icon = iconMap[icon] || Search
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  }
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  }

  return (
    <motion.div
      whileHover={animate ? { scale: 1.1, rotate: 5 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex items-center justify-center rounded-xl",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      <Icon className={iconSizes[size]} style={{ color }} />
    </motion.div>
  )
}
