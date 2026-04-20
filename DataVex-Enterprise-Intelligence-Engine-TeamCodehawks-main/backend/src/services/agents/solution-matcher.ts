/**
 * Solution Matchmaker - Recommends the best DataVex solution for each prospect
 * Based on industry, tech stack, pain points, and company profile
 */

import type { DossierData, TechAnalysis, MarketAnalysis } from './types';

export interface RecommendedSolution {
  name: string;
  reason: string;
  features: string[];
}

const DATAVEX_SOLUTIONS = {
  PROPTECH: {
    name: 'AI-Powered PropTech Solutions',
    features: [
      'Property intelligence and market analysis',
      'Automated tenant screening and verification',
      'Predictive maintenance and asset optimization',
      'Real-time portfolio performance tracking'
    ]
  },
  FINTECH: {
    name: 'Automated Financial Analysis Platform',
    features: [
      'Real-time financial data aggregation',
      'Automated risk assessment and compliance',
      'Predictive financial modeling',
      'Investment opportunity identification'
    ]
  },
  MARKETING_AI: {
    name: 'Data-Driven Marketing AI Suite',
    features: [
      'Customer behavior prediction and segmentation',
      'Automated campaign optimization',
      'Multi-channel attribution analysis',
      'Real-time ROI tracking and insights'
    ]
  },
  SALES_INTELLIGENCE: {
    name: 'Prospect Intelligence Engine',
    features: [
      'Automated prospect research and scoring',
      'Real-time company intelligence',
      'Personalized outreach generation',
      'Sales pipeline optimization'
    ]
  }
};

/**
 * Determine the best DataVex solution for a prospect
 */
export function matchSolution(
  dossier: DossierData | undefined,
  techAnalysis: any,
  marketAnalysis: any
): RecommendedSolution {
  
  const industry = (dossier?.industry || '').toLowerCase();
  const description = (dossier?.description || '').toLowerCase();
  const technologies = (dossier?.technologies || []).map(t => t.toLowerCase());
  
  // Rule 1: Real Estate / Property Management → PropTech
  if (
    industry.includes('real estate') ||
    industry.includes('property') ||
    description.includes('property management') ||
    description.includes('real estate')
  ) {
    return {
      ...DATAVEX_SOLUTIONS.PROPTECH,
      reason: 'Real estate industry focus with property management needs – ideal for our AI-powered PropTech suite that automates property intelligence and tenant operations.'
    };
  }
  
  // Rule 2: Finance / Insurance / Banking → Financial Analysis
  if (
    industry.includes('finance') ||
    industry.includes('financial') ||
    industry.includes('insurance') ||
    industry.includes('banking') ||
    industry.includes('fintech') ||
    description.includes('financial services')
  ) {
    return {
      ...DATAVEX_SOLUTIONS.FINTECH,
      reason: 'Financial services industry with complex data analysis needs – our automated financial analysis platform streamlines risk assessment and compliance.'
    };
  }
  
  // Rule 3: B2B SaaS / Tech with Sales Team → Sales Intelligence
  if (
    (industry.includes('saas') || industry.includes('software') || industry.includes('technology')) &&
    (description.includes('b2b') || description.includes('enterprise') || description.includes('sales'))
  ) {
    return {
      ...DATAVEX_SOLUTIONS.SALES_INTELLIGENCE,
      reason: 'B2B SaaS company with active sales operations – our Prospect Intelligence Engine automates research and personalizes outreach at scale.'
    };
  }
  
  // Rule 4: E-commerce / Retail / Media → Marketing AI
  if (
    industry.includes('e-commerce') ||
    industry.includes('ecommerce') ||
    industry.includes('retail') ||
    industry.includes('media') ||
    industry.includes('advertising') ||
    industry.includes('marketing') ||
    description.includes('consumer') ||
    description.includes('marketplace')
  ) {
    return {
      ...DATAVEX_SOLUTIONS.MARKETING_AI,
      reason: 'Consumer-facing business with marketing and customer acquisition focus – our Marketing AI Suite optimizes campaigns and predicts customer behavior.'
    };
  }
  
  // Rule 5: High tech debt → Marketing AI (most versatile)
  const urgencyScore = typeof techAnalysis === 'object' && techAnalysis.urgencyScore 
    ? techAnalysis.urgencyScore 
    : 0;
    
  if (urgencyScore > 60) {
    return {
      ...DATAVEX_SOLUTIONS.MARKETING_AI,
      reason: 'High technical debt indicates need for modern data infrastructure – our Marketing AI Suite provides immediate value while modernizing your tech stack.'
    };
  }
  
  // Rule 6: Growth signals → Sales Intelligence
  const growthSignals = typeof marketAnalysis === 'object' && marketAnalysis.growthSignals
    ? marketAnalysis.growthSignals
    : [];
    
  if (growthSignals.length >= 3) {
    return {
      ...DATAVEX_SOLUTIONS.SALES_INTELLIGENCE,
      reason: 'Strong growth momentum indicates scaling sales operations – our Prospect Intelligence Engine helps your team scale efficiently with AI-powered research.'
    };
  }
  
  // Default: Marketing AI (most broadly applicable)
  return {
    ...DATAVEX_SOLUTIONS.MARKETING_AI,
    reason: 'Versatile solution for data-driven decision making – our Marketing AI Suite provides actionable insights across customer acquisition and retention.'
  };
}
