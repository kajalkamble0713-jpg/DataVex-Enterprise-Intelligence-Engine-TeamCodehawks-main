import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const analyzeRateLimiter = rateLimit({
  windowMs: env.ANALYZE_RATE_LIMIT_WINDOW_MS,
  max: env.ANALYZE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many analyze requests from this IP. Please try again later."
  }
});
