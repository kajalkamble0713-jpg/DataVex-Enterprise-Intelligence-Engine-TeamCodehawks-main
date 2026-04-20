"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle theme">
        <div className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 overflow-hidden"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div style={{ perspective: 200 }}>
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Moon className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Sun className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Button>
  )
}
