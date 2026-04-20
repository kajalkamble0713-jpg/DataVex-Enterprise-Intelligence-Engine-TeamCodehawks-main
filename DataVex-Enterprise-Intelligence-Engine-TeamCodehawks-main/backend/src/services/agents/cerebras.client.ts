/**
 * Reusable Cerebras LLM client with retry logic
 */

import { env } from "../../config/env";

interface CerebrasMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CerebrasRequest {
  model: string;
  temperature: number;
  messages: CerebrasMessage[];
}

interface CerebrasResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class CerebrasClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.cerebras.ai/v1/chat/completions";
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.CEREBRAS_API_KEY;
  }

  async chat(
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.2,
    model = "llama3.1-8b"
  ): Promise<string> {
    const request: CerebrasRequest = {
      model,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(this.baseUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Cerebras API error (${response.status}): ${errorText}`
          );
        }

        const data = (await response.json()) as CerebrasResponse;
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No content in Cerebras response");
        }

        return content;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(
          `Cerebras API attempt ${attempt}/${this.maxRetries} failed:`,
          lastError.message
        );

        if (attempt < this.maxRetries) {
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }

    throw lastError || new Error("Cerebras API failed after retries");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
