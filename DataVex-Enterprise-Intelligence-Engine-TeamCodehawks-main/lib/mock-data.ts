export interface Analysis {
  id: string
  domain: string
  companyName: string
  date: string
  verdict: "pursue" | "reject" | "review"
  confidenceScore: number
  industry: string
  employeeCount: string
  revenue: string
  location: string
  summary: string
  technologies: string[]
  signals: string[]
  riskFactors: string[]
  outreachMessage: string
  bonusContent: string
  stockData?: {
    ticker: string
    latestClose: number
    change1Week: string | null
    change1Month: string | null
    change1Year: string | null
    trend: 'upward' | 'downward' | 'neutral'
    urgencySignal: string
  }
  recommendedSolution?: {
    name: string
    reason: string
    features: string[]
  }
  urgencyFactor?: string
  decisionFactors?: {
    financialHealth: { score: number; reason: string }
    techNeeds: { score: number; reason: string }
    industryFit: { score: number; reason: string }
    companySize: { score: number; reason: string }
    marketPosition: { score: number; reason: string }
  }
  decisionScore?: number
  marketAnalysis?: {
    growthSignals?: string[]
    risks?: string[]
  }
  dossier?: {
    name?: string
    employeeCount?: string
    revenue?: string
    industry?: string
    recentDevelopments?: string[]
  }
  agentTrace: AgentStep[]
  scores: {
    marketFit: number
    financialHealth: number
    techModernity: number
    growthPotential: number
    competitivePosition: number
  }
}

export interface AgentStep {
  agent: string
  status: "complete" | "running" | "pending"
  summary: string
  duration: string
  icon: string
}

