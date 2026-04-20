/**
 * Shared types for the direct agent pipeline
 */

export interface AgentContext {
  jobId: string;
  domain: string;
  scrapedContent?: string;
  newsData?: unknown;
}

export interface AgentOutput {
  agent: string;
  input: string;
  output: string;
  duration?: string;
}

export interface DossierData {
  name?: string;
  description?: string;
  industry?: string;
  size?: string;
  employeeCount?: string;
  revenue?: string;
  location?: string;
  technologies?: string[];
  leadership?: string[];
  recentDevelopments?: string[];
}

export interface MarketAnalysis {
  marketInsights?: string;
  growthSignals?: string[];
  risks?: string[];
  stockAnalysis?: {
    ticker: string;
    trend: string;
    interpretation: string;
  };
}

export interface TechAnalysis {
  techStackAnalysis?: string;
  gaps?: string[];
  urgencyScore?: number;
}

export interface FinancialAnalysis {
  financialSignals?: string[];
  pressureScore?: number;
}

export interface RiskAnalysis {
  objections?: Array<{ objection: string; explanation: string }>;
}

export interface ArbiterDecision {
  verdict: "PURSUE" | "IGNORE";
  decisionReasoning: string;
  confidenceScore?: number;
  signals?: string[];
  riskFactors?: string[];
}

export interface BonusContent {
  platform?: string;
  content?: string;
}

export interface AnalysisResult {
  jobId: string;
  status: "completed" | "failed";
  dossier?: DossierData;
  verdict?: "PURSUE" | "IGNORE";
  confidenceScore?: number;
  confidenceBreakdown?: {
    dataQuality: number;
    signalStrength: number;
    riskLevel: number;
    marketClarity: number;
    financialClarity: number;
  };
  decisionReasoning?: string;
  outreachMessage?: string;
  bonusContent?: BonusContent;
  trace?: AgentOutput[];
  stockData?: {
    ticker: string;
    latestClose: number;
    change1Week: string | null;
    change1Month: string | null;
    change1Year: string | null;
    trend: 'upward' | 'downward' | 'neutral';
    urgencySignal: string;
  };
  recommendedSolution?: {
    name: string;
    reason: string;
    features: string[];
  };
  urgencyFactor?: string;
  decisionFactors?: {
    financialHealth: { score: number; reason: string };
    techNeeds: { score: number; reason: string };
    industryFit: { score: number; reason: string };
    companySize: { score: number; reason: string };
    marketPosition: { score: number; reason: string };
  };
  decisionScore?: number;
  marketAnalysis?: MarketAnalysis;
  sourceData?: {
    scrapedContent?: string;
    newsData?: unknown;
  };
}
