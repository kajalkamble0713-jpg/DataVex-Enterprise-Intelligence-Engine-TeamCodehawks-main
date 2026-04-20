"use client"

import { useState } from "react"
import { agents as agentList } from "@/lib/mock-data"
import type { AgentStep } from "@/lib/mock-data"

type TraceViewStep = AgentStep & { color?: string }

function toTraceSteps(trace: AgentStep[]): TraceViewStep[] {
  return trace.map((step) => {
    const agent = agentList.find((a) => a.name === step.agent)
    return {
      ...step,
      color: agent?.color
    }
  })
}

export function TraceTimeline3DCanvas({ trace }: { trace: AgentStep[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const steps = toTraceSteps(trace)

  return (
    <div className="relative h-[320px] w-full overflow-hidden p-4" aria-hidden>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={`${step.agent}-${i}`} className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${i <= activeIndex ? "opacity-100" : "opacity-40"}`}
              style={{ backgroundColor: step.color ?? "#6366f1" }}
            />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{step.agent}</p>
              <p className="truncate text-[11px] text-muted-foreground">{step.summary}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{step.duration}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i <= activeIndex ? "scale-125 opacity-100" : "opacity-40"
            }`}
            style={{
              backgroundColor: steps[i].color ?? "#6366f1",
            }}
            aria-label={`Step ${i + 1}: ${steps[i].agent}`}
          />
        ))}
      </div>
    </div>
  )
}
