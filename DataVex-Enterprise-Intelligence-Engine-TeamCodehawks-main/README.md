# DataVex Prospect Intelligence Engine

> Autonomous Multi-Agent Strategic SDR System for B2B Lead Qualification

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🚀 Overview

DataVex Prospect Intelligence Engine is an autonomous 8-agent AI system that transforms a company domain into actionable strategic intelligence in 90 seconds. Built for the DataVex Hackathon 2025, this system revolutionizes B2B lead qualification by combining AI reasoning, real-time market data, and deterministic decision logic.

### Key Features

- **8-Agent Intelligence Pipeline**: Autonomous research, analysis, and decision-making
- **Real-Time Stock Integration**: Live market data via Alpha Vantage API
- **Deterministic Decision Engine**: Production-grade ICP scoring (5 weighted factors)
- **Solution Matchmaker**: AI-powered recommendation for optimal DataVex offerings
- **Urgency Factor Generator**: Temporal intelligence for prospect prioritization
- **Visual Intelligence Dashboard**: 3D visualizations, animated scoring, execution traces
- **Enterprise Authentication**: Role-based access control (Admin/Employee)
- **95% Time Reduction**: 30 minutes → 90 seconds per prospect

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Usage Guide](#usage-guide)
- [Agent Pipeline](#agent-pipeline)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Home    │  │  Signup  │  │  Signin  │  │  Admin   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Results Dashboard with 3D Visualizations     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express + Node.js)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              8-Agent Orchestrator                    │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │  │
│  │  │Research│→│Market  │→│Tech    │→│Finance │       │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │  │
│  │  │Risk    │→│Decision│→│Outreach│→│Bonus   │       │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Prisma     │  │  Cerebras    │  │ Alpha Vantage│    │
│  │   (SQLite)   │  │     API      │  │     API      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Agent Pipeline Flow

1. **Input**: Company domain (e.g., stripe.com)
2. **Researcher Agent**: Builds comprehensive company dossier
3. **Market Analyst**: Integrates real-time stock data
4. **Tech Debt Analyzer**: Evaluates modernization needs
5. **Financial Pressure**: Analyzes funding and growth signals
6. **Risk & Objection**: Surfaces deal-breakers
7. **Decision Engine**: Calculates ICP score and verdict
8. **Outreach Generator**: Crafts personalized messaging
9. **Bonus Content**: Creates engagement strategies
10. **Output**: Complete intelligence package with verdict

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Required API Keys

1. **Cerebras API Key** (for AI agents)
   - Sign up at [Cerebras Cloud](https://cloud.cerebras.ai/)
   - Get your API key from the dashboard

2. **Alpha Vantage API Key** (for stock data)
   - Sign up at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Free tier: 5 calls/min, 500 calls/day

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/datavex-prospect-intelligence.git
cd datavex-prospect-intelligence
```

### 2. Install Frontend Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Setup Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx ts-node prisma/seed.ts
cd ..
```

This will:
- Create SQLite database
- Run migrations
- Generate Prisma client
- Seed default admin user

## ⚙️ Configuration

### Frontend Environment Variables

Create `.env.local` in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Cerebras API Key (for chatbot - optional)
NEXT_PUBLIC_CEREBRAS_API_KEY=your_cerebras_api_key_here
```

### Backend Environment Variables

Create `backend/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Cerebras AI API
CEREBRAS_API_KEY=your_cerebras_api_key_here

# Alpha Vantage Stock API
ALPHA_VANTAGE_KEY=G5EJQTYJ0ZWG0RH7

# n8n Webhook (optional)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/datavex-callback
```

### Important Notes

- Replace `your_cerebras_api_key_here` with your actual Cerebras API key
- The Alpha Vantage key provided is for demo purposes (rate-limited)
- Generate a strong JWT secret for production: `openssl rand -base64 32`

## 🚀 Running the Project

### Development Mode

#### Option 1: Run Both Servers Simultaneously

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Using Concurrently (Recommended)

Install concurrently globally:
```bash
npm install -g concurrently
```

Then run from root:
```bash
concurrently "cd backend && npm run dev" "npm run dev"
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

### Default Admin Credentials

```
Email: admin@datavex.com
Password: admin123
```

## 📖 Usage Guide

### 1. First Time Setup

1. Navigate to http://localhost:3000
2. You'll be redirected to the signin page
3. Login with admin credentials (see above)
4. You'll see the "Admin" link in the navbar

### 2. Admin Dashboard

**Access**: Click "Admin" in navbar (admin users only)

**Features**:
- Create new employees with Employee ID, name, email, password
- View all users in a table
- Delete employees (cannot delete admins)
- Monitor user status (Active/Inactive)

**Create Employee**:
1. Click "Add Employee" button
2. Fill in the form:
   - Employee ID: e.g., EMP001
   - Full Name: e.g., John Doe
   - Email: e.g., john@company.com
   - Password: Min 8 characters
3. Click "Create Employee"
4. Employee can now sign in with these credentials

### 3. Analyzing a Prospect

**From Home Page**:
1. Enter a company domain (e.g., stripe.com, meesho.com, notion.so)
2. Click "Analyze Prospect"
3. Watch the 8 agents execute in real-time
4. View results in ~90 seconds

**Results Dashboard Includes**:
- **Verdict Badge**: PURSUE or REJECT with confidence score
- **Company Dossier**: Complete profile with all details
- **Decision Breakdown**: Factor-by-factor scoring with visual progress bars
- **Stock Chart**: Real-time market data with trend analysis
- **Solution Matchmaker**: Recommended DataVex offering
- **Urgency Banner**: "Why Act Now" messaging
- **Outreach Message**: Personalized email/LinkedIn draft
- **Bonus Content**: Thought leadership concept
- **Agent Trace**: Complete execution timeline with timing

### 4. Understanding the Verdict

**PURSUE (Score ≥ 60)**:
- Company aligns with DataVex ICP
- Strong buying signals detected
- Recommended for sales outreach
- Includes personalized strategy

**REJECT (Score < 60)**:
- Company doesn't fit ICP criteria
- Deal-breakers identified
- Not recommended for pursuit
- Includes rejection reasoning

### 5. Interpreting Decision Factors

**Financial Health (25%)**:
- Revenue and funding status
- Stock performance (if public)
- Profitability indicators
- Budget availability signals

**Tech Needs (25%)**:
- Technology stack maturity
- Digital transformation progress
- AI/ML adoption level
- Modernization urgency

**Industry Fit (20%)**:
- Alignment with DataVex solutions
- Industry-specific needs
- Market positioning
- Competitive landscape

**Company Size (15%)**:
- Employee count (50-5,000 ideal)
- Revenue range ($5M-$500M ideal)
- Growth stage
- Organizational complexity

**Market Position (15%)**:
- Growth trajectory
- Market momentum
- Competitive advantages
- Expansion signals

## 🤖 Agent Pipeline

### Agent 1: Researcher (0.5-2.5s)

**Purpose**: Build comprehensive company dossier

**Data Collected**:
- Company name and description
- Industry and size tier
- Employee count and revenue
- Headquarters location
- Technology stack (6-8 technologies)
- Leadership team (CEO, CTO, CFO)
- Recent developments (funding, products, partnerships)

**Special Feature**: Knowledge base acceleration for Fortune 500 companies (0.01s lookup)

### Agent 2: Market Analyst (2-4s)

**Purpose**: Analyze market position and momentum

**Data Sources**:
- Alpha Vantage API (real-time stock data)
- Market trends and competitive positioning
- Growth trajectory analysis

**Output**:
- Stock ticker and current price
- 1-week, 1-month, 1-year performance
- Trend classification (upward/downward/neutral)
- Urgency signals based on volatility
- Market insights and growth signals
- Competitive risks

### Agent 3: Tech Debt Analyzer (2-3s)

**Purpose**: Evaluate technology modernization needs

**Analysis Areas**:
- Technology stack modernity
- Cloud vs on-premise infrastructure
- AI/ML adoption level
- Digital transformation progress
- Technical debt indicators
- Modernization opportunities

**Output**:
- Tech stack analysis
- Identified gaps
- Urgency score (0-100)

### Agent 4: Financial Pressure (2-3s)

**Purpose**: Identify budget availability and buying signals

**Analysis Areas**:
- Funding status and runway
- Revenue growth trajectory
- Profitability status
- Hiring trends (expansion vs contraction)
- Budget indicators for new purchases
- Financial pressure points

**Output**:
- Financial signals list
- Pressure score (0-100)

### Agent 5: Risk & Objection (2-3s)

**Purpose**: Surface deal-breakers using reject-first reasoning

**Identifies**:
- Competitive threats
- Budget constraints
- Technical barriers
- Timing issues
- Strategic misalignment
- Decision-making complexity

**Output**:
- List of objections with explanations
- Risk severity assessment

### Agent 6: Decision Engine (0.01-0.05s)

**Purpose**: Calculate ICP score and make verdict

**Scoring Algorithm**:
```
Total Score = (Financial Health × 0.25) + 
              (Tech Needs × 0.25) + 
              (Industry Fit × 0.20) + 
              (Company Size × 0.15) + 
              (Market Position × 0.15)
```

**Hard Rejection Rules**:
- Tech giants (Amazon, Microsoft, Google, etc.)
- Mega-enterprises (>10,000 employees)
- Consulting firms (Accenture, Deloitte, etc.)
- Financial giants (JPMorgan, Goldman Sachs, etc.)
- Government agencies
- Non-profits and educational institutions
- Very small companies (<20 employees)

**Special Boosts**:
- Recent large funding (>$10M): +15 points
- Legacy systems + no AI: +20 points
- Active tech hiring: +15 points
- Using competitor's AI: -10 points

**Verdict Logic**:
- Score ≥ 60: PURSUE
- Score < 60: REJECT

### Agent 7: Outreach Generator (3-4s)

**Purpose**: Craft personalized outreach message

**Requirements**:
- 3-4 paragraphs
- Professional but conversational tone
- Reference specific company details
- Mention recent developments
- Highlight relevant DataVex solutions
- Include clear call-to-action

**Output**: Ready-to-send email/LinkedIn message

### Agent 8: Bonus Content (2-3s)

**Purpose**: Create thought leadership concept

**Output**:
- Platform: LinkedIn
- Content: 3-4 sentence post concept
- Hook related to their industry
- Insight or trend
- Connection to prospect intelligence
- Engagement question

## 🔌 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create new user account

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securepassword123",
  "role": "employee"
}
```

**Response**:
```json
{
  "message": "Successfully signed up",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "employee"
  }
}
```

#### POST `/api/auth/signin`
Authenticate user

**Request Body**:
```json
{
  "email": "admin@datavex.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "message": "Successfully signed in",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@datavex.com",
    "role": "admin"
  }
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@datavex.com",
    "role": "admin"
  }
}
```

### Employee Management (Admin Only)

#### POST `/api/auth/employees`
Create new employee

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "employeeId": "EMP001",
  "name": "Jane Smith",
  "email": "jane@company.com",
  "password": "password123"
}
```

