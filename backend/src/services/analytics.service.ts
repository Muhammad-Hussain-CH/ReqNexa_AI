import fs from "fs";
import path from "path";
import os from "os";
import { pgPool } from "../config/database";

export async function getUserStats() {
  const byRole = await pgPool.query("SELECT role, COUNT(*)::int AS count FROM users GROUP BY role");
  const total = await pgPool.query("SELECT COUNT(*)::int AS count FROM users");
  const active24h = await pgPool.query("SELECT COUNT(DISTINCT user_id)::int AS count FROM activity_logs WHERE created_at >= now() - interval '24 hours'");
  const active7d = await pgPool.query("SELECT COUNT(DISTINCT user_id)::int AS count FROM activity_logs WHERE created_at >= now() - interval '7 days'");
  const active30d = await pgPool.query("SELECT COUNT(DISTINCT user_id)::int AS count FROM activity_logs WHERE created_at >= now() - interval '30 days'");
  return {
    total: total.rows[0]?.count || 0,
    by_role: byRole.rows,
    active_users: { last_24h: active24h.rows[0]?.count || 0, last_7d: active7d.rows[0]?.count || 0, last_30d: active30d.rows[0]?.count || 0 },
  };
}

export async function getProjectStats() {
  const byStatus = await pgPool.query("SELECT status, COUNT(*)::int AS count FROM projects GROUP BY status");
  const total = await pgPool.query("SELECT COUNT(*)::int AS count FROM projects");
  const mostActive = await pgPool.query(
    "SELECT p.id, p.name, COUNT(r.id)::int AS requirements_count FROM projects p LEFT JOIN requirements r ON r.project_id = p.id GROUP BY p.id ORDER BY COUNT(r.id) DESC LIMIT 5"
  );
  const avgReqPerProject = await pgPool.query("SELECT COALESCE(AVG(cnt),0) AS avg FROM (SELECT COUNT(*) AS cnt FROM requirements GROUP BY project_id) t");
  return { total: total.rows[0]?.count || 0, by_status: byStatus.rows, most_active: mostActive.rows, avg_requirements_per_project: Number(avgReqPerProject.rows[0]?.avg || 0) };
}

export async function getRequirementStats() {
  const byType = await pgPool.query("SELECT type, COUNT(*)::int AS count FROM requirements GROUP BY type");
  const total = await pgPool.query("SELECT COUNT(*)::int AS count FROM requirements");
  return { total: total.rows[0]?.count || 0, by_type: byType.rows };
}

export async function getActivityStats(dateRange: { from?: string; to?: string }) {
  const where: string[] = [];
  const params: any[] = [];
  if (dateRange.from) { params.push(dateRange.from); where.push(`created_at >= $${params.length}`); }
  if (dateRange.to) { params.push(dateRange.to); where.push(`created_at <= $${params.length}`); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const byAction = await pgPool.query(`SELECT action, COUNT(*)::int AS count FROM activity_logs ${whereSql} GROUP BY action ORDER BY count DESC LIMIT 20`, params);
  const total = await pgPool.query(`SELECT COUNT(*)::int AS count FROM activity_logs ${whereSql}`, params);
  return { total: total.rows[0]?.count || 0, by_action: byAction.rows };
}

function getDirectorySize(dir: string): number {
  let size = 0;
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) size += getDirectorySize(full);
    else size += fs.statSync(full).size;
  }
  return size;
}

export async function getSystemHealth() {
  let postgres = false;
  try { await pgPool.query("SELECT 1"); postgres = true; } catch { postgres = false; }
  const memory = { total: os.totalmem(), free: os.freemem(), used: os.totalmem() - os.freemem() };
  const cpuLoad = os.loadavg();
  const storageDir = path.join(process.cwd(), "storage");
  const storageUsed = getDirectorySize(storageDir);
  return {
    database: { postgres },
    ai_provider: { name: "gemini", status: "unknown" },
    server: { memory, cpuLoad },
    storage: { used_bytes: storageUsed },
    checked_at: new Date().toISOString(),
  };
}
