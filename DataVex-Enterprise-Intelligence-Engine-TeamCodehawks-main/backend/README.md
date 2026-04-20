# DataVex Backend

Production-grade Express + Prisma backend for the DataVex Prospect Intelligence Engine.

## Stack
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- n8n orchestration (webhook trigger + callback)
- Security middleware: `helmet`, CORS allowlist, rate limiting, webhook secret validation
- Input validation: `zod` + `validator`
- In-memory cache: `node-cache` (24h default TTL)

## Project Structure
```txt
backend/
  prisma/schema.prisma
  src/
    app.ts
    server.ts
    config/env.ts
    controllers/job.controller.ts
    db/prisma.ts
    middleware/
    routes/index.ts
    services/
    types/
    utils/
  n8n/datavex-prospect-intelligence.workflow.json
  postman/DataVex-Backend.postman_collection.json
```

## Environment Variables
Copy `backend/.env.example` to `backend/.env`.

- `NODE_ENV`: `development` or `production`
- `PORT`: backend port (default `5000`)
- `CORS_ORIGIN`: allowed frontend origin (for example `http://localhost:3000`)
- `DATABASE_URL`: PostgreSQL connection string for Prisma
- `N8N_WEBHOOK_URL`: n8n trigger webhook URL (`/webhook/trigger-analysis`)
- `N8N_CALLBACK_URL`: backend callback URL for n8n to POST final result
- `N8N_WEBHOOK_SECRET`: shared secret checked in `x-webhook-secret`
- `CEREBRAS_API_KEY`: LLM API key (required by backend validation and n8n)
- `SERPAPI_API_KEY`: SerpAPI key
- `BROWSERLESS_API_KEY`: Browserless key
- `ANALYZE_RATE_LIMIT_WINDOW_MS`: analyze rate limiter window
- `ANALYZE_RATE_LIMIT_MAX`: max analyze requests per IP in window
- `ANALYZE_COOLDOWN_MINUTES`: duplicate domain cooldown window
- `CACHE_TTL_SECONDS`: in-memory cache TTL (source data hints)

## Local Development (Without Docker)
1. Install dependencies:
```bash
cd backend
npm install
```
2. Configure env:
```bash
cp .env.example .env
```
3. Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```
4. Start dev server:
```bash
npm run dev
```

## Local Development (Docker Compose)
From repository root:
```bash
docker compose up --build
```

Services:
- Backend: `http://localhost:5000`
- Postgres: `localhost:5432`
- n8n: `http://localhost:5678`

Import workflow into n8n:
- `backend/n8n/datavex-prospect-intelligence.workflow.json`

## API Documentation

### `POST /api/analyze`
Body:
```json
{ "domain": "acme.com" }
```
Behavior:
- Validates/sanitizes domain.
- Cooldown check (returns existing job if same domain analyzed recently).
- Creates a job.
- Triggers n8n workflow.

Response:
```json
{ "jobId": "uuid" }
```
or cooldown hit:
```json
{
  "jobId": "uuid",
  "status": "processing",
  "reused": true
}
```

### `GET /api/status/:jobId`
Response:
```json
{
  "jobId": "uuid",
  "status": "pending|processing|completed|failed",
  "verdict": "PURSUE|IGNORE|null",
  "updatedAt": "ISO_DATE"
}
```

### `GET /api/results/:jobId`
- Returns full result if status is `completed`.
- Returns `400` when job is not completed.

### `GET /api/history?limit=10&offset=0&search=acme&verdict=PURSUE`
- Paginated history for past analyses.

### `POST /api/webhook/n8n-callback`
Headers:
```txt
x-webhook-secret: <N8N_WEBHOOK_SECRET>
```
Payload example:
```json
{
  "jobId": "uuid",
  "dossier": {},
  "verdict": "PURSUE",
  "decisionReasoning": "...",
  "outreachMessage": "...",
  "bonusContent": { "platform": "LinkedIn", "content": "..." },
  "trace": [{ "agent": "Researcher", "input": "...", "output": "..." }]
}
```

### `GET /health`
Response:
```json
{ "status": "ok" }
```

## cURL Examples
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"domain\":\"acme.com\"}"
```

```bash
curl http://localhost:5000/api/status/<jobId>
```

```bash
curl http://localhost:5000/api/results/<jobId>
```

```bash
curl "http://localhost:5000/api/history?limit=10&offset=0&verdict=PURSUE"
```

```bash
curl -X POST http://localhost:5000/api/webhook/n8n-callback \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: <N8N_WEBHOOK_SECRET>" \
  -d "{\"jobId\":\"<jobId>\",\"status\":\"failed\",\"error\":\"workflow timeout\"}"
```

## n8n Design Notes
- Trigger: `Webhook Trigger` (`/webhook/trigger-analysis`)
- Research flow:
  1. Browserless scrape
  2. SerpAPI news fetch
  3. Researcher -> Market Analyst -> Tech Debt -> Financial -> Risk (reject-first) -> Arbiter
  4. Branch on verdict:
     - PURSUE: Outreach + Bonus
     - IGNORE: Rejection report
  5. Callback to backend with complete payload
- Error path:
  - `Error Trigger` sends failure payload to backend callback endpoint.

## Deployment Guidance
- Backend: Render, Railway, Fly.io
- Postgres: managed (Render, Neon, Supabase)
- n8n: Docker on VM or n8n.cloud
- Ensure:
  - HTTPS endpoints for backend and n8n webhook/callback
  - Strong random `N8N_WEBHOOK_SECRET`
  - CORS origin set only to your frontend host
  - Prisma migrations executed during deploy

## Notes for Production
- Use a managed cache/queue (Redis + BullMQ) if you need higher throughput.
- Consider async webhooks with signed HMAC headers for stronger callback integrity.
- Add structured logging (Pino) and tracing (OpenTelemetry) for observability.
