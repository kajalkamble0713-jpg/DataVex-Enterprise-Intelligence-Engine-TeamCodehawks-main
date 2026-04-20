import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../db/prisma";

interface AuthTokenPayload {
  userId: string;
  role: string;
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: "Missing authorization token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, employeeId: true, isActive: true }
    });

    if (!user) {
      res.status(401).json({ message: "Invalid session" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ message: "Account is inactive" });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