export const mockAnalyses: Analysis[] = [
  {
    id: "job-001",
    domain: "stripe.com",
    companyName: "Stripe",
    date: "2026-02-18",
    verdict: "pursue",
    confidenceScore: 94,
    industry: "Fintech",
    employeeCount: "8,000+",
    revenue: "$14B+ (estimated)",
    location: "San Francisco, CA",
    summary: "Stripe is a global payments infrastructure company with massive growth trajectory. They are actively expanding their enterprise suite, making them an ideal prospect for DataVex intelligence solutions.",
    technologies: ["Ruby", "Go", "React", "AWS", "Kubernetes", "PostgreSQL"],
    signals: [
      "Recent Series I funding at $65B valuation",
      "Expanding into banking-as-a-service",
      "Hiring aggressively in enterprise sales",
      "New Treasury and Issuing products launched"
    ],
    riskFactors: [
      "Highly competitive market with PayPal, Adyen",
      "May build in-house intelligence tooling"
    ],
    outreachMessage: `Hi [Name],\n\nI noticed Stripe's impressive expansion into banking-as-a-service and your new Treasury product line. As you scale your enterprise sales motion, having deep prospect intelligence becomes critical.\n\nAt DataVex, we've built a multi-agent AI system that researches and qualifies prospects in seconds — the kind of intelligence that would complement Stripe's growth ambitions.\n\nWould love to show you how we're helping similar fintech leaders. Open to a 15-minute call?\n\nBest,\n[Your Name]`,
    bonusContent: "**Thought Leadership Idea:** \"Why Payment Companies Need AI-Driven Sales Intelligence\" — A whitepaper exploring how fintech firms can leverage multi-agent AI to identify enterprise clients faster, with Stripe's expansion as a case study.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Gathered company profile, recent news, funding history, and product launches.", duration: "2.3s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Identified fintech market positioning, competitor landscape, and growth trajectory.", duration: "1.8s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Modern tech stack with cloud-native architecture. Low tech debt risk.", duration: "1.2s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Strong financial position. Recent profitability milestone. No pressure signals.", duration: "1.5s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Low risk overall. Primary concern: may build in-house. Mitigated by speed-to-value proposition.", duration: "2.1s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — High confidence. Strong fit, financial stability, and active expansion.", duration: "0.8s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Personalized message crafted focusing on enterprise expansion angle.", duration: "1.4s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Thought leadership concept generated around fintech + AI intelligence.", duration: "1.1s", icon: "lightbulb" },
    ],
    scores: { marketFit: 92, financialHealth: 95, techModernity: 90, growthPotential: 88, competitivePosition: 85 },
  },
  {
    id: "job-002",
    domain: "notion.so",
    companyName: "Notion",
    date: "2026-02-17",
    verdict: "pursue",
    confidenceScore: 87,
    industry: "Productivity Software",
    employeeCount: "3,000+",
    revenue: "$1B+ ARR",
    location: "San Francisco, CA",
    summary: "Notion is experiencing rapid enterprise adoption with their AI features. Their sales team is scaling aggressively, creating a strong opportunity for DataVex prospect intelligence.",
    technologies: ["TypeScript", "React", "Kotlin", "AWS", "PostgreSQL", "Redis"],
    signals: [
      "Rapid enterprise adoption in Fortune 500",
      "AI-powered features driving growth",
      "Aggressive sales team expansion",
      "New enterprise admin and security features"
    ],
    riskFactors: [
      "Competitive workspace market",
      "May prioritize product-led growth over sales tools"
    ],
    outreachMessage: `Hi [Name],\n\nNotion's enterprise growth has been remarkable — especially the AI integration strategy. As your sales team scales to meet enterprise demand, DataVex can help identify and qualify prospects with multi-agent AI intelligence.\n\nWe'd love to share how we help high-growth SaaS companies accelerate pipeline.\n\nAvailable for a quick chat this week?\n\nBest,\n[Your Name]`,
    bonusContent: "**Thought Leadership Idea:** \"The Future of Enterprise Productivity: AI-Native Tools\" — exploring how companies like Notion are reshaping enterprise workflows.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Profiled company growth, product evolution, and market positioning.", duration: "2.1s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Strong market position in enterprise productivity space.", duration: "1.6s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Modern stack. Active investment in AI/ML capabilities.", duration: "1.3s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Healthy financials. Reached $1B ARR milestone.", duration: "1.4s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Moderate risk: product-led growth culture may resist sales tooling.", duration: "1.9s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Good fit with active enterprise sales scaling.", duration: "0.7s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Personalized around enterprise growth and AI strategy.", duration: "1.2s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Content concept on AI-native enterprise tools.", duration: "1.0s", icon: "lightbulb" },
    ],
    scores: { marketFit: 88, financialHealth: 85, techModernity: 92, growthPotential: 90, competitivePosition: 78 },
  },
  {
    id: "job-003",
    domain: "blockbuster.com",
    companyName: "Blockbuster",
    date: "2026-02-16",
    verdict: "reject",
    confidenceScore: 96,
    industry: "Entertainment Retail",
    employeeCount: "1 (franchise)",
    revenue: "Minimal",
    location: "Bend, OR",
    summary: "Blockbuster is effectively defunct as a business entity. Only one franchise location remains as a tourist attraction. No viable sales opportunity.",
    technologies: ["Legacy POS", "Basic web hosting"],
    signals: [
      "Single remaining location operates as novelty",
      "No corporate structure for B2B purchases",
      "Brand exists primarily as nostalgia"
    ],
    riskFactors: [
      "No decision-making authority",
      "No budget for enterprise solutions",
      "No growth trajectory"
    ],
    outreachMessage: "No outreach recommended. This company does not meet minimum viability criteria for pursuit.",
    bonusContent: "**Case Study Idea:** \"Lessons from Blockbuster: Why Market Intelligence Matters\" — a retrospective on how lack of data-driven decisions led to one of history's most famous business failures.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Identified single franchise location. No corporate entity.", duration: "1.8s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Entertainment retail market has fully shifted to streaming.", duration: "1.2s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Legacy systems. No meaningful technology investment.", duration: "0.8s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "No viable financial entity. Revenue from tourism only.", duration: "0.9s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "CRITICAL: No viable prospect. Recommend immediate rejection.", duration: "0.6s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "REJECT — Unanimous. No viable business entity for pursuit.", duration: "0.4s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "No outreach generated. Rejection confirmed.", duration: "0.3s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Retrospective case study concept generated.", duration: "0.9s", icon: "lightbulb" },
    ],
    scores: { marketFit: 5, financialHealth: 3, techModernity: 2, growthPotential: 1, competitivePosition: 8 },
  },
  {
    id: "job-004",
    domain: "shopify.com",
    companyName: "Shopify",
    date: "2026-02-15",
    verdict: "pursue",
    confidenceScore: 89,
    industry: "E-commerce Platform",
    employeeCount: "11,000+",
    revenue: "$7.5B+",
    location: "Ottawa, Canada",
    summary: "Shopify's continued expansion into enterprise commerce and B2B markets presents a strong opportunity. Their investment in AI-powered merchant tools aligns well with DataVex capabilities.",
    technologies: ["Ruby on Rails", "React", "Go", "GCP", "MySQL", "Kafka"],
    signals: [
      "Enterprise commerce expansion (Shopify Plus)",
      "AI integration across merchant tools",
      "B2B commerce push",
      "New checkout extensibility platform"
    ],
    riskFactors: [
      "Strong internal data science team",
      "May view as competitive to Shopify Audiences"
    ],
    outreachMessage: `Hi [Name],\n\nShopify's push into enterprise and B2B commerce is exciting. As you scale the Plus sales motion, DataVex can help your team identify and qualify high-value merchants faster with AI-driven prospect intelligence.\n\nWould love to explore synergies. Time for a brief call?\n\nBest,\n[Your Name]`,
    bonusContent: "**Thought Leadership:** \"AI-Powered Commerce Intelligence: How E-commerce Platforms Win Enterprise\" — exploring the intersection of AI and enterprise commerce sales.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Comprehensive profile of Shopify's enterprise strategy.", duration: "2.4s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Dominant position in SMB, growing in enterprise.", duration: "1.7s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Modernized stack after Tobi's performance push.", duration: "1.4s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Strong financials. Profitable and growing.", duration: "1.3s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Moderate risk: strong internal capabilities.", duration: "1.8s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Enterprise expansion creates clear opportunity.", duration: "0.7s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Enterprise commerce and B2B angle emphasized.", duration: "1.3s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "AI commerce intelligence concept.", duration: "1.0s", icon: "lightbulb" },
    ],
    scores: { marketFit: 86, financialHealth: 90, techModernity: 82, growthPotential: 88, competitivePosition: 92 },
  },
  {
    id: "job-005",
    domain: "linear.app",
    companyName: "Linear",
    date: "2026-02-14",
    verdict: "pursue",
    confidenceScore: 91,
    industry: "Developer Tools",
    employeeCount: "100+",
    revenue: "$50M+ ARR (estimated)",
    location: "San Francisco, CA",
    summary: "Linear is one of the fastest-growing developer tools companies with exceptional product-market fit. Their enterprise tier is gaining traction, creating a timely sales opportunity.",
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Vercel"],
    signals: [
      "Explosive growth in enterprise adoption",
      "Best-in-class developer experience",
      "Enterprise features rollout",
      "Fundraising signals strong investor confidence"
    ],
    riskFactors: [
      "Small team may not prioritize vendor relationships",
      "Product-led growth may reduce need for sales intelligence"
    ],
    outreachMessage: `Hi [Name],\n\nLinear's growth trajectory is impressive — the enterprise adoption numbers speak for themselves. DataVex can help your lean team identify the highest-value prospects without adding headcount.\n\nQuick 10-minute demo?\n\nBest,\n[Your Name]`,
    bonusContent: "**Blog Post Idea:** \"How Developer Tool Companies Can Scale Enterprise Sales with AI\" — featuring Linear-like growth patterns.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Profiled rapid growth, product differentiation, and market position.", duration: "1.9s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Strong position in developer tools. Displacing Jira.", duration: "1.5s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Exceptionally modern tech stack. Zero legacy concerns.", duration: "0.9s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Well-funded with strong ARR growth.", duration: "1.1s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Low risk. Lean team is actually a selling point for our value prop.", duration: "1.6s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Excellent fit for lean-team intelligence solution.", duration: "0.6s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Lean team efficiency angle resonates.", duration: "1.1s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Blog concept on dev tools enterprise scaling.", duration: "0.8s", icon: "lightbulb" },
    ],
    scores: { marketFit: 93, financialHealth: 80, techModernity: 98, growthPotential: 95, competitivePosition: 88 },
  },
  {
    id: "job-006",
    domain: "pets.com",
    companyName: "Pets.com",
    date: "2026-02-13",
    verdict: "reject",
    confidenceScore: 99,
    industry: "E-commerce (Defunct)",
    employeeCount: "0",
    revenue: "$0",
    location: "N/A",
    summary: "Pets.com was a dot-com era casualty. The company no longer exists. Domain is parked. No viable prospect.",
    technologies: [],
    signals: ["Domain is parked", "Company dissolved in 2000"],
    riskFactors: ["Company does not exist"],
    outreachMessage: "No outreach. Company is defunct.",
    bonusContent: "**Historical Analysis:** \"Dot-Com Lessons: Why Data-Driven Decisions Could Have Saved Pets.com\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Company defunct since 2000.", duration: "0.8s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "No market presence.", duration: "0.4s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "No technology to analyze.", duration: "0.3s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "No financial entity.", duration: "0.3s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "CRITICAL: Company does not exist.", duration: "0.2s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "REJECT — Company is defunct.", duration: "0.2s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "No outreach.", duration: "0.1s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Historical case study concept.", duration: "0.5s", icon: "lightbulb" },
    ],
    scores: { marketFit: 0, financialHealth: 0, techModernity: 0, growthPotential: 0, competitivePosition: 0 },
  },
  {
    id: "job-007",
    domain: "vercel.com",
    companyName: "Vercel",
    date: "2026-02-12",
    verdict: "pursue",
    confidenceScore: 93,
    industry: "Developer Infrastructure",
    employeeCount: "1,000+",
    revenue: "$200M+ ARR (estimated)",
    location: "San Francisco, CA",
    summary: "Vercel is the leading frontend cloud platform with strong enterprise traction. Their rapid growth and expansion into enterprise features makes them an excellent prospect.",
    technologies: ["Next.js", "TypeScript", "Go", "Rust", "AWS", "Turborepo"],
    signals: [
      "Enterprise platform adoption accelerating",
      "Major framework ecosystem (Next.js)",
      "Enterprise security and compliance features",
      "Strong developer community moat"
    ],
    riskFactors: [
      "Sophisticated internal tooling",
      "May view intelligence as internal capability"
    ],
    outreachMessage: `Hi [Name],\n\nVercel's enterprise growth is remarkable — the platform is becoming the default for modern web teams. As enterprise deals get larger and more complex, DataVex can help your team identify and qualify the highest-value prospects automatically.\n\nWould love to connect and share what we're seeing in the developer infrastructure space.\n\nBest,\n[Your Name]`,
    bonusContent: "**Whitepaper:** \"Developer Infrastructure and Enterprise Sales: The Intelligence Gap\" — how dev infra companies can leverage AI for enterprise go-to-market.",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Comprehensive profile of enterprise platform growth.", duration: "2.2s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Market leader in frontend infrastructure.", duration: "1.6s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Cutting-edge stack. Rust, Go, advanced infrastructure.", duration: "1.1s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Well-funded, growing rapidly toward IPO.", duration: "1.3s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Moderate: sophisticated team may prefer building in-house.", duration: "1.7s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Strong enterprise growth creates clear need.", duration: "0.6s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Enterprise growth and automation angle.", duration: "1.2s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Dev infra enterprise intelligence whitepaper.", duration: "0.9s", icon: "lightbulb" },
    ],
    scores: { marketFit: 91, financialHealth: 85, techModernity: 97, growthPotential: 92, competitivePosition: 88 },
  },
  {
    id: "job-008",
    domain: "databricks.com",
    companyName: "Databricks",
    date: "2026-02-11",
    verdict: "pursue",
    confidenceScore: 88,
    industry: "Data & AI Infrastructure",
    employeeCount: "7,000+",
    revenue: "$2.4B+ ARR",
    location: "San Francisco, CA",
    summary: "Databricks is the leading data lakehouse platform experiencing explosive enterprise growth. Their massive sales organization would benefit significantly from prospect intelligence.",
    technologies: ["Scala", "Python", "Spark", "Delta Lake", "Kubernetes", "AWS/Azure/GCP"],
    signals: [
      "Explosive ARR growth approaching IPO",
      "Massive enterprise sales organization",
      "Expanding into AI/ML tooling",
      "Strategic acquisitions in data governance"
    ],
    riskFactors: [
      "Large internal data team could build similar tooling",
      "Complex enterprise sales cycle"
    ],
    outreachMessage: `Hi [Name],\n\nDatabricks' trajectory to $2.4B ARR is extraordinary. With your massive and growing enterprise sales org, the ability to qualify and prioritize prospects with AI-driven intelligence could be a major accelerator.\n\nDataVex is purpose-built for this — would love to show you the system.\n\nBest,\n[Your Name]`,
    bonusContent: "**Report Idea:** \"The Data Intelligence Paradox: Why Data Companies Still Struggle with Sales Intelligence\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Profiled massive growth trajectory and enterprise strategy.", duration: "2.5s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Dominant in data lakehouse category.", duration: "1.8s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "World-class data infrastructure.", duration: "1.2s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Strong financials. Pre-IPO momentum.", duration: "1.4s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Moderate: sophisticated internal capabilities.", duration: "1.9s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Massive sales org = massive opportunity.", duration: "0.7s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Sales org scaling angle.", duration: "1.3s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Data company sales intelligence paradox.", duration: "1.0s", icon: "lightbulb" },
    ],
    scores: { marketFit: 85, financialHealth: 90, techModernity: 94, growthPotential: 92, competitivePosition: 80 },
  },
  {
    id: "job-009",
    domain: "myspace.com",
    companyName: "Myspace",
    date: "2026-02-10",
    verdict: "reject",
    confidenceScore: 92,
    industry: "Social Media (Legacy)",
    employeeCount: "~50",
    revenue: "Minimal",
    location: "Los Angeles, CA",
    summary: "Myspace has pivoted to a music-focused social platform but with minimal market presence. No meaningful enterprise opportunity exists.",
    technologies: ["PHP", "Legacy infrastructure"],
    signals: [
      "Minimal active user base",
      "No enterprise products or services",
      "Brand associated with obsolescence"
    ],
    riskFactors: [
      "No budget for enterprise software",
      "No growth trajectory",
      "Brand perception challenges"
    ],
    outreachMessage: "No outreach recommended. Insufficient enterprise opportunity.",
    bonusContent: "**Case Study:** \"From 100M Users to Obscurity: The Myspace Story and What It Teaches About Market Intelligence\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Identified minimal current operations.", duration: "1.5s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Negligible market presence in social media.", duration: "1.0s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Legacy PHP stack. Minimal investment.", duration: "0.7s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Minimal revenue. No growth indicators.", duration: "0.8s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "HIGH RISK: No viable enterprise opportunity.", duration: "0.5s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "REJECT — No viable prospect.", duration: "0.3s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "No outreach generated.", duration: "0.2s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Historical analysis concept.", duration: "0.6s", icon: "lightbulb" },
    ],
    scores: { marketFit: 10, financialHealth: 8, techModernity: 5, growthPotential: 3, competitivePosition: 12 },
  },
  {
    id: "job-010",
    domain: "figma.com",
    companyName: "Figma",
    date: "2026-02-09",
    verdict: "pursue",
    confidenceScore: 90,
    industry: "Design Tools",
    employeeCount: "1,500+",
    revenue: "$600M+ ARR",
    location: "San Francisco, CA",
    summary: "Figma dominates the collaborative design space with incredible enterprise penetration. Their sales expansion and enterprise features make them a strong prospect.",
    technologies: ["TypeScript", "WebAssembly", "C++", "React", "AWS"],
    signals: [
      "Dominant market position in design tools",
      "Strong enterprise adoption",
      "Dev Mode and enterprise features expansion",
      "Post-Adobe deal independence strengthened brand"
    ],
    riskFactors: [
      "May prefer product-led growth approach",
      "Sophisticated internal tooling culture"
    ],
    outreachMessage: `Hi [Name],\n\nFigma's enterprise momentum is incredible — Dev Mode and the enterprise suite are clearly resonating. As your sales team targets larger accounts, DataVex can help prioritize and qualify the prospects most likely to convert.\n\nHappy to share a quick demo. Coffee chat?\n\nBest,\n[Your Name]`,
    bonusContent: "**Article Idea:** \"Design Tools to Enterprise Platform: How Figma's Go-to-Market Evolution Mirrors Industry Trends\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Comprehensive profile of design tool dominance.", duration: "2.0s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Clear market leader in collaborative design.", duration: "1.5s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Innovative WebAssembly-based architecture.", duration: "1.1s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Strong ARR growth. Independent and well-funded.", duration: "1.2s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Low-moderate risk. PLG culture is primary concern.", duration: "1.7s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Strong enterprise expansion opportunity.", duration: "0.6s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Enterprise expansion and Dev Mode angle.", duration: "1.2s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "PLG to enterprise evolution article.", duration: "0.9s", icon: "lightbulb" },
    ],
    scores: { marketFit: 88, financialHealth: 87, techModernity: 95, growthPotential: 86, competitivePosition: 90 },
  },
  {
    id: "job-011",
    domain: "snowflake.com",
    companyName: "Snowflake",
    date: "2026-02-08",
    verdict: "review",
    confidenceScore: 72,
    industry: "Cloud Data Platform",
    employeeCount: "6,800+",
    revenue: "$3.4B+",
    location: "Bozeman, MT",
    summary: "Snowflake is a major cloud data platform with significant enterprise presence. However, their internal data capabilities and recent leadership changes introduce uncertainty.",
    technologies: ["Java", "C++", "Python", "Snowpark", "AWS/Azure/GCP"],
    signals: [
      "Large enterprise customer base",
      "Expanding AI/ML capabilities",
      "Data sharing marketplace growth"
    ],
    riskFactors: [
      "Recent CEO transition may shift priorities",
      "Strong internal analytics capabilities",
      "May view as redundant to existing tools"
    ],
    outreachMessage: `Hi [Name],\n\nSnowflake's data marketplace and AI capabilities are impressive. We're curious whether your sales team has explored AI-driven prospect intelligence to complement your existing data capabilities.\n\nWould a brief conversation make sense?\n\nBest,\n[Your Name]`,
    bonusContent: "**Analysis:** \"Cloud Data Platforms and the Sales Intelligence Opportunity\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Profiled enterprise position and recent changes.", duration: "2.3s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Strong but competitive cloud data market.", duration: "1.7s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Advanced cloud-native architecture.", duration: "1.2s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Strong revenue but leadership transition.", duration: "1.5s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "MODERATE-HIGH: Internal capabilities + leadership change.", duration: "2.0s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "REVIEW — Wait for leadership direction to clarify.", duration: "0.8s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Softer approach given uncertainty.", duration: "1.3s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Cloud data sales intelligence analysis.", duration: "1.0s", icon: "lightbulb" },
    ],
    scores: { marketFit: 75, financialHealth: 82, techModernity: 88, growthPotential: 70, competitivePosition: 78 },
  },
  {
    id: "job-012",
    domain: "anthropic.com",
    companyName: "Anthropic",
    date: "2026-02-07",
    verdict: "pursue",
    confidenceScore: 86,
    industry: "AI Research & Safety",
    employeeCount: "1,200+",
    revenue: "$800M+ ARR (estimated)",
    location: "San Francisco, CA",
    summary: "Anthropic is at the forefront of AI safety and enterprise AI. Their rapid growth and enterprise API adoption create a compelling prospect opportunity.",
    technologies: ["Python", "JAX", "Rust", "Kubernetes", "GCP", "AWS"],
    signals: [
      "Explosive enterprise API growth",
      "Claude model family gaining market share",
      "Enterprise partnerships accelerating",
      "Massive funding rounds"
    ],
    riskFactors: [
      "Hyper-focused on AI — may build everything in-house",
      "Rapidly evolving priorities"
    ],
    outreachMessage: `Hi [Name],\n\nAnthropic's enterprise traction with Claude is extraordinary. As your go-to-market motion scales, DataVex can help identify and prioritize the enterprises most likely to benefit from Claude's capabilities.\n\nWould love to explore how we can help accelerate your pipeline.\n\nBest,\n[Your Name]`,
    bonusContent: "**Thought Leadership:** \"AI Companies Selling to Enterprises: The Intelligence Advantage\"",
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: "Profiled AI market position and enterprise growth.", duration: "2.1s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Top-tier position in enterprise AI.", duration: "1.6s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Cutting-edge AI infrastructure.", duration: "1.0s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Extremely well-funded. High growth.", duration: "1.2s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Moderate: may prefer in-house solutions.", duration: "1.8s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: "PURSUE — Enterprise growth creates clear opportunity.", duration: "0.6s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Enterprise scaling and pipeline acceleration angle.", duration: "1.2s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "AI enterprise GTM thought leadership.", duration: "0.9s", icon: "lightbulb" },
    ],
    scores: { marketFit: 82, financialHealth: 90, techModernity: 99, growthPotential: 95, competitivePosition: 75 },
  },
]

