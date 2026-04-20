import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { prisma } from "../db/prisma";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "employee"]).optional()
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const createEmployeeSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

const signToken = (userId: string, role: string): string =>
  jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.parse(req.body);
  const email = parsed.email.trim().toLowerCase();
  const role = parsed.role || "employee";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw createHttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);
  const user = await prisma.user.create({
    data: {
      name: parsed.name.trim(),
      email,
      passwordHash,
      role
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  const token = signToken(user.id, user.role);
  res.status(201).json({
    message: "Successfully signed up",
    token,
    user
  });
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const parsed = signinSchema.parse(req.body);
  const email = parsed.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw createHttpError(403, "Account is inactive. Please contact admin.");
  }

  const validPassword = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!validPassword) {
    throw createHttpError(401, "Invalid email or password");
  }

  const token = signToken(user.id, user.role);
  res.status(200).json({
    message: "Successfully signed in",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId
    }
  });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw createHttpError(401, "Unauthorized");
  }
  res.status(200).json({ user: req.user });
};

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });

  res.status(200).json({ users });
};

// Admin only: Create employee
export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    throw createHttpError(403, "Admin access required");
  }

  const parsed = createEmployeeSchema.parse(req.body);
  const email = parsed.email.trim().toLowerCase();

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw createHttpError(409, "Email is already registered");
  }

  const existingEmployeeId = await prisma.user.findUnique({ 
    where: { employeeId: parsed.employeeId } 
  });
  if (existingEmployeeId) {
    throw createHttpError(409, "Employee ID already exists");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);
  const employee = await prisma.user.create({
    data: {
      employeeId: parsed.employeeId,
      name: parsed.name.trim(),
      email,
      passwordHash,
      role: 'employee',
      isActive: true
    },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  });

  res.status(201).json({
    message: "Employee created successfully",
    employee
  });
};

// Admin only: Delete employee
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    throw createHttpError(403, "Admin access required");
  }

  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw createHttpError(404, "Employee not found");
  }

  if (user.role === 'admin') {
    throw createHttpError(403, "Cannot delete admin users");
  }

  await prisma.user.delete({ where: { id } });

  res.status(200).json({
    message: "Employee deleted successfully"
  });
};

