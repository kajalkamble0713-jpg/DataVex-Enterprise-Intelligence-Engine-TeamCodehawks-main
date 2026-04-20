"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export type BarDatum = {
  name: string
  value: number
  color?: string
}

const DEFAULT_COLOR = "#6366f1"

export function BarChart3D({ data }: { data: BarDatum[] }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = data.length

  const { positions, colors, colorAttribute } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const spacing = 0.5
    const startX = -((count - 1) * spacing) / 2

    data.forEach((d, i) => {
      const x = startX + i * spacing
      positions[i * 3] = x
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      const c = new THREE.Color(d.color ?? DEFAULT_COLOR)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    })

    return {
      positions,
      colors,
      colorAttribute: new THREE.InstancedBufferAttribute(colors, 3),
    }
  }, [data, count, maxVal])

  const matrix = useMemo(() => new THREE.Matrix4(), [])
  const position = useMemo(() => new THREE.Vector3(), [])
  const scale = useMemo(() => new THREE.Vector3(), [])
  const targetHeights = useMemo(
    () => data.map((d) => (d.value / maxVal) * 0.8),
    [data, maxVal]
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const targetY = targetHeights[i] * 0.5
      const anim = Math.min(1, time * 0.5 - i * 0.05)
      const y = targetY * anim
      position.fromArray(positions as unknown as number[], i * 3)
      position.y = y
      scale.set(0.35, targetHeights[i] * anim, 0.35)
      matrix.compose(position, new THREE.Quaternion(), scale)
      meshRef.current.setMatrixAt(i, matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const geom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), [])

  return (
    <instancedMesh ref={meshRef} args={[geom, undefined, count]} instanceColor={colorAttribute}>
      <meshStandardMaterial
        vertexColors
        metalness={0.2}
        roughness={0.7}
      />
    </instancedMesh>
  )
}
