"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function TransitionCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial
        color="#6366f1"
        emissive="#6366f1"
        emissiveIntensity={0.15}
        transparent
        opacity={0.25}
        wireframe
      />
    </mesh>
  )
}
