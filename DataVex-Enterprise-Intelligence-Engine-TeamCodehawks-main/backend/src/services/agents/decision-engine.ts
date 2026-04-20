/**
 * Deterministic Decision Engine - DataVex Production Version
 * Makes PURSUE/REJECT decisions based on clear, rule-based logic
 * Aligned with DataVex's ICP and business requirements
 * 
 * ICP: 50-5,000 employees, $5M-$500M revenue, B2B companies with tech needs
 * Threshold: ≥60 = PURSUE, 40-59 = REVIEW, <40 = REJECT
 */

import type { DossierData } from './types';

export interface DecisionInputs {
  dossier?: DossierData;
  marketAnalysis?: any;
  techAnalysis?: any;
  financialAnalysis?: any;
  riskAnalysis?: any;
  stockData?: any;
}

export interface DecisionResult {
  verdict: 'PURSUE' | 'IGNORE';
  score: number; // 0-100
  reasoning: string;
  factors: {
    financialHealth: { score: number; reason: string };
    techNeeds: { score: number; reason: string };
    industryFit: { score: number; reason: string };
    companySize: { score: number; reason: string };
    marketPosition: { score: number; reason: string };
  };
}

/**
 * Make a deterministic PURSUE/IGNORE decision
 */
export function makeDecision(inputs: DecisionInputs): DecisionResult {
  const factors = {
    financialHealth: evaluateFinancialHealth(inputs.financialAnalysis, inputs.stockData),
    techNeeds: evaluateTechNeeds(inputs.techAnalysis),
    industryFit: evaluateIndustryFit(inputs.dossier),
    companySize: evaluateCompanySize(inputs.dossier),
    marketPosition: evaluateMarketPosition(inputs.marketAnalysis, inputs.stockData),
  };

  // Calculate weighted score (NEW WEIGHTS)
  const totalScore = Math.round(
    factors.financialHealth.score * 0.25 +
    factors.techNeeds.score * 0.25 +
    factors.industryFit.score * 0.20 +
    factors.companySize.score * 0.15 +
    factors.marketPosition.score * 0.15
  );

  // Apply special case overrides
  const { finalScore, overrideReason } = applySpecialCases(
    totalScore,
    factors,
    inputs
  );

  // Decision threshold: ≥60 = PURSUE, <60 = IGNORE (stricter)
  const verdict = finalScore >= 60 ? 'PURSUE' : 'IGNORE';

  // Generate reasoning
  const reasoning = generateReasoning(verdict, finalScore, factors, overrideReason);

  return {
    verdict,
    score: finalScore,
    reasoning,
    factors,
  };
}

/**
 * Evaluate financial health (0-100) - 25% weight
 * Ability to pay is crucial
 */
function evaluateFinancialHealth(financialAnalysis?: any, stockData?: any): { score: number; reason: string } {
  let score = 50; // Neutral base
  const reasons: string[] = [];

  if (!financialAnalysis) {
    return { score: 40, reason: 'Limited financial data - uncertain budget capacity' };
  }

  const signals = financialAnalysis.financialSignals || [];
  const pressureScore = financialAnalysis.pressureScore || 50;

  // Recent funding (VERY POSITIVE - +25 points)
  const fundingSignal = signals.find((s: string) => 
    s.toLowerCase().includes('raised') || 
    s.toLowerCase().includes('series') ||
    s.toLowerCase().includes('funding')
  );
  
  if (fundingSignal) {
    // Extract funding amount if possible
    const fundingMatch = fundingSignal.match(/\$(\d+)M/i);
    if (fundingMatch && parseInt(fundingMatch[1]) >= 10) {
      score += 30;
      reasons.push(`Major funding (${fundingMatch[0]}) - strong budget`);
    } else {
      score += 25;
      reasons.push('Recent funding - budget available');
    }
  }

  // Profitability (+15 points)
  const isProfitable = signals.some((s: string) =>
    s.toLowerCase().includes('profitable') ||
    s.toLowerCase().includes('profitability')
  );

  if (isProfitable) {
    score += 15;
    reasons.push('Profitable - financial stability');
  }

  // Revenue growth (+10 points)
  const hasGrowth = signals.some((s: string) =>
    s.toLowerCase().includes('revenue') && s.toLowerCase().includes('growth')
  );

  if (hasGrowth) {
    score += 10;
    reasons.push('Revenue growth - expansion budget');
  }

  // Stock performance (if public)
  if (stockData?.change1Year) {
    const yearChange = parseFloat(stockData.change1Year);
    if (yearChange > 20) {
      score += 10;
      reasons.push(`Strong stock performance (+${stockData.change1Year})`);
    } else if (yearChange < -20) {
      score -= 15;
      reasons.push(`Declining stock (${stockData.change1Year}) - financial stress`);
    }
  }

  // NEGATIVE SIGNALS
  const hasLayoffs = signals.some((s: string) =>
    s.toLowerCase().includes('layoff') ||
    s.toLowerCase().includes('cost-cutting') ||
    s.toLowerCase().includes('restructuring')
  );

  if (hasLayoffs) {
    score -= 20;
    reasons.push('Recent layoffs - budget constraints');
  }

  // Financial distress keywords
  const hasDistress = signals.some((s: string) =>
    s.toLowerCase().includes('bankruptcy') ||
    s.toLowerCase().includes('debt') ||
    s.toLowerCase().includes('cash flow')
  );

  if (hasDistress) {
    score -= 30;
    reasons.push('Financial distress - high risk');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reason: reasons.join('; ') || 'Stable financial position' };
}

