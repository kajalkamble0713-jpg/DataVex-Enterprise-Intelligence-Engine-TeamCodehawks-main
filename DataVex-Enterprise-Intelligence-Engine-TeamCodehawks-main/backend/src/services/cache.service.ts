import NodeCache from "node-cache";
import { env } from "../config/env";

interface CachedSourceData {
  scrapedContent?: string;
  newsData?: unknown;
}

const cache = new NodeCache({ stdTTL: env.CACHE_TTL_SECONDS, useClones: false });

const sourceDataKey = (domain: string): string => `source-data:${domain}`;

export const cacheService = {
  getSourceData(domain: string): CachedSourceData | undefined {
    return cache.get<CachedSourceData>(sourceDataKey(domain));
  },
  setSourceData(domain: string, data: CachedSourceData): void {
    cache.set(sourceDataKey(domain), data);
  }
};
