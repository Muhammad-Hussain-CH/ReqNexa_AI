import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { pgPool } from "../config/database";

export function validateProjectData(mode: "create" | "update") {
  const base = {
    name: z.string().min(2),
    type: z.enum(["web", "mobile", "desktop", "api", "other"]),
    description: z.string().nullable().optional(),
    status: z.enum(["active", "completed", "archived"]).optional(),
  };
  const createSchema = z.object({ name: base.name, type: base.type, description: base.description });
  const updateSchema = z.object({ name: base.name.optional(), description: base.description, status: base.status });
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const schema = mode === "create" ? createSchema : updateSchema;
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Bad Request" });
    }
  };
}

export async function checkProjectAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const result = await pgPool.query(
      `SELECT 1 FROM projects p LEFT JOIN project_members pm ON pm.project_id = p.id WHERE p.id = $1 AND (p.user_id = $2 OR pm.user_id = $2) LIMIT 1`,
      [id, userId]
    );
    if (!result.rowCount) return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}

export async function checkProjectOwner(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (role === "admin") return next();
    const result = await pgPool.query(`SELECT 1 FROM projects WHERE id = $1 AND user_id = $2`, [id, userId]);
    if (!result.rowCount) return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    res.status(500).json({ error: "Server error" });
  }
}