#### DELETE `/api/auth/employees/:id`
Delete employee

**Headers**:
```
Authorization: Bearer <admin_token>
```

#### GET `/api/auth/users`
List all users

**Headers**:
```
Authorization: Bearer <token>
```

### Analysis Endpoints

#### POST `/api/analyze`
Analyze a company domain

**Request Body**:
```json
{
  "domain": "stripe.com"
}
```

**Response**:
```json
{
  "jobId": "uuid",
  "status": "processing",
  "message": "Analysis started"
}
```

#### GET `/api/status/:jobId`
Check analysis status

**Response**:
```json
{
  "jobId": "uuid",
  "status": "completed",
  "verdict": "PURSUE",
  "updatedAt": "2025-02-22T10:30:00Z"
}
```

#### GET `/api/results/:jobId`
Get analysis results

**Response**: Complete analysis object with all agent outputs

#### GET `/api/history`
Get analysis history

**Response**: Array of past analyses

## 📁 Project Structure

```
datavex-prospect-intelligence/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard
│   │   └── page.tsx
│   ├── api/                      # API routes
│   │   └── chat/
│   │       └── route.ts
│   ├── results/                  # Results pages
│   │   └── [jobId]/
│   │       └── page.tsx
│   ├── signin/                   # Authentication
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── backend/                      # Express backend
│   ├── prisma/                   # Database
│   │   ├── schema.prisma         # Database schema
│   │   ├── seed.ts               # Seed script
│   │   └── migrations/           # Migration files
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts            # Environment config
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   └── job.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── routes/
│   │   │   └── index.ts          # API routes
│   │   ├── services/
│   │   │   ├── agents/           # 8-Agent system
│   │   │   │   ├── orchestrator.ts
│   │   │   │   ├── cerebras.client.ts
│   │   │   │   ├── company-knowledge.ts
│   │   │   │   ├── decision-engine.ts
│   │   │   │   ├── confidence-calculator.ts
│   │   │   │   ├── solution-matcher.ts
│   │   │   │   ├── urgency-generator.ts
│   │   │   │   └── types.ts
│   │   │   ├── cache.service.ts
│   │   │   ├── stock.service.ts
│   │   │   └── n8n.service.ts
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   └── job.ts
│   │   ├── app.ts                # Express app
│   │   └── server.ts             # Server entry
│   ├── package.json
│   └── tsconfig.json
├── components/                   # React components
│   ├── 3d/                       # Three.js components
│   │   ├── Verdict3DCanvas.tsx
│   │   ├── TraceTimeline3D.tsx
│   │   └── ...
│   ├── ui/                       # UI components
│   ├── navbar.tsx
│   ├── decision-breakdown.tsx
│   ├── solution-matchmaker.tsx
│   ├── urgency-banner.tsx
│   ├── stock-chart.tsx
│   └── ...
├── lib/                          # Utilities
│   ├── auth-client.ts            # Auth functions
│   ├── api.ts                    # API client
│   └── mock-data.ts              # Mock data
├── .env.local                    # Frontend env
├── .gitignore
├── next.config.mjs
├── package.json
├── README.md
└── tsconfig.json
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5.0
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **3D Graphics**: Three.js, React Three Fiber
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express 4.18
- **Language**: TypeScript 5.0
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT, bcryptjs
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **Error Handling**: http-errors
- **Development**: Nodemon, ts-node

### AI & External APIs

- **AI Provider**: Cerebras Cloud API
- **Stock Data**: Alpha Vantage API
- **Workflow Automation**: n8n (optional)

### DevOps & Tools

- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Build Tool**: Turbopack (Next.js)
- **Database Migrations**: Prisma Migrate

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd backend
npx prisma generate
```

