import { Router } from "express";
import {
  analyzeDomain,
  getHistory,
  getResults,
  getStatus,
  health,
  n8nCallback
} from "../controllers/job.controller";
import { 
  listUsers, 
  me, 
  signin, 
  signup, 
  createEmployee, 
  deleteEmployee 
} from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { analyzeRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/health", asyncHandler(health));
router.post("/api/analyze", analyzeRateLimiter, asyncHandler(analyzeDomain));
router.get("/api/status/:jobId", asyncHandler(getStatus));
router.get("/api/results/:jobId", asyncHandler(getResults));
router.get("/api/history", asyncHandler(getHistory));
router.post("/api/webhook/n8n-callback", asyncHandler(n8nCallback));
router.post("/api/auth/signup", asyncHandler(signup));
router.post("/api/auth/signin", asyncHandler(signin));
router.get("/api/auth/me", requireAuth, asyncHandler(me));
router.get("/api/auth/users", requireAuth, asyncHandler(listUsers));
router.post("/api/auth/employees", requireAuth, asyncHandler(createEmployee));
router.delete("/api/auth/employees/:id", requireAuth, asyncHandler(deleteEmployee));

export default router;