/**
 * Evaluate tech needs (0-100) - 25% weight
 * High tech debt = strong need for DataVex
 */
function evaluateTechNeeds(techAnalysis?: any): { score: number; reason: string } {
  if (!techAnalysis) {
    return { score: 50, reason: 'No tech analysis - assume moderate needs' };
  }

  const urgencyScore = techAnalysis.urgencyScore || 50;
  const gaps = techAnalysis.gaps || [];

  let score = 40; // Lower base - need to prove tech needs
  const reasons: string[] = [];

  // Urgency score mapping (stricter)
  if (urgencyScore >= 70) {
    score = 90;
    reasons.push(`Critical tech debt (${urgencyScore}/100) - urgent modernization needed`);
  } else if (urgencyScore >= 50) {
    score = 75;
    reasons.push(`High tech debt (${urgencyScore}/100) - strong modernization opportunity`);
  } else if (urgencyScore >= 35) {
    score = 60;
    reasons.push(`Moderate tech gaps (${urgencyScore}/100) - good fit for solutions`);
  } else {
    score = 40;
    reasons.push(`Modern stack (${urgencyScore}/100) - limited immediate need`);
  }

  // Tech gaps bonus (more significant)
  if (gaps.length >= 4) {
    score += 10;
    reasons.push(`${gaps.length} major tech gaps identified`);
  } else if (gaps.length >= 2) {
    score += 5;
    reasons.push(`${gaps.length} tech gaps present`);
  }

  // Check for AI/ML gaps (VERY POSITIVE for DataVex)
  const hasAIGap = gaps.some((g: string) =>
    g.toLowerCase().includes('ai') ||
    g.toLowerCase().includes('ml') ||
    g.toLowerCase().includes('machine learning') ||
    g.toLowerCase().includes('artificial intelligence')
  );

  if (hasAIGap) {
    score += 15;
    reasons.push('No AI/ML capabilities - perfect fit for DataVex');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reason: reasons.join('; ') };
}

/**
 * Evaluate industry fit (0-100) - 20% weight
 * Alignment with DataVex's core solutions
 */
