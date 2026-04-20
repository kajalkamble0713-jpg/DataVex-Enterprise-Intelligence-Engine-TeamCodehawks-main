"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { GlassCard } from "./glass-card"
import { motion } from "framer-motion"

interface StockData {
  ticker: string
  latestClose: number
  change1Week: string | null
  change1Month: string | null
  change1Year: string | null
  trend: 'upward' | 'downward' | 'neutral'
  urgencySignal: string
}

interface StockChartProps {
  stockData: StockData
}

export function StockChart({ stockData }: StockChartProps) {
  const { ticker, latestClose, change1Week, change1Month, change1Year, trend, urgencySignal } = stockData

  // Parse percentage changes
  const parseChange = (change: string | null): number => {
    if (!change) return 0
    return parseFloat(change.replace('%', '').replace('+', ''))
  }

  const weekChange = parseChange(change1Week)
  const monthChange = parseChange(change1Month)
  const yearChange = parseChange(change1Year)

  // Determine colors based on trend
  const trendColor = trend === 'upward' 
    ? 'text-success' 
    : trend === 'downward' 
    ? 'text-destructive' 
    : 'text-muted-foreground'

  const TrendIcon = trend === 'upward' 
    ? TrendingUp 
    : trend === 'downward' 
    ? TrendingDown 
    : Minus

  // Create simple bar chart data
  const chartData = [
    { label: '1W', value: weekChange, color: weekChange >= 0 ? 'bg-success' : 'bg-destructive' },
    { label: '1M', value: monthChange, color: monthChange >= 0 ? 'bg-success' : 'bg-destructive' },
    { label: '1Y', value: yearChange, color: yearChange >= 0 ? 'bg-success' : 'bg-destructive' },
  ]

  // Calculate max absolute value for scaling
  const maxAbsValue = Math.max(Math.abs(weekChange), Math.abs(monthChange), Math.abs(yearChange), 10)

  return (
    <GlassCard hover={false} className="border-primary/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-lg font-bold text-foreground">Stock Performance</h3>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-mono font-semibold text-primary">{ticker}</span>
            <span className="text-xs">• Real-time data</span>
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <TrendIcon className={`h-6 w-6 ${trendColor}`} />
            <span className={`text-3xl font-bold ${trendColor}`}>
              ${latestClose.toFixed(2)}
            </span>
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${trendColor}`}>
            {trend} trend
          </span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 mb-4">
        {chartData.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{item.label}</span>
              <span className={item.value >= 0 ? 'text-success' : 'text-destructive'}>
                {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)}%
              </span>
            </div>
            <div className="relative h-8 bg-muted/30 rounded-md overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(Math.abs(item.value) / maxAbsValue) * 100}%`,
                  marginLeft: item.value < 0 ? 'auto' : '0'
                }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                className={`h-full ${item.color} opacity-70`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-foreground mix-blend-difference">
                  {item.value >= 0 ? '+' : ''}{item.value.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Urgency Signal */}
      <div className="border-t border-border/50 pt-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Market Signal</h4>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
        </div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-foreground leading-relaxed font-medium">{urgencySignal}</p>
        </div>
      </div>
    </GlassCard>
  )
}