export function getAnalysis(id: string): Analysis | undefined {
  return mockAnalyses.find((a) => a.id === id)
}

export function getAnalysisByDomain(domain: string): Analysis | undefined {
  const normalized = normalizeDomain(domain)
  return mockAnalyses.find((a) => normalizeDomain(a.domain) === normalized)
}

export const industryStats = [
  { name: "Fintech", count: 1 },
  { name: "Developer Tools", count: 2 },
  { name: "AI & ML", count: 2 },
  { name: "E-commerce", count: 2 },
  { name: "Data Infrastructure", count: 2 },
  { name: "Productivity", count: 1 },
  { name: "Design Tools", count: 1 },
  { name: "Legacy/Defunct", count: 1 },
]

export const verdictStats = [
  { name: "Pursue", value: 8, fill: "var(--success)" },
  { name: "Reject", value: 3, fill: "var(--warning)" },
  { name: "Review", value: 1, fill: "var(--chart-3)" },
]

export const technologyWeights = [
  { name: "TypeScript", weight: 5 },
  { name: "React", weight: 5 },
  { name: "Python", weight: 4 },
  { name: "Go", weight: 3 },
  { name: "Rust", weight: 2 },
  { name: "AWS", weight: 5 },
  { name: "Kubernetes", weight: 4 },
  { name: "PostgreSQL", weight: 3 },
  { name: "Ruby", weight: 2 },
  { name: "GCP", weight: 3 },
  { name: "Java", weight: 2 },
  { name: "Kafka", weight: 2 },
]

