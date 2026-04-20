"use client"

import { ReactNode, useState, useEffect } from "react"
import dynamic from "next/dynamic"

type SceneProps = {
  children: ReactNode
  /** Enable orbit controls (e.g. for agent network). Default false for hero. */
  controls?: boolean
  /** Camera position [x, y, z]. */
  camera?: [number, number, number]
  /** Optional fov. */
  fov?: number
  /** Optional className for the canvas container. */
  className?: string
  /** Optional dpr ceiling for performance. */
  dpr?: [number, number]
}

const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false }
)

const OrbitControls = dynamic(
  () => import("@react-three/drei").then((mod) => mod.OrbitControls),
  { ssr: false }
)

export function Scene({
  children,
  controls = false,
  camera = [0, 0, 5],
  fov = 45,
  className = "",
  dpr = [1, 2],
}: SceneProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={className} aria-hidden>
        <div className="w-full h-full min-h-[200px] bg-indigo/5 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className={className} aria-hidden>
      <Canvas
        camera={{ position: camera, fov }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, 5]} intensity={0.3} />
        {children}
        {controls && (
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
          />
        )}
      </Canvas>
    </div>
  )
}
