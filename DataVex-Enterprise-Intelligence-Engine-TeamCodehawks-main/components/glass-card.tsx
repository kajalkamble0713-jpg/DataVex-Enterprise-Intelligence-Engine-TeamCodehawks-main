"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={cn(
        "glass rounded-xl p-6",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export function GlassCardStrong({
  children,
  className,
  hover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={cn(
        "glass-strong rounded-xl p-6",
        hover && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
