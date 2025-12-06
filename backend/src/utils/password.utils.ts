import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../lib/env";
import { UserRole } from "../types/models";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateJWT(userId: string, email: string, role: UserRole): string {
  const payload = { sub: userId, email, role };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string): string {
  const payload = { sub: userId };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string; email?: string; role?: UserRole } {
  const decoded = jwt.verify(token, env.JWT_SECRET) as any;
  return decoded;
}
