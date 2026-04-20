"use client"

import { motion } from "framer-motion"

export function HeroGlobeCanvas() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 neural-grid opacity-20" />
      <div className="absolute inset-0 particle-field" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo/5 via-transparent to-background"
        animate={{
          opacity: [0.2, 0.4, 0.2],
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