function evaluateIndustryFit(dossier?: DossierData): { score: number; reason: string } {
  if (!dossier?.industry) {
    return { score: 50, reason: 'Unknown industry - neutral fit' };
  }

  const industry = dossier.industry.toLowerCase();
  const description = (dossier.description || '').toLowerCase();

  // PERFECT FIT INDUSTRIES (90-100 points)
  const perfectFit = [
    'real estate', 'proptech', 'property',
    'finance', 'fintech', 'financial', 'insurance',
    'e-commerce', 'ecommerce', 'retail',
    'manufacturing', 'healthcare', 'healthtech'
  ];

  if (perfectFit.some(keyword => industry.includes(keyword) || description.includes(keyword))) {
    return { score: 95, reason: `Perfect industry fit (${dossier.industry}) - aligns with DataVex solutions` };
  }

  // GOOD FIT INDUSTRIES (70-85 points)
  const goodFit = [
    'technology', 'software', 'saas', 'b2b',
    'logistics', 'supply chain', 'transportation',
    'media', 'marketing', 'advertising',
    'professional services', 'consulting'
  ];

  if (goodFit.some(keyword => industry.includes(keyword) || description.includes(keyword))) {
    return { score: 80, reason: `Good industry fit (${dossier.industry}) - strong potential for AI adoption` };
  }

  // MODERATE FIT (50-65 points)
  const moderateFit = [
    'education', 'edtech', 'hospitality', 'travel',
    'energy', 'utilities', 'telecommunications'
  ];

  if (moderateFit.some(keyword => industry.includes(keyword) || description.includes(keyword))) {
    return { score: 60, reason: `Moderate industry fit (${dossier.industry}) - some AI opportunities` };
  }

  // POOR FIT (20-40 points)
  const poorFit = [
    'government', 'non-profit', 'ngo', 'charity',
    'agriculture', 'farming', 'mining'
  ];

  if (poorFit.some(keyword => industry.includes(keyword) || description.includes(keyword))) {
    return { score: 30, reason: `Poor industry fit (${dossier.industry}) - not aligned with DataVex focus` };
  }

  // Default: Unknown but not excluded
  return { score: 55, reason: `Industry (${dossier.industry}) - potential fit, needs evaluation` };
}

/**
 * Evaluate company size (0-100) - 15% weight
 * ICP: 50-5,000 employees ideal
 */
function evaluateCompanySize(dossier?: DossierData): { score: number; reason: string } {
  if (!dossier?.employeeCount) {
    return { score: 45, reason: 'Unknown company size - uncertain scale' };
  }

  const employeeStr = dossier.employeeCount.replace(/,/g, '').replace(/\+/g, '');
  const match = employeeStr.match(/(\d+)/);
  if (!match) {
    return { score: 45, reason: 'Cannot determine employee count' };
  }

  const employees = parseInt(match[1]);

  // IDEAL RANGE: 50-5,000 employees
  if (employees >= 200 && employees <= 2000) {
    return { score: 100, reason: `Perfect size (${employees.toLocaleString()} employees) - ideal ICP` };
  }
  else if (employees >= 50 && employees <= 5000) {
    return { score: 85, reason: `Ideal size (${employees.toLocaleString()} employees) - strong ICP fit` };
  }
  // ACCEPTABLE: 20-50 or 5,000-10,000
  else if (employees >= 20 && employees < 50) {
    return { score: 60, reason: `Small but viable (${employees} employees) - emerging opportunity` };
  }
  else if (employees > 5000 && employees <= 10000) {
    return { score: 65, reason: `Large enterprise (${employees.toLocaleString()} employees) - complex but viable` };
  }
  // TOO SMALL: <20
  else if (employees < 20) {
    return { score: 20, reason: `Too small (${employees} employees) - lacks budget and infrastructure` };
  }
  // TOO LARGE: >10,000
  else {
    return { score: 25, reason: `Too large (${employees.toLocaleString()}+ employees) - likely has internal AI teams` };
  }
}

/**
 * Evaluate market position (0-100) - 15% weight
 * Growing companies more likely to invest
 */
function evaluateMarketPosition(marketAnalysis?: any, stockData?: any): { score: number; reason: string } {
  let score = 55; // Neutral base
  const reasons: string[] = [];

  if (!marketAnalysis) {
    return { score: 50, reason: 'Limited market data - neutral position' };
  }

  // Growth signals
  const growthSignals = marketAnalysis.growthSignals || [];
  if (growthSignals.length >= 4) {
    score += 25;
    reasons.push('Strong growth momentum (4+ signals)');
  } else if (growthSignals.length >= 3) {
    score += 18;
    reasons.push('Good growth signals');
  } else if (growthSignals.length >= 2) {
    score += 12;
    reasons.push('Moderate growth');
  }

  // Stock trend (if public)
  if (stockData?.trend === 'upward') {
    score += 10;
    reasons.push('Positive stock trend');
  } else if (stockData?.trend === 'downward') {
    score -= 10;
    reasons.push('Declining stock trend');
  }

  // Market risks
  const risks = marketAnalysis.risks || [];
  if (risks.length >= 3) {
    score -= 15;
    reasons.push('Multiple market risks');
  } else if (risks.length >= 2) {
    score -= 8;
    reasons.push('Some market risks');
  }

  score = Math.max(0, Math.min(100, score));
  return { score, reason: reasons.join('; ') || 'Stable market position' };
}

