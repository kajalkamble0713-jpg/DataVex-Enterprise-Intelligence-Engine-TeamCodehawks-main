"use client"

import { useState, useEffect } from "react"

/**
 * Detects if WebGL is available and optionally if we should prefer reduced motion.
 * Use to show fallback UI (gradient / flat) on low-power or unsupported devices.
 */
export function useWebGL(): { supported: boolean; preferReducedMotion: boolean } {
  const [mounted, setMounted] = useState(false)
  const [supported, setSupported] = useState(false)
  const [preferReducedMotion, setPreferReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const canvas = document.createElement("canvas")
      const gl =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl")
      setSupported(!!gl)
    } catch {
      setSupported(false)
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPreferReducedMotion(mq.matches)
    const handler = () => setPreferReducedMotion(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  if (!mounted) {
    return { supported: false, preferReducedMotion: false }
  }

  return { supported, preferReducedMotion }
}

/**
 * Whether to show 3D hero (globe). False on small screens or reduced motion so we can fall back to gradient.
 */
export function useShow3DHero(): boolean {
  const { supported, preferReducedMotion } = useWebGL()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" &&
          (window.innerWidth < 768 || "ontouchstart" in window)
      )
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  if (!mounted) {
    return false
  }

  return supported && !preferReducedMotion && !isMobile
}