export const agents = [
  {
    name: "Researcher",
    description: "Gathers company profile, news, funding history, and product information from public sources.",
    icon: "search",
    color: "#6366f1",
  },
  {
    name: "Market Analyst",
    description: "Evaluates market positioning, competitive landscape, and growth trajectory.",
    icon: "trending-up",
    color: "#14b8a6",
  },
  {
    name: "Tech Debt Analyzer",
    description: "Assesses technology stack modernity, engineering culture, and technical health.",
    icon: "cpu",
    color: "#f59e0b",
  },
  {
    name: "Financial Pressure",
    description: "Analyzes financial health, funding status, and budget indicators.",
    icon: "dollar-sign",
    color: "#10b981",
  },
  {
    name: "Risk & Objection",
    description: "Actively argues against pursuit. Identifies deal-breakers and red flags.",
    icon: "shield",
    color: "#ef4444",
  },
  {
    name: "Decision Arbiter",
    description: "Weighs all agent inputs. Makes final pursue/reject/review decision.",
    icon: "gavel",
    color: "#8b5cf6",
  },
  {
    name: "Outreach Generator",
    description: "Crafts personalized outreach messages based on analysis findings.",
    icon: "mail",
    color: "#06b6d4",
  },
  {
    name: "Bonus Content",
    description: "Generates thought-leadership content ideas related to the prospect.",
    icon: "lightbulb",
    color: "#f97316",
  },
]

