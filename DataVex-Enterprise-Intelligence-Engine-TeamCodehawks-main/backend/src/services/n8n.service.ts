import axios from "axios";
import { env } from "../config/env";

interface TriggerPayload {
  jobId: string;
  domain: string;
  callbackUrl: string;
  sourceData?: {
    scrapedContent?: string;
    newsData?: unknown;
  };
}

export const triggerN8nWorkflow = async (payload: TriggerPayload): Promise<void> => {
  await axios.post(env.N8N_WEBHOOK_URL, payload, {
    timeout: 15000,
    headers: {
      "content-type": "application/json"
    }
  });
};
