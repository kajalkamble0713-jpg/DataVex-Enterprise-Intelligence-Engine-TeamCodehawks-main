"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function Logo3D() {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef(0)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += (targetRotation.current - meshRef.current.rotation.z) * delta * 4
    }
  })

  const setHover = (v: number) => {
    targetRotation.current = v * Math.PI * 0.5
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHover(1)}
        onPointerLeave={() => setHover(0)}
      >
        <cylinderGeometry args={[0.4, 0.4, 0.12, 6]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </group>
  )
}
