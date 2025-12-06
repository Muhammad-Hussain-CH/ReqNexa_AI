import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { UserRole, User } from "../types/models";
import { pgPool } from "../config/database";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email?: string; role?: UserRole };
      userData?: Omit<User, "password_hash">;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"] as string | undefined;
  if (!header || !header.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function checkRole(allowed: UserRole[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user?.role || !allowed.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const result = await pgPool.query(
      "SELECT id, email, name, role, is_active, created_at, updated_at FROM users WHERE id = $1",
      [req.user.id]
    );
    const row = result.rows[0];
    if (!row) return res.status(401).json({ error: "Unauthorized" });
    req.userData = row;
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
