/**
 * Direct agent orchestrator - runs all 8 agents sequentially
 * Outputs data in the same shape as n8n callback for DB compatibility
 */

import { CerebrasClient } from "./cerebras.client";
import { getStockData, type StockData } from "../stock.service";
import { matchSolution } from "./solution-matcher";
import { generateUrgencyFactor } from "./urgency-generator";
import { calculateConfidenceScore } from "./confidence-calculator";
import { makeDecision } from "./decision-engine";
import { getCompanyKnowledge, hasCompanyKnowledge } from "./company-knowledge";
import type {
  AgentContext,
  AgentOutput,
  AnalysisResult,
  DossierData,
  MarketAnalysis,
  TechAnalysis,
  FinancialAnalysis,
  RiskAnalysis,
  ArbiterDecision,
  BonusContent,
} from "./types";

const cerebras = new CerebrasClient();

/**
 * Safe JSON parser with fallback
 */
function parseSafe<T = unknown>(text: string): T | string {
  try {
    return JSON.parse(text) as T;
  } catch {
    return text;
  }
}

/**
 * Run the complete agent pipeline
 */
export async function runAgentPipeline(
  jobId: string,
  domain: string
): Promise<AnalysisResult> {
  const trace: AgentOutput[] = [];
  const context: AgentContext = {
    jobId,
    domain,
    scrapedContent: "",
    newsData: {},
  };

  try {
    // Agent 1: Researcher
    console.log(`[${jobId}] Running Researcher agent...`);
    const researcherStart = Date.now();
    
    // Check if we have knowledge base data for this domain
    const knownCompany = getCompanyKnowledge(domain);
    let dossier: DossierData | string;
    
    if (knownCompany) {
      console.log(`[${jobId}] Using knowledge base data for ${domain}`);
      dossier = knownCompany;
      const researcherDuration = Date.now() - researcherStart;
      trace.push({
        agent: "Researcher",
        input: `domain: ${domain}`,
        output: JSON.stringify(knownCompany, null, 2),
        duration: `${(researcherDuration / 1000).toFixed(2)}s`,
      });
    } else {
      // Use AI to research the company
      const researcherPrompt = `You are an expert business intelligence researcher with access to comprehensive company databases.

TASK: Research and provide detailed, accurate information about the company at domain: ${domain}

CRITICAL INSTRUCTIONS:
1. If this is a well-known company, use your factual knowledge to provide ACCURATE information
2. Include SPECIFIC numbers for employees and revenue (not ranges unless truly unknown)
3. Provide REAL city and country locations
4. List ACTUAL technologies they use
5. Name REAL executives if known
6. Return ONLY valid JSON with NO additional text, markdown, or explanations

REQUIRED JSON STRUCTURE:
{
  "name": "Official company name (e.g., Stripe, Inc.)",
  "description": "Detailed 3-4 sentence description of what the company does, their main products/services, and market position",
  "industry": "Specific industry vertical (e.g., Payment Processing, Cloud Infrastructure, E-commerce Platform)",
  "size": "Company size tier: Startup (<50), SMB (50-500), Mid-Market (500-5000), Enterprise (5000+)",
  "employeeCount": "Specific number or realistic estimate (e.g., 8,000 or 50,000+)",
  "revenue": "Annual revenue with currency and period (e.g., $14B (2023), $500M ARR, Undisclosed)",
  "location": "Headquarters: City, State/Country (e.g., San Francisco, CA, USA or London, UK)",
  "technologies": ["List 6-8 actual technologies: programming languages, frameworks, cloud providers, databases"],
  "leadership": ["CEO Full Name - CEO", "CTO Full Name - CTO", "CFO Full Name - CFO"],
  "recentDevelopments": ["Recent funding round or milestone", "New product launch or feature", "Strategic partnership or acquisition", "Market expansion or growth metric"]
}

EXAMPLES OF GOOD DATA:
- employeeCount: "8,000" NOT "8,000-10,000" or "Unknown"
- revenue: "$14B (2023)" NOT "Billions" or "High"
- location: "San Francisco, CA, USA" NOT "California" or "US"
- technologies: ["Ruby", "Go", "React", "AWS", "PostgreSQL", "Kubernetes"] NOT ["Web Stack", "Cloud"]

For unknown companies: Make educated inferences based on domain name, but keep data realistic and consistent.`;

    const researcherInput = `Research company at domain: ${domain}

Provide comprehensive, factual information. If this is a major company (Fortune 500, unicorn startup, well-known tech company), use accurate data from your knowledge base.

Focus on:
- Exact employee count and revenue figures
- Specific headquarters location
- Real technology stack
- Named executives
- Recent news and developments`;

    const researcherOutput = await cerebras.chat(
      researcherPrompt,
      researcherInput,
      0.05  // Very low temperature for factual accuracy
    );
    const researcherDuration = Date.now() - researcherStart;
    trace.push({
      agent: "Researcher",
      input: `domain: ${domain}`,
      output: researcherOutput,
      duration: `${(researcherDuration / 1000).toFixed(2)}s`,
    });
    dossier = parseSafe<DossierData>(researcherOutput);
    }

    // Agent 2: Market Analyst
    console.log(`[${jobId}] Running Market Analyst agent...`);
    const marketStart = Date.now();
    
    // Fetch stock data for publicly traded companies
    const stockCompanyName = typeof dossier === "object" && dossier.name ? dossier.name : domain;
    const stockData = await getStockData(stockCompanyName);
    
    if (stockData) {
      console.log(`[${jobId}] Stock data found: ${stockData.ticker} - ${stockData.urgencySignal}`);
    }
    
    // Prepare dossier text for subsequent agents
    const dossierText = typeof dossier === "object" ? JSON.stringify(dossier, null, 2) : dossier;
    
    const marketPrompt = `You are a senior market analyst with expertise in competitive intelligence and market dynamics.

TASK: Analyze the market position and strategic outlook for this company.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "marketInsights": "3-4 sentences analyzing: (1) current market position and share, (2) competitive advantages and moats, (3) industry trends affecting them, (4) strategic positioning",
  "growthSignals": [
    "Specific growth indicator with data (e.g., 'YoY revenue growth of 45%')",
    "Market expansion signal (e.g., 'Entered European market Q3 2023')",
    "Product/service traction (e.g., 'Reached 1M active users milestone')",
    "Strategic advantage (e.g., 'First-mover advantage in AI-powered analytics')",
    "Partnership or validation (e.g., 'Partnership with Fortune 100 companies')"
  ],
  "risks": [
    "Competitive threat with specifics (e.g., 'Facing competition from Microsoft Azure')",
    "Market risk (e.g., 'Dependent on volatile crypto market')",
    "Regulatory or operational risk (e.g., 'Subject to increasing data privacy regulations')"
  ]${stockData ? ',\n  "stockAnalysis": {\n    "ticker": "' + stockData.ticker + '",\n    "trend": "' + stockData.trend + '",\n    "interpretation": "Brief 1-2 sentence interpretation of what the stock performance means for their business and buying behavior"\n  }' : ''}
}

ANALYSIS FRAMEWORK:
- Use Porter's Five Forces thinking
- Consider TAM/SAM/SOM
- Evaluate competitive moats
- Assess market timing
- Identify strategic risks${stockData ? '\n- IMPORTANT: Incorporate stock performance data into your analysis:\n  * Stock ticker: ' + stockData.ticker + '\n  * 1-week change: ' + (stockData.change1Week || 'N/A') + '\n  * 1-month change: ' + (stockData.change1Month || 'N/A') + '\n  * 1-year change: ' + (stockData.change1Year || 'N/A') + '\n  * Trend: ' + stockData.trend + '\n  * Signal: ' + stockData.urgencySignal : ''}`;

    const marketInput = `Analyze market position for this company:

${dossierText}

Provide strategic analysis covering:
1. Market share and competitive position
2. Sustainable competitive advantages
3. Growth trajectory and momentum
4. Industry trends and tailwinds
5. Competitive threats and market risks

Be specific with data points, percentages, and concrete examples where possible.`;

    const marketOutput = await cerebras.chat(marketPrompt, marketInput, 0.15);
    const marketDuration = Date.now() - marketStart;
    trace.push({
      agent: "Market Analyst",
      input: dossierText,
      output: marketOutput,
      duration: `${(marketDuration / 1000).toFixed(2)}s`,
    });

    // Agent 3: Tech Debt Analyzer
    console.log(`[${jobId}] Running Tech Debt agent...`);
    const techStart = Date.now();
    console.log(`[${jobId}] Running Tech Debt agent...`);
    const techPrompt = `You are a CTO-level technology consultant specializing in digital transformation and technical architecture.

TASK: Evaluate the company's technology maturity and modernization opportunities.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "techStackAnalysis": "3-4 sentences covering: (1) current technology choices and architecture, (2) level of technical sophistication, (3) cloud/AI adoption status, (4) technical debt indicators or modernization needs",
  "gaps": [
    "Specific technology gap (e.g., 'Limited AI/ML capabilities in product')",
    "Infrastructure gap (e.g., 'Legacy on-premise infrastructure, not cloud-native')",
    "Capability gap (e.g., 'No real-time data processing pipeline')",
    "Security/compliance gap (e.g., 'Needs SOC 2 Type II certification')"
  ],
  "urgencyScore": 65
}

SCORING GUIDE (0-100):
- 0-30: Modern stack, cloud-native, AI-enabled (low urgency)
- 31-60: Mixed stack, some modernization needed (medium urgency)
- 61-80: Legacy systems, significant tech debt (high urgency)
- 81-100: Critical technical debt, urgent modernization (very high urgency)

EVALUATION CRITERIA:
- Cloud adoption (AWS/Azure/GCP vs on-premise)
- Modern frameworks vs legacy
- AI/ML integration
- Microservices vs monolith
- DevOps maturity
- Data infrastructure
- Security posture`;

    const techInput = `Evaluate technology maturity for:

${dossierText}

Assess:
1. Technology stack modernity (based on listed technologies)
2. Cloud vs on-premise infrastructure
3. AI/ML adoption and capabilities
4. Digital transformation progress
5. Technical debt indicators
6. Modernization opportunities

Provide specific, actionable insights about their technology gaps and urgency for modernization.`;

    const techOutput = await cerebras.chat(techPrompt, techInput, 0.15);
    const techDuration = Date.now() - techStart;
    trace.push({
      agent: "Tech Debt",
      input: context.scrapedContent || "",
      output: techOutput,
      duration: `${(techDuration / 1000).toFixed(2)}s`,
    });

    // Agent 4: Financial Pressure
    console.log(`[${jobId}] Running Financial Pressure agent...`);
    const financialStart = Date.now();
    console.log(`[${jobId}] Running Financial Pressure agent...`);
    const financialPrompt = `You are a CFO-level financial analyst specializing in B2B buying signals and budget indicators.

TASK: Assess financial health and identify budget pressure signals that indicate buying urgency.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "financialSignals": [
    "Funding signal (e.g., 'Raised $100M Series C in Q4 2023')",
    "Growth signal (e.g., 'Revenue grew 150% YoY')",
    "Hiring signal (e.g., 'Expanded team by 200 employees in 2023')",
    "Profitability signal (e.g., 'Achieved profitability in Q2 2023')",
    "Budget indicator (e.g., 'Announced $50M budget for digital transformation')"
  ],
  "pressureScore": 45
}

SCORING GUIDE (0-100):
- 0-30: Strong financials, no urgency (low pressure to buy)
- 31-60: Healthy but growth-focused (medium pressure, strategic buys)
- 61-80: Budget constraints or efficiency focus (high pressure, ROI-driven)
- 81-100: Financial stress or urgent needs (very high pressure, must-have solutions)

BUYING SIGNALS TO IDENTIFY:
- Recent funding = budget available
- Rapid hiring = scaling pains
- Profitability push = efficiency focus
- Market expansion = new capabilities needed
- Leadership changes = new priorities
- Layoffs = cost optimization focus`;

    const financialInput = `Analyze financial health and buying signals for:

${dossierText}

Evaluate:
1. Funding status and runway
2. Revenue growth trajectory
3. Profitability status
4. Hiring trends (expansion vs contraction)
5. Budget indicators for new purchases
6. Financial pressure points

Identify signals that indicate budget availability and urgency to buy solutions.`;

    const financialOutput = await cerebras.chat(
      financialPrompt,
      financialInput,
      0.15
    );
    const financialDuration = Date.now() - financialStart;
    trace.push({
      agent: "Financial",
      input: JSON.stringify(context.newsData),
      output: financialOutput,
      duration: `${(financialDuration / 1000).toFixed(2)}s`,
    });

    // Agent 5: Risk & Objection
    console.log(`[${jobId}] Running Risk agent...`);
    const riskStart = Date.now();
    console.log(`[${jobId}] Running Risk agent...`);
    const riskPrompt = `You are a highly skeptical VP of Sales using reject-first reasoning. Your job is to find reasons NOT to pursue this account.

TASK: Identify 5 concrete, specific objections and deal-breakers.

CRITICAL: Return ONLY valid JSON array with NO additional text.

REQUIRED JSON STRUCTURE:
[
  {
    "objection": "Specific objection title (e.g., 'Strong internal data team may build in-house')",
    "explanation": "2-3 sentences explaining why this is a deal-breaker, with specific evidence from the company profile"
  },
  {
    "objection": "Second objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Third objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Fourth objection title",
    "explanation": "Detailed explanation with reasoning"
  },
  {
    "objection": "Fifth objection title",
    "explanation": "Detailed explanation with reasoning"
  }
]

OBJECTION CATEGORIES TO CONSIDER:
1. COMPETITIVE: "Already using competitor X" or "Strong relationship with vendor Y"
2. BUILD VS BUY: "Large engineering team likely to build in-house"
3. BUDGET: "Recent layoffs indicate budget constraints"
4. TIMING: "Just completed similar implementation"
5. FIT: "Not in our ideal customer profile"
6. PRIORITY: "Other initiatives taking precedence"
7. DECISION: "Complex buying process with many stakeholders"

Be ruthlessly critical. Find real reasons this deal could fail.`;

    const riskInput = `Find 5 specific reasons NOT to pursue this account:

COMPANY PROFILE:
${dossierText}

MARKET ANALYSIS:
${marketOutput}

TECHNOLOGY ASSESSMENT:
${techOutput}

FINANCIAL ANALYSIS:
${financialOutput}

Identify concrete deal-breakers such as:
- Competitive threats
- Budget constraints
- Technical barriers
- Timing issues
- Strategic misalignment
- Decision-making complexity

Be specific and reference actual details from the analyses above.`;

    const riskOutput = await cerebras.chat(riskPrompt, riskInput, 0.1);
    const riskDuration = Date.now() - riskStart;
    trace.push({
      agent: "Risk",
      input: "reject-first",
      output: riskOutput,
      duration: `${(riskDuration / 1000).toFixed(2)}s`,
    });

    // PRE-ARBITER: Hard-coded rejection rules (enforce BEFORE AI decision)
    console.log(`[${jobId}] Applying hard-coded rejection rules...`);
    
    const dossierData = typeof dossier === "object" ? dossier : {};
    const companyName = (dossierData.name || domain).toLowerCase();
    const employeeCountStr = dossierData.employeeCount || "";
    const revenueStr = dossierData.revenue || "";
    const industry = (dossierData.industry || "").toLowerCase();
    
    // Extract employee count number
    const employeeMatch = employeeCountStr.match(/[\d,]+/);
    const employeeCount = employeeMatch ? parseInt(employeeMatch[0].replace(/,/g, "")) : 0;
    
    // Extract revenue number (in millions)
    const revenueMatch = revenueStr.match(/\$?([\d.]+)\s*(B|billion|M|million)/i);
    let revenueMillions = 0;
    if (revenueMatch) {
      const amount = parseFloat(revenueMatch[1]);
      const unit = revenueMatch[2].toLowerCase();
      revenueMillions = unit.startsWith('b') ? amount * 1000 : amount;
    }
    
    // HARD REJECTION RULES
    let hardReject = false;
    let rejectReason = "";
    
    // Rule 1: Tech Giants (by name)
    const techGiants = [
      'amazon', 'microsoft', 'google', 'alphabet', 'apple', 'meta', 'facebook',
      'netflix', 'salesforce', 'oracle', 'sap', 'adobe', 'ibm', 'intel',
      'cisco', 'dell', 'hp', 'hewlett', 'nvidia', 'amd', 'qualcomm',
      'twitter', 'x corp', 'uber', 'airbnb', 'tesla', 'spacex'
    ];
    
    if (techGiants.some(giant => companyName.includes(giant))) {
      hardReject = true;
      rejectReason = "Tech giant with massive internal capabilities. Will never buy external prospect intelligence tools.";
    }
    
    // Rule 2: Consulting firms
    const consultingFirms = [
      'accenture', 'deloitte', 'mckinsey', 'bcg', 'bain', 'pwc',
      'kpmg', 'ey', 'ernst', 'cognizant', 'infosys', 'tcs', 'wipro',
      'capgemini', 'booz'
    ];
    
    if (!hardReject && consultingFirms.some(firm => companyName.includes(firm))) {
      hardReject = true;
      rejectReason = "Consulting/services firm that builds these tools internally. Not a buyer.";
    }
    
    // Rule 3: Financial giants
    const financialGiants = [
      'jpmorgan', 'goldman', 'morgan stanley', 'bank of america', 'wells fargo',
      'citigroup', 'blackrock', 'vanguard', 'state street', 'fidelity',
      'charles schwab', 'credit suisse', 'ubs', 'hsbc', 'barclays'
    ];
    
    if (!hardReject && financialGiants.some(firm => companyName.includes(firm))) {
      hardReject = true;
      rejectReason = "Major financial institution with proprietary systems and strict compliance. Not a fit.";
    }
    
    // Rule 4: Too large (50,000+ employees)
    if (!hardReject && employeeCount >= 50000) {
      hardReject = true;
      rejectReason = `Mega enterprise with ${employeeCount.toLocaleString()}+ employees. Too large, complex procurement, have internal solutions.`;
    }
    
    // Rule 5: Too large (revenue > $50B)
    if (!hardReject && revenueMillions >= 50000) {
      hardReject = true;
      rejectReason = `Mega enterprise with $${(revenueMillions/1000).toFixed(1)}B+ revenue. Too large for our ICP, have internal teams.`;
    }
    
    // Rule 6: Too small (<20 employees) - only reject very tiny companies
    if (!hardReject && employeeCount > 0 && employeeCount < 20) {
      hardReject = true;
      rejectReason = `Too small (${employeeCount} employees). Companies this size lack budget and sales infrastructure for our solution.`;
    }
    
    // Rule 7: Wrong industry
    const wrongIndustries = ['government', 'non-profit', 'ngo', 'education', 'university', 'school'];
    if (!hardReject && wrongIndustries.some(ind => industry.includes(ind))) {
      hardReject = true;
      rejectReason = `Wrong industry fit (${industry}). Not B2B sales-focused, incompatible buyer profile.`;
    }
    
    // If hard reject, skip AI arbiter and return IGNORE
    if (hardReject) {
      console.log(`[${jobId}] HARD REJECT: ${rejectReason}`);
      
      const hardRejectDecision = {
        verdict: "IGNORE" as const,
        decisionReasoning: rejectReason,
        confidenceScore: 95,
        signals: [],
        riskFactors: [
          "Company profile doesn't match DataVex ICP",
          "Automatic rejection criteria triggered",
          "Not a viable prospect for outreach"
        ]
      };
      
      trace.push({
        agent: "Arbiter",
        input: "hard rejection rules",
        output: JSON.stringify(hardRejectDecision),
      });
      
      const rejectionMessage = `This account does not fit DataVex's ideal customer profile. ${rejectReason} We recommend focusing on mid-market B2B companies (100-10,000 employees, $10M-$500M revenue) that need external prospect intelligence solutions.`;
      
      return {
        jobId,
        status: "completed",
        dossier: typeof dossier === "object" ? dossier : undefined,
        verdict: "IGNORE",
        decisionReasoning: hardRejectDecision.decisionReasoning,
        outreachMessage: rejectionMessage,
        bonusContent: {
          platform: "Internal",
          content: "No bonus content for rejected leads."
        },
        trace,
        sourceData: {
          scrapedContent: context.scrapedContent,
          newsData: context.newsData,
        },
      };
    }

    // Agent 6: Decision Arbiter (only runs if no hard reject)
    console.log(`[${jobId}] Running Decision Arbiter agent...`);
    const arbiterPrompt = `You are the VP of Strategy at DataVex making the FINAL go/no-go decision on this prospect.

TASK: Make a definitive PURSUE or IGNORE verdict by thoroughly analyzing ALL parameters.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "verdict": "PURSUE",
  "decisionReasoning": "4-5 sentences that: (1) acknowledge the main objections, (2) explain why they can be overcome or are acceptable risks, (3) highlight the strongest positive signals, (4) provide strategic rationale for the decision",
  "confidenceScore": 85,
  "signals": [
    "Strongest positive signal with specifics",
    "Second strongest signal",
    "Third positive indicator",
    "Fourth compelling reason"
  ],
  "riskFactors": [
    "Primary risk to monitor",
    "Secondary concern",
    "Third risk factor"
  ]
}

COMPREHENSIVE DECISION FRAMEWORK:

═══════════════════════════════════════════════════════════
AUTOMATIC REJECTION CRITERIA (Check FIRST)
═══════════════════════════════════════════════════════════
IMMEDIATELY IGNORE if company matches ANY of these:

1. TECH GIANTS & FAANG:
   - Amazon, Microsoft, Google, Apple, Meta/Facebook, Netflix
   - Alphabet, Salesforce, Oracle, SAP, Adobe
   - IBM, Intel, Cisco, Dell, HP
   → They have massive internal data/sales teams, will NEVER buy external tools

2. MEGA ENTERPRISES (50,000+ employees):
   - Fortune 50 companies
   - Global conglomerates with 50,000+ employees
   - Companies with $50B+ revenue
   → Too large, complex procurement, have internal solutions

3. CONSULTING/TECH SERVICE FIRMS:
   - Accenture, Deloitte, McKinsey, BCG, Bain
   - Cognizant, Infosys, TCS, Wipro
   → They BUILD these tools, won't buy them

4. FINANCIAL GIANTS:
   - JPMorgan, Goldman Sachs, Bank of America, Wells Fargo
   - BlackRock, Vanguard, State Street
   → Have proprietary internal systems, strict compliance

5. WRONG INDUSTRY FIT:
   - Government agencies
   - Non-profits and NGOs
   - Educational institutions (unless EdTech)
   - Healthcare providers (unless HealthTech)
   → Not B2B sales-focused, wrong buyer profile

IF ANY AUTOMATIC REJECTION CRITERIA MATCH:
- verdict: "IGNORE"
- confidenceScore: 95
- decisionReasoning: "Company falls into automatic rejection category: [reason]. They have internal capabilities/wrong fit for DataVex."

═══════════════════════════════════════════════════════════
IF NO AUTOMATIC REJECTION, PROCEED WITH FULL ANALYSIS:
═══════════════════════════════════════════════════════════

STEP 1: COMPANY SIZE & FIT ANALYSIS (Weight: 30%)
IDEAL CUSTOMER PROFILE:
- Company size: 50-20,000 employees (sweet spot: 500-5,000)
- Revenue: $5M-$5B (sweet spot: $50M-$500M)
- Growth stage: Series A to Public, focus on Series B-D and Mid-Market
- Industry: B2B SaaS, Tech, Professional Services, Manufacturing, E-commerce

SCORING:
✓ 90-100: Perfect ICP fit (500-5,000 employees, $50M-$500M revenue, B2B SaaS/Tech)
✓ 75-89: Strong fit (200-10,000 employees, $20M-$2B revenue, B2B focused)
✓ 60-74: Good fit (50-20,000 employees, $5M-$5B revenue, some B2B)
✗ 40-59: Marginal fit (outside ranges but not disqualifying)
✗ 0-39: Poor fit (very small <20 or mega >50,000)

STEP 2: MARKET POSITION ANALYSIS (Weight: 20%)
- Competitive advantages and market share
- Growth signals and momentum (hiring, funding, expansion)
- Industry trends (tailwinds vs headwinds)
- Strategic positioning

SCORING:
✓ 80-100: Market leader or fast-growing challenger with strong momentum
✓ 60-79: Solid position with growth signals
✗ 40-59: Stable but limited growth
✗ 0-39: Declining or struggling

STEP 3: TECHNOLOGY NEEDS ANALYSIS (Weight: 15%)
- Technology urgency score (from Tech Debt agent)
- Sales/marketing tech stack gaps
- Digital transformation needs

SCORING:
✓ 80-100: urgencyScore 70+, critical need for sales intelligence
✓ 60-79: urgencyScore 50-69, clear modernization needs
✗ 40-59: urgencyScore 30-49, some needs but not urgent
✗ 0-39: urgencyScore <30, modern stack, limited needs

STEP 4: FINANCIAL HEALTH & BUDGET (Weight: 20%)
- Budget availability (recent funding, profitability)
- Financial pressure score
- Buying signals (hiring sales team, expansion)

SCORING:
✓ 80-100: Recent funding or profitable + hiring sales team
✓ 60-79: Stable financials with growth budget
✗ 40-59: Break-even, limited budget
✗ 0-39: Layoffs, cost-cutting, no budget

STEP 5: RISK & OBJECTIONS ANALYSIS (Weight: 15%)
- Review ALL 5 objections from Risk Agent
- Classify each as FATAL or MANAGEABLE

FATAL OBJECTIONS (auto-reject if 3+):
- Already locked into competitor with multi-year contract
- No sales team or pure B2C business model
- Active bankruptcy or severe financial distress
- Regulatory barriers preventing any data usage
- Explicit company policy against external tools

MANAGEABLE OBJECTIONS (can overcome with strategy):
- Price sensitivity (can negotiate, show ROI)
- Timing concerns (can nurture, follow up later)
- Feature gaps (roadmap can address)
- Decision complexity (can navigate stakeholders)
- Competitive presence (can differentiate)
- Budget constraints (can demonstrate value)

SCORING:
✓ 80-100: 0-1 manageable objections, clear path forward
✓ 60-79: 2-3 manageable objections, some challenges
✗ 40-59: 4-5 manageable objections OR 1 fatal
✗ 0-39: 2+ fatal objections, insurmountable barriers

═══════════════════════════════════════════════════════════
FINAL DECISION LOGIC:
═══════════════════════════════════════════════════════════

1. Calculate weighted score from Steps 1-5
2. Count fatal objections

PURSUE if ALL of these are true:
- Weighted score ≥ 65/100
- Fatal objections ≤ 1
- Company size: 100-10,000 employees
- NOT in automatic rejection categories

IGNORE if ANY of these are true:
- Weighted score < 65/100
- Fatal objections ≥ 2
- Company size: <100 or >10,000 employees
- Matches automatic rejection criteria

CONFIDENCE SCORING:
- 90-100: Clear decision, strong signals
- 75-89: Good decision, mostly positive/negative
- 60-74: Moderate confidence, mixed signals
- 40-59: Low confidence, unclear
- 0-39: Very uncertain

BE RUTHLESS. DataVex targets Mid-Market B2B companies (100-10,000 employees), NOT tech giants or tiny startups.`;

    const arbiterInput = `Make FINAL verdict for this prospect. CHECK AUTOMATIC REJECTION CRITERIA FIRST!

═══════════════════════════════════════════════════════════
⚠️ STEP 0: CHECK AUTOMATIC REJECTION CRITERIA FIRST ⚠️
═══════════════════════════════════════════════════════════

Before any analysis, check if this company matches ANY automatic rejection:
1. Tech Giants (Amazon, Microsoft, Google, Apple, Meta, Netflix, Salesforce, Oracle, SAP, Adobe, IBM, etc.)
2. Mega Enterprises (50,000+ employees, Fortune 50, $50B+ revenue)
3. Consulting Firms (Accenture, Deloitte, McKinsey, BCG, Cognizant, Infosys, etc.)
4. Financial Giants (JPMorgan, Goldman Sachs, Bank of America, BlackRock, etc.)
5. Wrong Industry (Government, Non-profits, Education, Healthcare providers)

IF MATCH FOUND → IMMEDIATELY return verdict: "IGNORE" with 95 confidence

═══════════════════════════════════════════════════════════
COMPANY PROFILE TO EVALUATE:
═══════════════════════════════════════════════════════════
${dossierText}

CRITICAL CHECKS:
- Is this a FAANG/Tech Giant? → AUTO-REJECT
- Is this 50,000+ employees? → AUTO-REJECT  
- Is this a Fortune 50 company? → AUTO-REJECT
- Is this a consulting/services firm? → AUTO-REJECT
- Is employee count <100 or >10,000? → LIKELY REJECT

═══════════════════════════════════════════════════════════
IF NO AUTO-REJECTION, PROCEED WITH FULL ANALYSIS:
═══════════════════════════════════════════════════════════

STEP 1: COMPANY SIZE & FIT (30% weight)
${dossierText}

Evaluate:
- Employee count (IDEAL: 500-5,000 | ACCEPTABLE: 100-10,000 | REJECT: <100 or >10,000)
- Revenue scale (IDEAL: $50M-$200M | ACCEPTABLE: $10M-$500M | REJECT: <$10M or >$1B)
- Industry fit (IDEAL: B2B SaaS, Tech, Professional Services)
- Growth stage (IDEAL: Series B to Pre-IPO, Mid-Market)

Score this step: 0-100

═══════════════════════════════════════════════════════════
STEP 2: MARKET POSITION (20% weight)
═══════════════════════════════════════════════════════════
${marketOutput}

Evaluate:
- Growth momentum and signals
- Competitive position
- Industry trends
- Market share trajectory

Score this step: 0-100

═══════════════════════════════════════════════════════════
STEP 3: TECHNOLOGY NEEDS (15% weight)
═══════════════════════════════════════════════════════════
${techOutput}

Evaluate:
- Urgency score (GOOD: 60+, ACCEPTABLE: 40-59, POOR: <40)
- Sales/marketing tech gaps
- Digital transformation needs

Score this step: 0-100

═══════════════════════════════════════════════════════════
STEP 4: FINANCIAL HEALTH & BUDGET (20% weight)
═══════════════════════════════════════════════════════════
${financialOutput}

Evaluate:
- Budget availability signals
- Recent funding or profitability
- Hiring trends (sales team expansion?)
- Financial pressure score

Score this step: 0-100

═══════════════════════════════════════════════════════════
STEP 5: RISK & OBJECTIONS (15% weight)
═══════════════════════════════════════════════════════════
${riskOutput}

For EACH objection:
- Classify as FATAL or MANAGEABLE
- Count total fatal objections

Score this step: 0-100 (deduct 20 points per fatal objection)

═══════════════════════════════════════════════════════════
FINAL CALCULATION & DECISION:
═══════════════════════════════════════════════════════════

1. Calculate weighted score:
   (Step1 × 0.30) + (Step2 × 0.20) + (Step3 × 0.15) + (Step4 × 0.20) + (Step5 × 0.15)

2. Count fatal objections

3. Apply BALANCED decision logic:
   PURSUE if: Score ≥ 60 AND fatal objections ≤ 2 AND (has sales team OR B2B model)
   IGNORE if: Score < 60 OR fatal objections ≥ 3 OR (no sales team AND no B2B model)

4. Set confidence based on signal strength and clarity

DECISION PHILOSOPHY:
- Use ALL 8 agents' analyses - they researched market, tech, finance, risks
- PURSUE when reasonable fit with manageable challenges
- IGNORE when fundamental barriers or very poor fit
- Be balanced: not too lenient, not too strict
- Trust the comprehensive analysis, not just size rules

REMEMBER: Evaluate the FULL PICTURE from all agents, not just one metric.`;
    // Use deterministic decision engine instead of AI arbiter
    console.log(`[${jobId}] Running Deterministic Decision Engine...`);
    
    const marketData = parseSafe<any>(marketOutput);
    const techData = parseSafe<any>(techOutput);
    const financialData = parseSafe<any>(financialOutput);
    const riskData = parseSafe<any>(riskOutput);
    
    const decisionResult = makeDecision({
      dossier: typeof dossier === "object" ? dossier : undefined,
      marketAnalysis: marketData,
      techAnalysis: techData,
      financialAnalysis: financialData,
      riskAnalysis: riskData,
      stockData
    });
    
    const verdict = decisionResult.verdict;
    const decisionReasoning = decisionResult.reasoning;
    
    console.log(`[${jobId}] Decision: ${verdict} (Score: ${decisionResult.score}/100)`);
    console.log(`[${jobId}] Reasoning: ${decisionReasoning}`);
    console.log(`[${jobId}] Factor Breakdown:`, {
      financial: decisionResult.factors.financialHealth.score,
      tech: decisionResult.factors.techNeeds.score,
      industry: decisionResult.factors.industryFit.score,
      size: decisionResult.factors.companySize.score,
      market: decisionResult.factors.marketPosition.score
    });
    
    // Store decision in trace for transparency
    const decisionStart = Date.now();
    trace.push({
      agent: "Decision Engine",
      input: "all analyses",
      output: JSON.stringify(decisionResult, null, 2),
      duration: `${((Date.now() - decisionStart) / 1000).toFixed(2)}s`,
    });

    let outreachMessage = "";
    let bonusContent: BonusContent = {};

    if (verdict === "PURSUE") {
      // Agent 7: Outreach Generator
      console.log(`[${jobId}] Running Outreach agent...`);
      const outreachStart = Date.now();
      const outreachPrompt = `You are a top-performing B2B sales consultant crafting a personalized outreach message.

TASK: Write a compelling, personalized outreach email/LinkedIn message.

REQUIREMENTS:
- 3-4 paragraphs
- Professional but conversational tone
- Reference SPECIFIC company details (name, industry, recent developments)
- Highlight relevant value proposition for THEIR situation
- Include clear, low-friction call-to-action
- Avoid generic sales language
- Make it feel like you researched them specifically

STRUCTURE:
Paragraph 1: Hook - Reference something specific about their company
Paragraph 2: Value - Explain how DataVex solves their specific challenge
Paragraph 3: Proof - Brief credibility or relevant insight
Paragraph 4: CTA - Simple, clear next step

Return ONLY the message text. No JSON, no formatting markers, no subject line.`;

      const outreachInput = `Create personalized outreach for:

COMPANY: ${dossierText}

DECISION CONTEXT: ${decisionReasoning}

KEY POINTS TO REFERENCE:
- Their industry and market position
- Recent developments or growth signals
- Specific challenges they likely face
- How DataVex's prospect intelligence helps them

Make it feel personal and researched, not templated.`;

      outreachMessage = await cerebras.chat(outreachPrompt, outreachInput, 0.25);
      const outreachDuration = Date.now() - outreachStart;
      trace.push({
        agent: "Outreach",
        input: "company profile + analyses",
        output: outreachMessage,
        duration: `${(outreachDuration / 1000).toFixed(2)}s`,
      });

      // Agent 8: Bonus Content
      console.log(`[${jobId}] Running Bonus Content agent...`);
      const bonusStart = Date.now();
      const bonusPrompt = `You are a thought leadership content strategist creating LinkedIn post concepts.

TASK: Create an engaging LinkedIn post idea that relates to this company's industry or challenges.

CRITICAL: Return ONLY valid JSON with NO additional text.

REQUIRED JSON STRUCTURE:
{
  "platform": "LinkedIn",
  "content": "A compelling post concept (3-4 sentences) that: (1) starts with a hook related to their industry, (2) provides an insight or trend, (3) relates to prospect intelligence or sales, (4) ends with engagement question. Make it thought-provoking and shareable."
}

EXAMPLES OF GOOD CONCEPTS:
- "The fintech industry is moving at breakneck speed. Companies like [Company] are proving that [insight]. But here's what most sales teams miss: [intelligence angle]. How is your team keeping up?"
- "I analyzed 100 [industry] companies last month. The pattern was clear: [insight]. This is why prospect intelligence isn't optional anymore. What's your take?"

Make it relevant to THEIR industry and challenges.`;

      const bonusInput = `Create thought leadership concept related to:

COMPANY: ${dossierText}

INDUSTRY CONTEXT: ${marketOutput}

Create a LinkedIn post concept that:
- Relates to their industry or market
- Provides valuable insight
- Connects to prospect intelligence
- Encourages engagement

Make it specific to their industry, not generic.`;

      const bonusOutput = await cerebras.chat(bonusPrompt, bonusInput, 0.3);
      const parsedBonus = parseSafe<BonusContent>(bonusOutput);
      bonusContent = typeof parsedBonus === "object" ? parsedBonus : {};
      const bonusDuration = Date.now() - bonusStart;
      trace.push({
        agent: "Bonus Content",
        input: "company + industry context",
        output: bonusOutput,
        duration: `${(bonusDuration / 1000).toFixed(2)}s`,
      });
    } else {
      // Rejection report
      console.log(`[${jobId}] Running Rejection Report...`);
      const rejectionStart = Date.now();
      const rejectionPrompt = `You are a sales analyst writing a rejection summary.

TASK: Explain why this account should NOT be pursued.

REQUIREMENTS:
- 2-3 sentences
- Reference the main objections
- Be clear and professional
- Provide actionable reasoning

Return ONLY the text, no JSON, no formatting.`;

      const rejectionInput = `Explain rejection for:

COMPANY: ${dossierText}

OBJECTIONS: ${riskOutput}

DECISION: ${decisionReasoning}

Summarize why this is not a good fit for DataVex right now.`;

      outreachMessage = await cerebras.chat(
        rejectionPrompt,
        rejectionInput,
        0.15
      );
      const rejectionDuration = Date.now() - rejectionStart;
      trace.push({
        agent: "Rejection Report",
        input: "objections + decision",
        output: outreachMessage,
        duration: `${(rejectionDuration / 1000).toFixed(2)}s`,
      });
      bonusContent = {
        platform: "Internal",
        content: "No bonus content for ignored leads.",
      };
    }

    console.log(`[${jobId}] Pipeline completed successfully`);

    // Generate recommended solution based on all analyses
    const recommendedSolution = matchSolution(
      typeof dossier === "object" ? dossier : undefined,
      techData,
      marketData
    );
    
    console.log(`[${jobId}] Recommended solution: ${recommendedSolution.name}`);
    
    // Generate urgency factor
    const urgencyFactor = generateUrgencyFactor({
      stockData,
      financialAnalysis: financialData,
      techAnalysis: techData,
      marketAnalysis: marketData,
      dossier: typeof dossier === "object" ? dossier : undefined
    });
    
    console.log(`[${jobId}] Urgency factor: ${urgencyFactor}`);

    // Calculate accurate confidence score based on all data
    const confidenceResult = calculateConfidenceScore({
      verdict,
      decisionScore: decisionResult.score,
      decisionFactors: decisionResult.factors,
      dossier: typeof dossier === "object" ? dossier : undefined,
      marketAnalysis: marketData,
      techAnalysis: techData,
      financialAnalysis: financialData,
      riskAnalysis: riskData,
      stockData
    });
    
    console.log(`[${jobId}] Calculated confidence: ${confidenceResult.totalScore}% (Data: ${confidenceResult.breakdown.dataQuality}, Signals: ${confidenceResult.breakdown.signalStrength}, Risk: ${confidenceResult.breakdown.riskLevel}, Market: ${confidenceResult.breakdown.marketClarity}, Financial: ${confidenceResult.breakdown.financialClarity})`);

    // Update decision reasoning to use the calculated confidence score instead of decision score
    const finalDecisionReasoning = decisionReasoning.replace(
      /\b\d+%\s+confidence/i,
      `${confidenceResult.totalScore}% confidence`
    );

    return {
      jobId,
      status: "completed",
      dossier: typeof dossier === "object" ? dossier : undefined,
      verdict,
      confidenceScore: confidenceResult.totalScore,
      confidenceBreakdown: confidenceResult.breakdown,
      decisionReasoning: finalDecisionReasoning,
      outreachMessage,
      bonusContent,
      trace,
      stockData: stockData || undefined,
      recommendedSolution,
      urgencyFactor,
      decisionFactors: decisionResult.factors,
      decisionScore: decisionResult.score,
      marketAnalysis: marketData,
      sourceData: {
        scrapedContent: context.scrapedContent,
        newsData: context.newsData,
      },
    };
  } catch (error) {
    console.error(`[${jobId}] Pipeline failed:`, error);
    throw error;
  }
}
