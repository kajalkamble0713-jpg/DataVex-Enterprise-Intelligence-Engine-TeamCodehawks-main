/**
 * Stock Market Data Service using Alpha Vantage API
 * Provides real-time and historical stock data for publicly traded companies
 */

import axios from 'axios';
import { env } from '../config/env';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || '';
const BASE_URL = 'https://www.alphavantage.co/query';

// Simple in-memory cache to avoid hitting rate limits (5 calls/min, 500/day)
const cache: Record<string, { data: StockData; timestamp: number }> = {};
const CACHE_TTL = 3600000; // 1 hour in milliseconds

export interface StockData {
  ticker: string;
  latestClose: number;
  change1Week: string | null;
  change1Month: string | null;
  change1Year: string | null;
  trend: 'upward' | 'downward' | 'neutral';
  urgencySignal: string;
  marketCap?: string;
}

/**
 * Get stock data for a company by name
 * Returns null if company is not publicly traded or API fails
 */
export async function getStockData(companyName: string): Promise<StockData | null> {
  if (!ALPHA_VANTAGE_KEY) {
    console.warn('Alpha Vantage API key not configured');
    return null;
  }

  const cacheKey = `stock_${companyName.toLowerCase()}`;
  
  // Check cache
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Stock API] Cache hit for ${companyName}`);
    return cached.data;
  }

  try {
    console.log(`[Stock API] Fetching data for ${companyName}`);
    
    // Step 1: Search for ticker symbol
    const searchRes = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: companyName,
        apikey: ALPHA_VANTAGE_KEY,
      },
      timeout: 10000,
    });

    const bestMatch = searchRes.data.bestMatches?.[0];
    if (!bestMatch) {
      console.log(`[Stock API] No ticker found for ${companyName}`);
      return null;
    }

    const ticker = bestMatch['1. symbol'];
    const matchScore = parseFloat(bestMatch['9. matchScore'] || '0');
    
    // Only proceed if match score is high enough
    if (matchScore < 0.5) {
      console.log(`[Stock API] Low match score (${matchScore}) for ${companyName}`);
      return null;
    }

    console.log(`[Stock API] Found ticker ${ticker} for ${companyName}`);

    // Step 2: Fetch weekly time series
    const weeklyRes = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_WEEKLY',
        symbol: ticker,
        apikey: ALPHA_VANTAGE_KEY,
      },
      timeout: 10000,
    });

    const timeSeries = weeklyRes.data['Weekly Time Series'];
    if (!timeSeries) {
      console.log(`[Stock API] No time series data for ${ticker}`);
      return null;
    }

    // Sort dates descending (latest first)
    const dates = Object.keys(timeSeries).sort().reverse();
    if (dates.length === 0) return null;

    const latest = timeSeries[dates[0]];
    const latestClose = parseFloat(latest['4. close']);

    // Helper to get close price from a date index
    const getClose = (index: number): number | null => {
      if (index >= dates.length) return null;
      return parseFloat(timeSeries[dates[index]]['4. close']);
    };

    const oneWeekAgoClose = getClose(1);   // ~1 week ago
    const oneMonthAgoClose = getClose(4);  // ~4 weeks ago
    const oneYearAgoClose = getClose(52);  // ~52 weeks ago

    const changePercent = (current: number, previous: number | null): string | null => {
      if (previous === null) return null;
      const change = ((current - previous) / previous * 100);
      return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
    };

    const change1Week = changePercent(latestClose, oneWeekAgoClose);
    const change1Month = changePercent(latestClose, oneMonthAgoClose);
    const change1Year = changePercent(latestClose, oneYearAgoClose);

    // Determine trend based on 1-month performance
    let trend: 'upward' | 'downward' | 'neutral' = 'neutral';
    if (change1Month) {
      const num = parseFloat(change1Month);
      if (num > 2) trend = 'upward';
      else if (num < -2) trend = 'downward';
    }

    // Generate urgency signal based on stock movements
    let urgencySignal = 'Stable stock performance';
    if (change1Month && change1Year) {
      const monthNum = parseFloat(change1Month);
      const yearNum = parseFloat(change1Year);
      
      if (monthNum < -15) {
        urgencySignal = 'Sharp recent drop – potential financial distress or restructuring';
      } else if (monthNum < -10) {
        urgencySignal = 'Recent decline – may indicate budget pressures or cost optimization focus';
      } else if (monthNum > 20) {
        urgencySignal = 'Strong recent growth – likely expanding and investing in new capabilities';
      } else if (monthNum > 10) {
        urgencySignal = 'Solid growth momentum – good time to engage with scaling initiatives';
      } else if (yearNum < -25) {
        urgencySignal = 'Significant yearly decline – restructuring or transformation likely underway';
      } else if (yearNum > 40) {
        urgencySignal = 'Exceptional yearly growth – aggressive expansion and investment phase';
      } else if (yearNum > 20) {
        urgencySignal = 'Strong yearly performance – company in growth mode with budget availability';
      }
    }

    const result: StockData = {
      ticker,
      latestClose,
      change1Week,
      change1Month,
      change1Year,
      trend,
      urgencySignal,
    };

    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
    };

    console.log(`[Stock API] Successfully fetched data for ${ticker}`);
    return result;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[Stock API] Error for ${companyName}:`, error.message);
    } else {
      console.error(`[Stock API] Unexpected error for ${companyName}:`, error);
    }
    return null;
  }
}

/**
 * Clear the stock data cache (useful for testing)
 */
export function clearStockCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
  console.log('[Stock API] Cache cleared');
}
