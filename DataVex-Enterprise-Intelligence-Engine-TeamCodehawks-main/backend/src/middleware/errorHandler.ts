import type { NextFunction, Request, Response } from "express";

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (
  error: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error.name === "PrismaClientInitializationError") {
    res.status(503).json({
      message:
        "Database unavailable. Please start your database and try again."
    });
    return;
  }

  if (error.message.includes("Can't reach database server")) {
    res.status(503).json({
      message:
        "Database unavailable. Please start your database and try again."
    });
    return;
  }

  const status = error.status ?? 500;
  res.status(status).json({
    message: error.message || "Internal server error"
  });
};
