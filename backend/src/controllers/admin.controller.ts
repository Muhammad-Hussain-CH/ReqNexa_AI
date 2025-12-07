import { Request, Response } from "express";
import { z } from "zod";
import { pgPool } from "../config/database";
import { getUserStats, getProjectStats, getRequirementStats, getActivityStats, getSystemHealth } from "../services/analytics.service";

export async function listUsers(req: Request, res: Response) {
  try {
    const q = String(req.query.q || "").trim();
    const role = String(req.query.role || "").trim();
    const status = String(req.query.status || "").trim();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 25);
    const offset = (page - 1) * limit;
    const where: string[] = [];
    const params: any[] = [];
    if (q) { params.push(`%${q}%`); where.push(`(u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`); }
    if (role) { params.push(role); where.push(`u.role = $${params.length}::user_role_enum`); }
    if (status) { params.push(status === "active"); where.push(`u.is_active = $${params.length}`); }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const sql = `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
                        COALESCE((SELECT COUNT(*) FROM projects p WHERE p.user_id = u.id),0) AS project_count
                 FROM users u ${whereSql}
                 ORDER BY u.created_at DESC
                 LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const rows = await pgPool.query(sql, [...params, limit, offset]);
    const items = rows.rows.map((r) => ({ id: r.id, name: r.name, email: r.email, role: r.role, status: r.is_active ? "active" : "inactive", created_at: r.created_at, project_count: Number(r.project_count || 0) }));
    res.json({ items, page, limit });
  } catch (err: any) { res.status(500).json({ error: err.message || "Server error" }); }
}

export async function updateUserRole(req: Request, res: Response) {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const body = z.object({ role: z.enum(["admin","manager","developer","qa","client"]) }).parse(req.body);
    await pgPool.query("UPDATE users SET role = $1::user_role_enum, updated_at = now() WHERE id = $2", [body.role, id]);
    await pgPool.query(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address) VALUES ($1, $2, $3, $4, $5::jsonb, $6)",
      [req.user?.id || null, "user_role_updated", "user", id, JSON.stringify({ role: body.role }), req.ip]
    );
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function updateUserStatus(req: Request, res: Response) {
  try {
    const id = z.string().uuid().parse(req.params.id);
    const body = z.object({ is_active: z.boolean() }).parse(req.body);
    await pgPool.query("UPDATE users SET is_active = $1, updated_at = now() WHERE id = $2", [body.is_active, id]);
    await pgPool.query(
      "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address) VALUES ($1, $2, $3, $4, $5::jsonb, $6)",
      [req.user?.id || null, body.is_active ? "user_activated" : "user_deactivated", "user", id, JSON.stringify({ is_active: body.is_active }), req.ip]
    );
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function getAnalytics(req: Request, res: Response) {
  try {
    const dateRange = { from: String(req.query.date_from || "" ) || undefined, to: String(req.query.date_to || "") || undefined };
    const users = await getUserStats();
    const projects = await getProjectStats();
    const requirements = await getRequirementStats();
    const activity = await getActivityStats(dateRange);
    res.json({ users, projects, requirements, activity });
  } catch (err: any) { res.status(500).json({ error: err.message || "Server error" }); }
}

export async function listActivity(req: Request, res: Response) {
  try {
    const user_id = req.query.user_id ? z.string().uuid().parse(String(req.query.user_id)) : undefined;
    const action_type = req.query.action_type ? String(req.query.action_type) : undefined;
    const date_from = req.query.date_from ? String(req.query.date_from) : undefined;
    const date_to = req.query.date_to ? String(req.query.date_to) : undefined;
    const limit = Number(req.query.limit || 50);
    const page = Number(req.query.page || 1);
    const offset = (page - 1) * limit;
    const where: string[] = [];
    const params: any[] = [];
    if (user_id) { params.push(user_id); where.push(`user_id = $${params.length}`); }
    if (action_type) { params.push(action_type); where.push(`action = $${params.length}`); }
    if (date_from) { params.push(date_from); where.push(`created_at >= $${params.length}`); }
    if (date_to) { params.push(date_to); where.push(`created_at <= $${params.length}`); }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const rows = await pgPool.query(`SELECT id, user_id, action, entity_type, entity_id, metadata, ip_address, created_at FROM activity_logs ${whereSql} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]);
    res.json({ items: rows.rows, page, limit });
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function getSystemHealthStatus(_req: Request, res: Response) {
  try {
    const health = await getSystemHealth();
    res.json(health);
  } catch (err: any) { res.status(500).json({ error: err.message || "Server error" }); }
}

