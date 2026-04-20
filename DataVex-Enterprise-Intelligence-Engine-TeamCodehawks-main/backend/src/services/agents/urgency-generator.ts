/**
 * Urgency Factor Generator - Creates "Why Now" messaging
 * Synthesizes signals from all agents to highlight immediate action triggers
 */

import type { StockData } from '../stock.service';

interface UrgencyInputs {
  stockData?: StockData | null;
  financialAnalysis?: any;
  techAnalysis?: any;
  marketAnalysis?: any;
  dossier?: any;
}

/**
 * Generate urgency factor by prioritizing the most compelling "Why Now" signal
 */
export function generateUrgencyFactor(inputs: UrgencyInputs): string {
  const signals: { priority: number; message: string }[] = [];
  
  // Priority 1: Stock market signals (highest urgency)
  if (inputs.stockData) {
    const { change1Month, change1Year, urgencySignal, trend } = inputs.stockData;
    
    if (change1Month) {
      const monthChange = parseFloat(change1Month);
      
      // Sharp decline = high urgency
      if (monthChange < -15) {
        signals.push({
          priority: 10,
          message: `Stock down ${change1Month} in last month – company likely seeking cost efficiencies and ROI-driven solutions.`
        });
      }
      // Strong growth = high urgency
      else if (monthChange > 20) {
        signals.push({
          priority: 9,
          message: `Stock up ${change1Month} in last month – company in aggressive growth mode with budget for new initiatives.`
        });
      }
      // Moderate changes
      else if (monthChange < -8) {
        signals.push({
          priority: 7,
          message: `Recent stock decline (${change1Month}) indicates potential focus on operational efficiency and automation.`
        });
      }
      else if (monthChange > 10) {
        signals.push({
          priority: 7,
          message: `Strong stock performance (${change1Month}) signals expansion phase – ideal time to introduce scaling solutions.`
        });
      }
    }
  }
  
  // Priority 2: Recent funding (very high urgency)
  if (inputs.financialAnalysis?.financialSignals) {
    const signals_arr = inputs.financialAnalysis.financialSignals;
    const fundingSignal = signals_arr.find((s: string) => 
      s.toLowerCase().includes('raised') || 
      s.toLowerCase().includes('funding') ||
      s.toLowerCase().includes('series')
    );
    
    if (fundingSignal) {
      signals.push({
        priority: 9,
        message: `${fundingSignal} – fresh capital means active investment in growth initiatives and new technology.`
      });
    }
  }
  
  // Priority 3: High tech debt (high urgency)
  if (inputs.techAnalysis?.urgencyScore) {
    const score = inputs.techAnalysis.urgencyScore;
    
    if (score >= 70) {
      signals.push({
        priority: 8,
        message: `Critical technical debt (urgency score: ${score}/100) – modernization is becoming urgent to stay competitive.`
      });
    } else if (score >= 50) {
      signals.push({
        priority: 6,
        message: `Moderate technical debt (urgency score: ${score}/100) – good time to introduce modern AI-powered solutions.`
      });
    }
  }
  
  // Priority 4: Rapid hiring/expansion
  if (inputs.dossier?.recentDevelopments) {
    const hiringSignal = inputs.dossier.recentDevelopments.find((d: string) =>
      d.toLowerCase().includes('hiring') ||
      d.toLowerCase().includes('expanded team') ||
      d.toLowerCase().includes('employees')
    );
    
    if (hiringSignal) {
      signals.push({
        priority: 7,
        message: `${hiringSignal} – scaling operations create immediate need for efficiency tools and automation.`
      });
    }
  }
  
  // Priority 5: Market expansion
  if (inputs.marketAnalysis?.growthSignals) {
    const expansionSignal = inputs.marketAnalysis.growthSignals.find((s: string) =>
      s.toLowerCase().includes('expansion') ||
      s.toLowerCase().includes('entered') ||
      s.toLowerCase().includes('launched')
    );
    
    if (expansionSignal) {
      signals.push({
        priority: 6,
        message: `${expansionSignal} – market expansion requires scalable data infrastructure and intelligence.`
      });
    }
  }
  
  // Priority 6: Strong growth momentum
  if (inputs.marketAnalysis?.growthSignals && inputs.marketAnalysis.growthSignals.length >= 3) {
    signals.push({
      priority: 5,
      message: `Multiple growth signals detected – company in scaling phase with budget for strategic investments.`
    });
  }
  
  // Priority 7: Financial pressure (moderate urgency)
  if (inputs.financialAnalysis?.pressureScore) {
    const score = inputs.financialAnalysis.pressureScore;
    
    if (score >= 70) {
      signals.push({
        priority: 6,
        message: `High financial pressure (score: ${score}/100) – company seeking ROI-driven solutions to improve efficiency.`
      });
    }
  }
  
  // Sort by priority (highest first) and return the top signal
  if (signals.length > 0) {
    signals.sort((a, b) => b.priority - a.priority);
    return signals[0].message;
  }
  
  // Default: No specific urgency
  return 'Stable market position with established operations – good time to introduce AI-driven efficiencies and competitive advantages.';
}
