"use client"

type Verdict = "pursue" | "reject" | "review"

export function Verdict3DCanvas({ verdict }: { verdict: Verdict }) {
  const styles =
    verdict === "pursue"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : verdict === "reject"
      ? "border-red-500/30 bg-red-500/10 text-red-400"
      : "border-amber-500/30 bg-amber-500/10 text-amber-400"

  return (
    <div
      className={`relative flex h-[160px] w-[200px] items-center justify-center rounded-xl border ${styles}`}
      aria-hidden
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">Verdict</p>
        <p className="mt-1 text-2xl font-bold uppercase">{verdict}</p>
      </div>
    </div>
  )
}
