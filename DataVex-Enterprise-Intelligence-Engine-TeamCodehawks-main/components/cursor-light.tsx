"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function CursorLight() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', handleMouseEnter)
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', handleMouseEnter)
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-30">
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
          opacity: isHovering ? 0.6 : 0,
        }}
        transition={{
          type: "spring",
          bounce: 0.3,
          duration: 0.8,
        }}
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        animate={{
          x: mousePosition.x - 96,
          y: mousePosition.y - 96,
          opacity: isHovering ? 0.8 : 0,
        }}
        transition={{
          type: "spring",
          bounce: 0.3,
          duration: 0.6,
        }}
        style={{
          background: "radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  )
}