export async function simulateAnalysis(domain: string): Promise<Analysis> {
  await new Promise((r) => setTimeout(r, 2000))
  const existing = getAnalysisByDomain(domain)
  if (existing) return existing
  return generateAnalysisFromDomain(domain)
}

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
}

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function toCompanyName(domain: string): string {
  const base = normalizeDomain(domain).split(".")[0] || "Company"
  return base
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function generateAnalysisFromDomain(domainInput: string): Analysis {
  const domain = normalizeDomain(domainInput)
  const seed = hash(domain)
  const verdicts: Analysis["verdict"][] = ["pursue", "review", "reject"]
  const verdict = verdicts[seed % verdicts.length]
  const confidenceScore = 65 + (seed % 31)
  const marketFit = 45 + (seed % 50)
  const financialHealth = 40 + ((seed >> 1) % 55)
  const techModernity = 45 + ((seed >> 2) % 50)
  const growthPotential = 42 + ((seed >> 3) % 53)
  const competitivePosition = 38 + ((seed >> 4) % 57)
  const companyName = toCompanyName(domain)
  const now = new Date().toISOString().slice(0, 10)

  const recommendation =
    verdict === "pursue"
      ? "recommended for active outreach"
      : verdict === "review"
      ? "flagged for human review before outreach"
      : "not recommended at this stage"

  return {
    id: `job-${seed}`,
    domain,
    companyName,
    date: now,
    verdict,
    confidenceScore,
    industry: "General Business",
    employeeCount: "Unknown",
    revenue: "Undisclosed",
    location: "Unknown",
    summary: `${companyName} was analyzed from the submitted domain (${domain}) and is currently ${recommendation}. This is a generated preview while live backend intelligence is pending.`,
    technologies: ["Web Stack", "Cloud Services", "Analytics"],
    signals: [
      `Domain footprint identified for ${domain}`,
      "Digital presence indicates active business operations",
      `Composite confidence score: ${confidenceScore}%`
    ],
    riskFactors: [
      "Limited verified public financial data in preview mode",
      "Requires live workflow run for final go/no-go decision"
    ],
    outreachMessage: `Hi [Name],\n\nWe reviewed ${companyName} and identified potential opportunities where DataVex can support AI-driven prospect intelligence and outreach prioritization.\n\nIf relevant, we can share a focused 15-minute walkthrough.\n\nBest,\n[Your Name]`,
    bonusContent: `LinkedIn idea: "What we learned from analyzing ${companyName}'s digital signals and how teams can convert weak signals into pipeline decisions."`,
    agentTrace: [
      { agent: "Researcher", status: "complete", summary: `Normalized and profiled domain: ${domain}`, duration: "1.1s", icon: "search" },
      { agent: "Market Analyst", status: "complete", summary: "Generated market fit and growth proxy signals.", duration: "0.9s", icon: "trending-up" },
      { agent: "Tech Debt Analyzer", status: "complete", summary: "Estimated stack maturity from public footprint.", duration: "0.8s", icon: "cpu" },
      { agent: "Financial Pressure", status: "complete", summary: "Computed confidence with limited financial visibility.", duration: "0.7s", icon: "dollar-sign" },
      { agent: "Risk & Objection", status: "complete", summary: "Applied reject-first objections in preview mode.", duration: "0.8s", icon: "shield" },
      { agent: "Decision Arbiter", status: "complete", summary: `${verdict.toUpperCase()} decision generated for preview.`, duration: "0.5s", icon: "gavel" },
      { agent: "Outreach Generator", status: "complete", summary: "Prepared tailored outreach draft.", duration: "0.6s", icon: "mail" },
      { agent: "Bonus Content", status: "complete", summary: "Prepared thought-leadership angle.", duration: "0.5s", icon: "lightbulb" }
    ],
    scores: {
      marketFit,
      financialHealth,
      techModernity,
      growthPotential,
      competitivePosition
    }
  }
}
