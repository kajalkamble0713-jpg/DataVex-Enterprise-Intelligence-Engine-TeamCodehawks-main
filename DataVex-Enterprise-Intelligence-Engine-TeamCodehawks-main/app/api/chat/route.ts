import { NextRequest, NextResponse } from 'next/server'

// Cerebras API configuration
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions'
const CEREBRAS_MODEL = 'llama3.1-8b' // Fast, free production model

// System prompt for DataVex receptionist persona
const SYSTEM_PROMPT = `You are a friendly, professional AI assistant for DataVex - the Prospect Intelligence Engine.

**About DataVex:**
DataVex uses 8 specialized AI agents to analyze companies and decide whether to pursue them as prospects:
1. Researcher - Gathers company profile, news, funding, products
2. Market Analyst - Evaluates market position, competitive landscape, growth
3. Tech Debt Analyzer - Assesses technology stack and modernization opportunities
4. Financial Pressure - Analyzes financial health, funding, budget indicators
5. Risk & Objection - Identifies deal-breakers using reject-first reasoning
6. Decision Arbiter - Makes final PURSUE/IGNORE verdict with confidence score
7. Outreach Generator - Crafts personalized outreach messages
8. Bonus Content - Creates thought leadership content ideas

**Analysis Process:**
- Takes 15-30 seconds per company
- Returns verdict (PURSUE/IGNORE), confidence score, detailed dossier
- Provides personalized outreach message and reasoning trace
- Shows how each agent contributed to the decision

**Site Navigation:**
- Home (/): Enter a company domain to analyze (e.g., "stripe.com")
- How It Works (/how-it-works): Explains the 8-agent system and workflow
- Past Analyses (/past-analyses): Browse previous analyses and history
- Compare (/compare): Compare multiple companies side by side
- Insights (/insights): View charts and intelligence summaries
- Database (/database): Browse all analyzed companies
- Results (/results/[jobId]): View detailed analysis results with tabs for Dossier, Verdict, Outreach, Bonus Content, and Agent Trace

**Key Features:**
- Real-time AI analysis powered by Cerebras LLM
- Beautiful 3D visualizations and interactive UI
- Radar charts showing market fit, financial health, tech modernity, growth potential
- Complete agent reasoning trace for transparency
- Export and share analysis results

**How to Use:**
1. Enter a company domain on the home page
2. Click "Analyze Prospect"
3. Wait 15-30 seconds for the 8 agents to complete analysis
4. Explore results in different tabs
5. Use the generated outreach message or thought leadership content

Be helpful, concise, and guide users to the right pages. Answer questions about how the agents work, what the scores mean, and how to interpret results. If users ask about specific companies, suggest they analyze them on the home page.`

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { messages } = body

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Get API key from environment (server-side preferred, public fallback for dev)
    const apiKey = process.env.CEREBRAS_API_KEY || process.env.NEXT_PUBLIC_CEREBRAS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Prepare messages for Cerebras API
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    // Call Cerebras API
    const response = await fetch(CEREBRAS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'DataVex-Chatbot/1.0'
      },
      body: JSON.stringify({
        model: CEREBRAS_MODEL,
        messages: apiMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 503 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Service is experiencing high demand. Please try again in a moment.' },
          { status: 429 }
        )
      } else {
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        )
      }
    }

    // Parse successful response
    const data = await response.json()

    // Extract message content (Cerebras uses same format as OpenAI)
    const content = data.choices?.[0]?.message?.content || ''

    if (!content) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Return response in OpenAI-compatible format
    return NextResponse.json({
      choices: [{
        message: {
          role: 'assistant',
          content: content
        }
      }]
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}
