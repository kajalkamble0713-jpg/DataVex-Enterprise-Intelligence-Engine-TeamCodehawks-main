"use client"

import type { BarDatum } from "./BarChart3D"

export function BarChart3DCanvas({ data }: { data: BarDatum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="relative h-[280px] w-full rounded-xl border border-border/50 bg-gradient-to-b from-indigo/5 to-transparent p-4">
      <div className="flex h-full items-end gap-3">
        {data.map((item) => {
          const height = Math.max(10, Math.round((item.value / max) * 200))
          return (
            <div key={item.name} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div
                className="w-full max-w-[44px] rounded-t-md transition-all duration-300"
                style={{
                  height,
                  background: item.color ?? "#6366f1"
                }}
                title={`${item.name}: ${item.value}`}
              />
              <span className="truncate text-center text-[11px] text-muted-foreground">
                {item.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
