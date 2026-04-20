"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
)

export function NavbarLogo3D() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-7 w-7" aria-hidden>
        <div className="h-full w-full rounded bg-primary/20" />
      </div>
    )
  }

  return (
    <div className="h-7 w-7" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 1.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 2, 2]} intensity={1} />
        <LogoHexagon />
      </Canvas>
    </div>
  )
}

function LogoHexagon() {
  const { useFrame } = require("@react-three/fiber")
  const THREE = require("three")
  const { useRef } = require("react")
  
  const meshRef = useRef<THREE.Mesh>(null)
  const targetZ = useRef(0)

  useFrame((_: any, delta: any) => {
    if (meshRef.current) {
      const t = targetZ.current
      meshRef.current.rotation.z += (t - meshRef.current.rotation.z) * delta * 6
    }
  })

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerEnter={() => { targetZ.current = Math.PI * 0.5 }}
        onPointerLeave={() => { targetZ.current = 0 }}
      >
        <cylinderGeometry args={[0.35, 0.35, 0.08, 6]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.25}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
    </>
  )
}
