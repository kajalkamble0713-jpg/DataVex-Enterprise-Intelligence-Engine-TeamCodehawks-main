"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Ring } from "@react-three/drei"
import * as THREE from "three"

type Verdict = "pursue" | "reject" | "review"

const colors: Record<Verdict, string> = {
  pursue: "#14b8a6",
  reject: "#f87171",
  review: "#fbbf24",
}

export function Verdict3DBadge({ verdict }: { verdict: Verdict }) {
  const groupRef = useRef<THREE.Group>(null)
  const color = colors[verdict]
  const label = verdict === "pursue" ? "PURSUE" : verdict === "reject" ? "IGNORE" : "REVIEW"

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Ring args={[0.6, 0.75, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </Ring>
      <Html
        center
        position={[0, 0.05, 0]}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "18px",
          fontWeight: 700,
          color,
          textShadow: "0 0 20px currentColor",
          pointerEvents: "none",
        }}
      >
        {label}
      </Html>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
