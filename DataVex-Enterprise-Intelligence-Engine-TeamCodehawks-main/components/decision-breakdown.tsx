"use client"

import { motion } from "framer-motion"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Code, 
  Building2, 
  Users, 
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Newspaper,
  Calendar
} from "lucide-react"
import { GlassCard } from "./glass-card"

interface DecisionFactor {
  score: number
  reason: string
}

interface DecisionBreakdownProps {
  verdict: "pursue" | "reject" | "review"
  score: number
  factors: {
    financialHealth: DecisionFactor
    techNeeds: DecisionFactor
    industryFit: DecisionFactor
    companySize: DecisionFactor
    marketPosition: DecisionFactor
  }
  dossier?: {
    name?: string
    employeeCount?: string
    revenue?: string
    industry?: string
    recentDevelopments?: string[]
  }
  marketAnalysis?: {
    growthSignals?: string[]
    risks?: string[]
  }
  stockData?: {
    ticker: string
    change1Month: string | null
    change1Year: string | null
    trend: string
  }
}

export function DecisionBreakdown({ 
  verdict, 
  score, 
  factors,
  dossier,
  marketAnalysis,
  stockData
}: DecisionBreakdownProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-primary"
    if (score >= 40) return "text-warning"
    return "text-destructive"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success/20 to-success/5"
    if (score >= 60) return "from-primary/20 to-primary/5"
    if (score >= 40) return "from-warning/20 to-warning/5"
    return "from-destructive/20 to-destructive/5"
  }

  const factorConfig = [
    {
      key: 'financialHealth',
      name: 'Financial Health',
      icon: DollarSign,
      weight: '25%',
      description: 'Budget capacity and financial stability'
    },
    {
      key: 'techNeeds',
      name: 'Technology Needs',
      icon: Code,
      weight: '25%',
      description: 'Tech debt and modernization opportunities'
    },
    {
      key: 'industryFit',
      name: 'Industry Alignment',
      icon: Target,
      weight: '20%',
      description: 'Fit with DataVex solutions'
    },
    {
      key: 'companySize',
      name: 'Company Size',
      icon: Users,
      weight: '15%',
      description: 'Scale and infrastructure'
    },
    {
      key: 'marketPosition',
      name: 'Market Position',
      icon: TrendingUp,
      weight: '15%',
      description: 'Growth momentum and market trends'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <GlassCard hover={false} className="border-2 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1">Decision Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive breakdown of the {verdict.toUpperCase()} decision
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-muted-foreground">out of 100</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getScoreGradient(score)}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-foreground mix-blend-difference">
              {score >= 60 ? 'PURSUE' : score >= 40 ? 'REVIEW' : 'REJECT'} Threshold
            </span>
          </div>
        </div>

        {/* Threshold indicators */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 (Reject)</span>
          <span className="text-warning">40 (Review)</span>
          <span className="text-primary">60 (Pursue)</span>
          <span>100 (Perfect)</span>
        </div>
      </GlassCard>

      {/* Factor Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Decision Factors
        </h3>

        {factorConfig.map((config, index) => {
          const factor = factors[config.key as keyof typeof factors]
          const Icon = config.icon
          
          return (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover={false} className="border-l-4" style={{ borderLeftColor: `hsl(var(--primary))` }}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${getScoreGradient(factor.score)}`}>
                    <Icon className={`h-6 w-6 ${getScoreColor(factor.score)}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{config.name}</h4>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(factor.score)}`}>
                          {factor.score}
                        </div>
                        <div className="text-xs text-muted-foreground">Weight: {config.weight}</div>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                        className={`h-full bg-gradient-to-r ${getScoreGradient(factor.score)}`}
                      />
                    </div>

                    {/* Reason */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {factor.reason}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Company Highlights */}
      {dossier && (
        <GlassCard hover={false}>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            Company Highlights
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Company Size</div>
              <div className="text-sm font-semibold text-foreground">{dossier.employeeCount || 'Unknown'} employees</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Annual Revenue</div>
              <div className="text-sm font-semibold text-foreground">{dossier.revenue || 'Undisclosed'}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Industry</div>
              <div className="text-sm font-semibold text-foreground">{dossier.industry || 'General'}</div>
            </div>
            {stockData && (
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Stock Performance</div>
                <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                  {stockData.ticker}
                  {stockData.trend === 'upward' ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : stockData.trend === 'downward' ? (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {dossier.recentDevelopments && dossier.recentDevelopments.length > 0 && (
            <div className="border-t border-border/50 pt-4">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                Recent Developments
              </h4>
              <ul className="space-y-2">
                {dossier.recentDevelopments.slice(0, 4).map((dev, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span>{dev}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </GlassCard>
      )}

      {/* Market Analysis */}
      {marketAnalysis && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Growth Signals */}
          {marketAnalysis.growthSignals && marketAnalysis.growthSignals.length > 0 && (
            <GlassCard hover={false} className="border-success/30">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-success" />
                Growth Signals ({marketAnalysis.growthSignals.length})
              </h3>
              <ul className="space-y-2">
                {marketAnalysis.growthSignals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Market Risks */}
          {marketAnalysis.risks && marketAnalysis.risks.length > 0 && (
            <GlassCard hover={false} className="border-warning/30">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-warning" />
                Market Risks ({marketAnalysis.risks.length})
              </h3>
              <ul className="space-y-2">
                {marketAnalysis.risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}
        </div>
      )}

      {/* Stock Performance Detail */}
      {stockData && (
        <GlassCard hover={false} className="border-primary/30">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Newspaper className="h-5 w-5 text-primary" />
            Stock Market Analysis
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">Ticker</div>
              <div className="text-lg font-bold text-foreground">{stockData.ticker}</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">1-Month Change</div>
              <div className={`text-lg font-bold ${stockData.change1Month && parseFloat(stockData.change1Month) >= 0 ? 'text-success' : 'text-destructive'}`}>
                {stockData.change1Month || 'N/A'}
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-xs text-muted-foreground mb-1">1-Year Change</div>
              <div className={`text-lg font-bold ${stockData.change1Year && parseFloat(stockData.change1Year) >= 0 ? 'text-success' : 'text-destructive'}`}>
                {stockData.change1Year || 'N/A'}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              {stockData.trend === 'upward' ? (
                <TrendingUp className="h-5 w-5 text-success" />
              ) : stockData.trend === 'downward' ? (
                <TrendingDown className="h-5 w-5 text-destructive" />
              ) : (
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold text-foreground capitalize">
                {stockData.trend} Trend
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {stockData.trend === 'upward' 
                ? 'Positive stock performance indicates financial strength and growth momentum, making them more likely to invest in new solutions.'
                : stockData.trend === 'downward'
                ? 'Declining stock may indicate financial pressure or market challenges, potentially affecting budget availability.'
                : 'Stable stock performance suggests steady operations with moderate investment capacity.'}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
