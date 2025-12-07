import { Request, Response } from "express";
import { z } from "zod";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service";
import { UserRole } from "../types/models";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["admin", "manager", "developer", "qa", "client"]) as z.ZodType<UserRole>,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name, role } = registerSchema.parse(req.body);
    const result = await registerUser(email, password, name, role);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Unauthorized" });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokens = await refreshAccessToken(refreshToken);
    res.json(tokens);
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Unauthorized" });
  }
}

export async function logout(_req: Request, res: Response) {
  res.json({ success: true });
}
