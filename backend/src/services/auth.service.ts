import { pgPool } from "../config/database";
import { hashPassword, comparePassword, generateJWT, generateRefreshToken } from "../utils/password.utils";
import { User, UserRole } from "../types/models";

type AuthTokens = { accessToken: string; refreshToken: string };

async function findUserByEmail(email: string): Promise<User | null> {
  const res = await pgPool.query(
    "SELECT id, email, password_hash, name, role, is_active, created_at, updated_at FROM users WHERE email = $1",
    [email]
  );
  return res.rows[0] || null;
}

async function findUserById(id: string): Promise<User | null> {
  const res = await pgPool.query(
    "SELECT id, email, password_hash, name, role, is_active, created_at, updated_at FROM users WHERE id = $1",
    [id]
  );
  return res.rows[0] || null;
}

async function createUser(email: string, passwordHash: string, name: string, role: UserRole): Promise<User> {
  const res = await pgPool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES ($1, $2, $3, $4::user_role_enum)
     RETURNING id, email, password_hash, name, role, is_active, created_at, updated_at`,
    [email, passwordHash, name, role]
  );
  return res.rows[0];
}

export async function registerUser(email: string, password: string, name: string, role: UserRole): Promise<{ user: Omit<User, "password_hash">; tokens: AuthTokens }> {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Email already registered");
  const passwordHash = await hashPassword(password);
  const user = await createUser(email, passwordHash, name, role);
  const accessToken = generateJWT(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, tokens: { accessToken, refreshToken } };
}

export async function loginUser(email: string, password: string): Promise<{ user: Omit<User, "password_hash">; tokens: AuthTokens }> {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  if (!user.is_active) throw new Error("User inactive");
  const match = await comparePassword(password, user.password_hash);
  if (!match) throw new Error("Invalid credentials");
  const accessToken = generateJWT(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);
  const { password_hash, ...safeUser } = user;
  return { user: safeUser, tokens: { accessToken, refreshToken } };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  const jwt = await import("jsonwebtoken");
  const decoded = jwt.verify(refreshToken, (await import("../lib/env")).env.JWT_REFRESH_SECRET) as any;
  const userId = decoded.sub as string;
  const user = await findUserById(userId);
  if (!user || !user.is_active) throw new Error("Invalid refresh token");
  const accessToken = generateJWT(user.id, user.email, user.role);
  const newRefreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken: newRefreshToken };
}

export async function validateUser(userId: string): Promise<Omit<User, "password_hash"> | null> {
  const user = await findUserById(userId);
  if (!user) return null;
  const { password_hash, ...safeUser } = user;
  return safeUser;
}