/**
 * Apply special case overrides
 */
function applySpecialCases(
  baseScore: number,
  factors: any,
  inputs: DecisionInputs
): { finalScore: number; overrideReason?: string } {
  let finalScore = baseScore;
  let overrideReason: string | undefined;

  // OVERRIDE 1: Recent large funding (>$10M) - Always pursue if score ≥ 40
  const signals = inputs.financialAnalysis?.financialSignals || [];
  const largeFunding = signals.find((s: string) => {
    const match = s.match(/\$(\d+)M/i);
    return match && parseInt(match[1]) >= 10;
  });

  if (largeFunding && baseScore >= 40 && factors.industryFit.score >= 60) {
    finalScore = Math.max(finalScore, 65);
    overrideReason = `Override: Large funding detected (${largeFunding}) - boosted to PURSUE`;
  }

  // OVERRIDE 2: Legacy systems + No AI - Boost by +20
  const techScore = inputs.techAnalysis?.urgencyScore || 0;
  const gaps = inputs.techAnalysis?.gaps || [];
  const hasAIGap = gaps.some((g: string) =>
    g.toLowerCase().includes('ai') || g.toLowerCase().includes('ml')
  );

  if (techScore >= 60 && hasAIGap) {
    finalScore += 20;
    overrideReason = (overrideReason || '') + ' Legacy systems + no AI - strong transformation opportunity';
  }

  // OVERRIDE 3: Active tech hiring - Boost by +15
  const recentDev = inputs.dossier?.recentDevelopments || [];
  const techHiring = recentDev.some((d: string) =>
    d.toLowerCase().includes('hiring') &&
    (d.toLowerCase().includes('engineer') ||
     d.toLowerCase().includes('cto') ||
     d.toLowerCase().includes('data scientist'))
  );

  if (techHiring) {
    finalScore += 15;
    overrideReason = (overrideReason || '') + ' Active tech hiring - expansion mode';
  }

  // OVERRIDE 4: Using competitor - Reduce score
  const risks = inputs.riskAnalysis || [];
  const hasCompetitor = Array.isArray(risks) && risks.some((r: any) => {
    const text = ((r.objection || '') + ' ' + (r.explanation || '')).toLowerCase();
    return text.includes('salesforce') || text.includes('aws ai') || text.includes('competitor');
  });

  if (hasCompetitor) {
    finalScore -= 10;
    overrideReason = (overrideReason || '') + ' Using competitor AI platform';
  }

  return { finalScore: Math.max(0, Math.min(100, finalScore)), overrideReason };
}

/**
 * Generate human-readable reasoning
 */
function generateReasoning(
  verdict: 'PURSUE' | 'IGNORE',
  score: number,
  factors: any,
  overrideReason?: string
): string {
  const parts: string[] = [];

  if (verdict === 'PURSUE') {
    parts.push(`PURSUE with ${score}% confidence.`);
    
    // Highlight top 2 factors
    const sortedFactors = Object.entries(factors)
      .sort(([, a]: any, [, b]: any) => b.score - a.score)
      .slice(0, 2);
    
    sortedFactors.forEach(([name, data]: any) => {
      if (data.score >= 70) {
        parts.push(data.reason);
      }
    });

    if (overrideReason) {
      parts.push(overrideReason);
    }
  } else {
    parts.push(`IGNORE with ${100 - score}% confidence.`);
    
    // Highlight blocking factors
    const sortedFactors = Object.entries(factors)
      .sort(([, a]: any, [, b]: any) => a.score - b.score)
      .slice(0, 2);
    
    sortedFactors.forEach(([name, data]: any) => {
      if (data.score < 50) {
        parts.push(data.reason);
      }
    });
  }

  return parts.join(' ');
}
