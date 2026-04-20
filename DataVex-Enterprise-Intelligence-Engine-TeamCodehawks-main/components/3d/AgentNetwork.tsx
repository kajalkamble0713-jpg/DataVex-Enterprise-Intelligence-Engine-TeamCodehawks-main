"use client"

import { useRef, useState, useMemo } from "react"

export type AgentNode = {
  name: string
  description: string
  color: string
}

const DEFAULT_AGENTS: AgentNode[] = [
  { name: "Researcher", description: "Gathers company profile and news.", color: "#6366f1" },
  { name: "Market Analyst", description: "Evaluates market positioning.", color: "#14b8a6" },
  { name: "Tech Debt", description: "Assesses tech stack.", color: "#f59e0b" },
  { name: "Financial", description: "Analyzes financial health.", color: "#10b981" },
  { name: "Risk", description: "Argues against pursuit.", color: "#ef4444" },
  { name: "Arbiter", description: "Makes final decision.", color: "#8b5cf6" },
  { name: "Outreach", description: "Crafts messages.", color: "#06b6d4" },
  { name: "Bonus", description: "Thought leadership.", color: "#f97316" },
]

function placeNodes(count: number): any[] {
  const radius = 2.2
  const positions: any[] = []
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2 - Math.PI / 2
    const y = (i / count) * 2.4 - 1.2
    const r = radius * Math.sqrt(1 - (y / 1.2) ** 2)
    positions.push({
      x: Math.cos(theta) * r,
      y,
      z: Math.sin(theta) * r,
    })
  }
  return positions
}

function AgentNodeSphere({
  position,
  color,
  isActive,
  pulse,
}: {
  position: [number, number, number]
  color: string
  isActive: boolean
  pulse: number
}) {
  const { useFrame } = require("@react-three/fiber")
  const { Sphere } = require("@react-three/drei")
  const THREE = require("three")
  
  const meshRef = useRef<any>(null)
  useFrame(() => {
    if (meshRef.current && isActive) {
      meshRef.current.scale.setScalar(1 + pulse * 0.15)
    }
  })

  return (
    <Sphere ref={meshRef} args={[0.18, 16, 16]} position={position}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isActive ? 0.6 : 0.2}
        transparent
        opacity={0.95}
      />
    </Sphere>
  )
}

function PulsingLine({
  start,
  end,
  progress,
  color,
}: {
  start: [number, number, number]
  end: [number, number, number]
  progress: number
  color: string
}) {
  const THREE = require("three")
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ])
    return g
  }, [start[0], start[1], start[2], end[0], end[1], end[2]])
  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.3 + progress * 0.5}
      />
    </line>
  )
}

export function AgentNetworkInner({
  agents = DEFAULT_AGENTS,
  selectedIndex,
  onSelect,
}: {
  agents?: AgentNode[]
  selectedIndex: number
  onSelect: (i: number) => void
}) {
  const { useFrame } = require("@react-three/fiber")
  const { Html } = require("@react-three/drei")
  
  const positions = useMemo(() => placeNodes(agents.length), [agents.length])
  const [pulse, setPulse] = useState(0)
  const flowIndex = useRef(0)

  useFrame((state: any) => {
    setPulse(Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5)
    flowIndex.current = Math.floor((state.clock.elapsedTime / 2) % (agents.length + 1))
  })

  return (
    <>
      {agents.map((agent, i) => (
        <group key={agent.name} position={[positions[i].x, positions[i].y, positions[i].z]}>
          <mesh
            onClick={() => onSelect(i)}
            onPointerOver={() => {}}
            visible={false}
          >
            <sphereGeometry args={[0.35, 8, 8]} />
          </mesh>
          <AgentNodeSphere
            position={[0, 0, 0]}
            color={agent.color}
            isActive={selectedIndex === i}
            pulse={pulse}
          />
          <Html
            center
            distanceFactor={4}
            style={{
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
              fontSize: "10px",
              color: "var(--foreground)",
              textShadow: "0 0 8px var(--background)",
            }}
          >
            <span>{agent.name}</span>
          </Html>
        </group>
      ))}
      {agents.map((_, i) => {
        if (i === agents.length - 1) return null
        const start = positions[i]
        const end = positions[i + 1]
        const progress =
          flowIndex.current > i ? 1 : flowIndex.current === i ? pulse : 0
        return (
          <PulsingLine
            key={i}
            start={[start.x, start.y, start.z]}
            end={[end.x, end.y, end.z]}
            progress={progress}
            color="#6366f1"
          />
        )
      })}
    </>
  )
}
