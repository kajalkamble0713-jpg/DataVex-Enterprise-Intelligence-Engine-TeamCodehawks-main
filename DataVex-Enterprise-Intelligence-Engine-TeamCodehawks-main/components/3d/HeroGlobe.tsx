"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const PRIMARY = "#6366f1"
const GLOW = "#818cf8"

function WireframeGlobe() {
  const meshRef = useRef<THREE.LineSegments>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 1)
    return new THREE.WireframeGeometry(geo)
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta / 30
    }
  })

  return (
    <lineSegments ref={meshRef} geometry={geometry}>
      <lineBasicMaterial
        color={PRIMARY}
        transparent
        opacity={0.35}
        linewidth={1}
      />
    </lineSegments>
  )
}

function GlowSphere() {
  const { useFrame } = require("@react-three/fiber")
  const THREE = require("three")
  
  const meshRef = useRef<any>(null)
  useFrame((_: any, delta: any) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta / 30
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.18, 32, 32]} />
      <meshBasicMaterial
        color={PRIMARY}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const { useFrame } = require("@react-three/fiber")
  const THREE = require("three")
  
  const pointsRef = useRef<any>(null)
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(120 * 3)
    const randoms = new Float32Array(120)
    for (let i = 0; i < 120; i++) {
      const radius = 1.8 + Math.random() * 1.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      randoms[i] = Math.random()
    }
    return { positions, randoms }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array
    for (let i = 0; i < 120; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime + randoms[i] * 10) * 0.002
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={120}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={GLOW}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function HeroGlobe() {
  return (
    <>
      <GlowSphere />
      <WireframeGlobe />
      <FloatingParticles />
    </>
  )
}
