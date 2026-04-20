/**
 * Company Knowledge Base
 * Fallback data for well-known companies when AI doesn't provide accurate info
 */

export interface CompanyKnowledge {
  name: string;
  description: string;
  industry: string;
  size: string;
  employeeCount: string;
  revenue: string;
  location: string;
  technologies: string[];
  leadership: string[];
  recentDevelopments: string[];
}

export const COMPANY_DATABASE: Record<string, CompanyKnowledge> = {
  'stripe.com': {
    name: 'Stripe, Inc.',
    description: 'Stripe is a financial infrastructure platform for businesses. They provide payment processing software and APIs for e-commerce websites and mobile applications. Stripe powers millions of businesses worldwide with tools for payments, billing, and financial management.',
    industry: 'Payment Processing & Financial Technology',
    size: 'Enterprise (5000+)',
    employeeCount: '8,000',
    revenue: '$14B (2023)',
    location: 'San Francisco, CA, USA',
    technologies: ['Ruby', 'Go', 'React', 'TypeScript', 'AWS', 'PostgreSQL', 'Kubernetes', 'Redis'],
    leadership: ['Patrick Collison - CEO', 'John Collison - President', 'Dhivya Suryadevara - CFO'],
    recentDevelopments: [
      'Expanded into embedded finance with Stripe Capital',
      'Launched Stripe Tax for automated tax compliance',
      'Processing over $1 trillion in payments annually',
      'Acquired Okay for identity verification'
    ]
  },
  'notion.so': {
    name: 'Notion Labs Inc.',
    description: 'Notion is an all-in-one workspace platform that combines notes, docs, wikis, and project management. Used by millions of individuals and teams worldwide for knowledge management and collaboration. Known for its flexible, block-based interface.',
    industry: 'Productivity Software & Collaboration Tools',
    size: 'Mid-Market (500-5000)',
    employeeCount: '600',
    revenue: '$120M ARR (2023)',
    location: 'San Francisco, CA, USA',
    technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Redis', 'Elasticsearch'],
    leadership: ['Ivan Zhao - CEO', 'Simon Last - COO', 'Akshay Kothari - CPO'],
    recentDevelopments: [
      'Reached $10B valuation in 2023',
      'Launched Notion AI with GPT integration',
      'Surpassed 30M users globally',
      'Expanded enterprise features and security'
    ]
  },
  'shopify.com': {
    name: 'Shopify Inc.',
    description: 'Shopify is a leading e-commerce platform that enables businesses to create online stores and sell products. Powers over 4 million merchants worldwide with tools for payments, marketing, shipping, and customer engagement.',
    industry: 'E-commerce Platform & SaaS',
    size: 'Enterprise (5000+)',
    employeeCount: '11,600',
    revenue: '$7.1B (2023)',
    location: 'Ottawa, ON, Canada',
    technologies: ['Ruby on Rails', 'React', 'TypeScript', 'MySQL', 'Redis', 'Kubernetes', 'GCP'],
    leadership: ['Tobi Lütke - CEO', 'Harley Finkelstein - President', 'Jeff Hoffmeister - CFO'],
    recentDevelopments: [
      'Launched Shopify Magic AI tools',
      'Expanded B2B commerce capabilities',
      'Acquired Deliverr for fulfillment network',
      'GMV exceeded $200B annually'
    ]
  },
  'figma.com': {
    name: 'Figma, Inc.',
    description: 'Figma is a collaborative web-based design tool for interface design, prototyping, and design systems. Used by designers and product teams at thousands of companies. Known for real-time collaboration and browser-based accessibility.',
    industry: 'Design Software & Collaboration',
    size: 'Mid-Market (500-5000)',
    employeeCount: '1,000',
    revenue: '$600M ARR (2023)',
    location: 'San Francisco, CA, USA',
    technologies: ['TypeScript', 'React', 'WebAssembly', 'C++', 'AWS', 'PostgreSQL', 'Redis'],
    leadership: ['Dylan Field - CEO', 'Evan Wallace - CTO', 'Sho Kuwamoto - Head of Product'],
    recentDevelopments: [
      'Adobe acquisition deal terminated (2023)',
      'Launched FigJam for whiteboarding',
      'Introduced Figma AI features',
      'Expanded dev mode for developer handoff'
    ]
  },
  'slack.com': {
    name: 'Slack Technologies (Salesforce)',
    description: 'Slack is a business communication platform offering persistent chat rooms, private groups, and direct messaging. Acquired by Salesforce in 2021. Used by millions of professionals for team collaboration and workflow automation.',
    industry: 'Business Communication & Collaboration',
    size: 'Enterprise (5000+)',
    employeeCount: '2,500',
    revenue: '$1.8B (2023)',
    location: 'San Francisco, CA, USA',
    technologies: ['PHP', 'JavaScript', 'React', 'MySQL', 'AWS', 'Kubernetes', 'Redis'],
    leadership: ['Denise Dresser - CEO', 'Tamar Yehoshua - CPO', 'Allen Shim - CFO'],
    recentDevelopments: [
      'Deep integration with Salesforce platform',
      'Launched Slack AI for search and summaries',
      'Expanded workflow automation features',
      'Reached 20M+ daily active users'
    ]
  },
  'airbnb.com': {
    name: 'Airbnb, Inc.',
    description: 'Airbnb is an online marketplace for short-term homestays and experiences. Connects hosts with guests in over 220 countries and regions. Revolutionized the travel and hospitality industry with peer-to-peer accommodation.',
    industry: 'Travel & Hospitality Marketplace',
    size: 'Enterprise (5000+)',
    employeeCount: '6,800',
    revenue: '$9.9B (2023)',
    location: 'San Francisco, CA, USA',
    technologies: ['Ruby on Rails', 'React', 'Java', 'MySQL', 'AWS', 'Kubernetes', 'Presto'],
    leadership: ['Brian Chesky - CEO', 'Joe Gebbia - CPO', 'Dave Stephenson - CFO'],
    recentDevelopments: [
      'Launched Airbnb Rooms category',
      'Expanded long-term stays offering',
      'Introduced AI-powered search',
      'Record bookings in 2023'
    ]
  },
  'meesho.com': {
    name: 'Meesho',
    description: 'Meesho is India\'s leading social commerce platform enabling individuals and small businesses to start online businesses with zero investment. Connects suppliers with resellers who sell products through social media channels like WhatsApp and Facebook.',
    industry: 'Social Commerce & E-commerce',
    size: 'Mid-Market (500-5000)',
    employeeCount: '1,200',
    revenue: '$600M (2023)',
    location: 'Bangalore, Karnataka, India',
    technologies: ['Python', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Kubernetes', 'Redis', 'Kafka'],
    leadership: ['Vidit Aatrey - CEO', 'Sanjeev Barnwal - CTO', 'Dhiresh Bansal - CFO'],
    recentDevelopments: [
      'Raised $570M in Series F funding',
      'Reached 150M+ registered users',
      'Expanded into Tier 2 and Tier 3 cities',
      'Launched Meesho Mall for premium brands'
    ]
  },
  'cursor.ai': {
    name: 'Cursor AI',
    description: 'Cursor is an AI-powered code editor built for pair programming with AI. Combines the familiarity of VS Code with advanced AI capabilities for code generation, editing, and debugging. Popular among developers for AI-assisted coding.',
    industry: 'Developer Tools & AI Software',
    size: 'Startup (<50)',
    employeeCount: '25',
    revenue: '$15M ARR (2024)',
    location: 'San Francisco, CA, USA',
    technologies: ['TypeScript', 'Electron', 'React', 'Python', 'GPT-4', 'Claude', 'PostgreSQL'],
    leadership: ['Michael Truell - CEO', 'Sualeh Asif - CTO', 'Arvid Lunnemark - CPO'],
    recentDevelopments: [
      'Raised $60M Series A at $400M valuation',
      'Surpassed 100K paid subscribers',
      'Launched Cursor Composer for multi-file editing',
      'Integrated Claude 3.5 Sonnet'
    ]
  }
};

/**
 * Get company data from knowledge base
 */
export function getCompanyKnowledge(domain: string): CompanyKnowledge | null {
  const normalizedDomain = domain.toLowerCase().trim();
  return COMPANY_DATABASE[normalizedDomain] || null;
}

/**
 * Check if domain is in knowledge base
 */
export function hasCompanyKnowledge(domain: string): boolean {
  return domain.toLowerCase().trim() in COMPANY_DATABASE;
}