#### 3. Database Migration Issues

**Error**: `Migration failed`

**Solution**:
```bash
cd backend
rm -rf prisma/migrations
rm prisma/dev.db
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

#### 4. API Key Issues

**Error**: `Cerebras API key not configured`

**Solution**:
- Check `.env.local` and `backend/.env` files
- Ensure `CEREBRAS_API_KEY` is set correctly
- Restart both servers after updating

#### 5. Frontend Build Errors

**Error**: `Module not found` or dependency issues

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 6. Backend TypeScript Errors

**Error**: Type errors during compilation

**Solution**:
```bash
cd backend
npm run build
# Fix any reported errors
```

### Performance Optimization

#### Slow Analysis Times

1. **Check API Rate Limits**: Alpha Vantage has 5 calls/min limit
2. **Enable Caching**: Stock data cached for 1 hour
3. **Use Knowledge Base**: Pre-loaded data for known companies
4. **Optimize Network**: Ensure stable internet connection

#### High Memory Usage

1. **Restart Servers**: Clear memory leaks
2. **Reduce Concurrent Analyses**: Limit parallel processing
3. **Clear Cache**: Delete old analysis results

### Getting Help

If you encounter issues not covered here:

1. Check the [Issues](https://github.com/YOUR_USERNAME/datavex-prospect-intelligence/issues) page
2. Search for similar problems
3. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version)
   - Screenshots if applicable

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test` (if available)
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Write self-documenting code

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DataVex** for the hackathon challenge and inspiration
- **Cerebras** for providing the AI API
- **Alpha Vantage** for stock market data
- **Next.js Team** for the amazing framework
- **Prisma Team** for the excellent ORM

## 📞 Contact

For questions or support:

- **Project Repository**: [GitHub](https://github.com/YOUR_USERNAME/datavex-prospect-intelligence)
- **Issue Tracker**: [GitHub Issues](https://github.com/YOUR_USERNAME/datavex-prospect-intelligence/issues)
- **Email**: your.email@example.com

---

**Built with ❤️ for DataVex Hackathon 2025**

*Transforming B2B sales from reactive searching to proactive strategic targeting*
