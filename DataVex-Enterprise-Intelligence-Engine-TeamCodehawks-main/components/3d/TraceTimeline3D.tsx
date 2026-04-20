"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import * as THREE from "three"

export type TraceStep = {
  agent: string
  summary: string
  duration: string
  color?: string
}

const DEFAULT_COLOR = "#6366f1"

export function TraceTimeline3D({
  steps,
  activeIndex,
}: {
  steps: TraceStep[]
  activeIndex: number
}) {
  return (
    <group position={[0, 0, 0]}>
      {steps.map((step, i) => (
        <TraceCube
          key={step.agent}
          step={step}
          index={i}
          total={steps.length}
          isActive={i <= activeIndex}
        />
      ))}
    </group>
  )
}

function TraceCube({
  step,
  index,
  total,
  isActive,
}: {
  step: TraceStep
  index: number
  total: number
  isActive: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const y = (index / (total - 1 || 1)) * 2.4 - 1.2
  const color = step.color ?? DEFAULT_COLOR

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isActive ? 1.1 : 0.85
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      )
    }
  })

  return (
    <group position={[0, y, 0]}>
      <Box ref={meshRef} args={[0.25, 0.25, 0.25]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          metalness={0.3}
          roughness={0.6}
        />
      </Box>
    </group>
  )
}
