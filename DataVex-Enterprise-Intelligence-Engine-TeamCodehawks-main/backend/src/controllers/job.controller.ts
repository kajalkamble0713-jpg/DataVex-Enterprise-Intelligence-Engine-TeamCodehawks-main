import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../db/prisma";
import { cacheService } from "../services/cache.service";
import { triggerN8nWorkflow } from "../services/n8n.service";
import { runAgentPipeline } from "../services/agents/orchestrator";
import type { N8nCallbackPayload } from "../types/job";
import { isValidDomain, normalizeDomain } from "../utils/domain";

const analyzeBodySchema = z.object({
  domain: z.string().min(1, "Domain is required")
});

const callbackSchema = z.object({
  jobId: z.string().min(1),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
  error: z.string().optional(),
  dossier: z.record(z.unknown()).optional(),
  verdict: z.enum(["PURSUE", "IGNORE"]).optional(),
  decisionReasoning: z.string().optional(),
  outreachMessage: z.string().optional(),
  bonusContent: z.record(z.unknown()).optional(),
  trace: z.array(z.record(z.unknown())).optional(),
  sourceData: z
    .object({
      scrapedContent: z.string().optional(),
      newsData: z.unknown().optional()
    })
    .optional()
});

const parsePagination = (input: unknown, fallback: number): number => {
  const parsed = Number(input);
  if (Number.isNaN(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
};

const toInputJson = (value: unknown): any => {
  if (value === undefined) {
    return undefined;
  }
  return value;
};

export const analyzeDomain = async (req: Request, res: Response): Promise<void> => {
  const { domain: rawDomain } = analyzeBodySchema.parse(req.body);
  const domain = normalizeDomain(rawDomain);

  if (!isValidDomain(domain)) {
    throw createHttpError(400, "Invalid domain format");
  }

  const cooldownBoundary = new Date(Date.now() - env.ANALYZE_COOLDOWN_MINUTES * 60 * 1000);
  const recentJob = await prisma.job.findFirst({
    where: {
      domain,
      createdAt: { gte: cooldownBoundary },
      status: { in: ["pending", "processing", "completed"] }
    },
    orderBy: { createdAt: "desc" }
  });

  if (recentJob) {
    res.status(200).json({
      jobId: recentJob.id,
      status: recentJob.status,
      reused: true,
      message: "Using recent analysis job within cooldown window."
    });
    return;
  }

  const job = await prisma.job.create({
    data: {
      domain,
      status: "pending"
    }
  });

  // Direct agent execution (no n8n/Docker required)
  if (env.USE_DIRECT_AGENTS) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "processing" }
    });

    // Fire-and-forget: run pipeline in background
    runAgentPipeline(job.id, domain)
      .then(async (result) => {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: result.status,
            dossier: result.dossier as any,
            verdict: result.verdict,
            decisionReasoning: result.decisionReasoning,
            outreachMessage: result.outreachMessage,
            bonusContent: result.bonusContent as any,
            trace: result.trace as any,
            errorMessage: null
          }
        });
        if (result.sourceData) {
          cacheService.setSourceData(domain, result.sourceData);
        }
      })
      .catch(async (error) => {
        const msg = error instanceof Error ? error.message : "Agent pipeline failed";
        await prisma.job.update({
          where: { id: job.id },
          data: { status: "failed", errorMessage: msg }
        });
      });

    res.status(202).json({ jobId: job.id });
    return;
  }

  // Fallback: n8n orchestration path (requires Docker + n8n running)
  try {
    const sourceData = cacheService.getSourceData(domain);

    await triggerN8nWorkflow({
      jobId: job.id,
      domain,
      callbackUrl: env.N8N_CALLBACK_URL,
      sourceData
    });

    await prisma.job.update({
      where: { id: job.id },
      data: { status: "processing" }
    });

    res.status(202).json({ jobId: job.id });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to trigger analysis workflow";

    await prisma.job.update({
      where: { id: job.id },
      data: {
        status: "failed",
        errorMessage,
        decisionReasoning: `n8n trigger error: ${errorMessage}`
      }
    });

    throw createHttpError(500, "Unable to start analysis workflow");
  }
};

export const getStatus = async (req: Request, res: Response): Promise<void> => {
  const jobId = z.string().uuid().parse(req.params.jobId);
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      status: true,
      verdict: true,
      updatedAt: true
    }
  });

  if (!job) {
    throw createHttpError(404, "Job not found");
  }

  res.status(200).json({
    jobId: job.id,
    status: job.status,
    verdict: job.verdict,
    updatedAt: job.updatedAt
  });
};

export const getResults = async (req: Request, res: Response): Promise<void> => {
  const jobId = z.string().uuid().parse(req.params.jobId);
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw createHttpError(404, "Job not found");
  }

  if (job.status !== "completed") {
    throw createHttpError(400, `Job is ${job.status}. Results are not ready.`);
  }

  res.status(200).json({
    jobId: job.id,
    domain: job.domain,
    status: job.status,
    dossier: job.dossier,
    verdict: job.verdict,
    decisionReasoning: job.decisionReasoning,
    outreachMessage: job.outreachMessage,
    bonusContent: job.bonusContent,
    trace: job.trace,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  });
};

export const n8nCallback = async (req: Request, res: Response): Promise<void> => {
  const webhookSecret = req.header("x-webhook-secret");
  if (!webhookSecret || webhookSecret !== env.N8N_WEBHOOK_SECRET) {
    throw createHttpError(401, "Invalid webhook secret");
  }

  const payload: N8nCallbackPayload = callbackSchema.parse(req.body);
  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });

  if (!job) {
    throw createHttpError(404, "Job not found");
  }

  if (payload.status === "failed" || payload.error) {
    await prisma.job.update({
      where: { id: payload.jobId },
      data: {
        status: "failed",
        errorMessage: payload.error ?? "Workflow execution failed",
        decisionReasoning: payload.error ?? "Workflow execution failed"
      }
    });

    res.status(200).json({ message: "Failure callback recorded" });
    return;
  }

  await prisma.job.update({
    where: { id: payload.jobId },
    data: {
      status: "completed",
      dossier: toInputJson(payload.dossier),
      verdict: payload.verdict,
      decisionReasoning: payload.decisionReasoning,
      outreachMessage: payload.outreachMessage,
      bonusContent: toInputJson(payload.bonusContent),
      trace: toInputJson(payload.trace),
      errorMessage: null
    }
  });

  if (payload.sourceData) {
    cacheService.setSourceData(job.domain, payload.sourceData);
  }

  res.status(200).json({ message: "Callback processed successfully" });
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  const limit = Math.min(parsePagination(req.query.limit, 10), 100);
  const offset = parsePagination(req.query.offset, 0);
  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : "";
  const verdict =
    req.query.verdict === "PURSUE" || req.query.verdict === "IGNORE"
      ? req.query.verdict
      : undefined;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where: {
        ...(search ? { domain: { contains: search } } : {}),
        ...(verdict ? { verdict } : {})
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      select: {
        id: true,
        domain: true,
        status: true,
        verdict: true,
        createdAt: true
      }
    }),
    prisma.job.count({
      where: {
        ...(search ? { domain: { contains: search } } : {}),
        ...(verdict ? { verdict } : {})
      }
    })
  ]);

  res.status(200).json({
    total,
    limit,
    offset,
    data: jobs
  });
};

export const health = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ status: "ok" });
};
