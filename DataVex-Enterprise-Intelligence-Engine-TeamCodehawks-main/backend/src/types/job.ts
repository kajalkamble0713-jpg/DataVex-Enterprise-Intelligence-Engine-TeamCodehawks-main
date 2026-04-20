export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface N8nCallbackPayload {
  jobId: string;
  status?: JobStatus;
  error?: string;
  dossier?: Record<string, unknown>;
  verdict?: "PURSUE" | "IGNORE";
  decisionReasoning?: string;
  outreachMessage?: string;
  bonusContent?: Record<string, unknown>;
  trace?: Array<Record<string, unknown>>;
  sourceData?: {
    scrapedContent?: string;
    newsData?: unknown;
  };
}
