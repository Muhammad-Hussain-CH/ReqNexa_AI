import { GeminiService } from "./gemini.service";
import { pgPool } from "../config/database";
import { ProjectStatus, RequirementPriority, RequirementStatus, RequirementType } from "../types/models";
import { isOwner } from "./project.service";

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
async function withRetry<T>(fn: () => Promise<T>, max = 3) {
  let attempt = 0;
  while (true) {
    try { return await fn(); } catch (err: any) {
      attempt += 1; const isRate = err?.status === 429 || /rate limit/i.test(String(err?.message));
      if (attempt > max) throw err; await sleep((isRate ? 3000 : 1000) * attempt);
    }
  }
}

const useRemote = Boolean(process.env.GEMINI_API_KEY);
let gemini: GeminiService | { classifyRequirement: (requirementText: string) => Promise<{ type: string; subcategory: null; confidence: number; title: string; description: string }> };
if (useRemote) {
  gemini = new GeminiService();
} else {
  gemini = {
    classifyRequirement: async (requirementText: string) => ({
      type: /\b(performance|security|usability|reliability|maintainability|scalability|accessibility)\b/i.test(requirementText) ? "Non-Functional" : "Functional",
      subcategory: null,
      confidence: 60,
      title: requirementText.slice(0, 80),
      description: requirementText,
    }),
  } as any;
}
async function classifyWithGemini(text: string) {
  return gemini.classifyRequirement(text);
}

export async function getRequirementsService(userId: string, filters: { project_id?: string | null; type?: RequirementType; priority?: RequirementPriority; status?: RequirementStatus; category?: string | null; page: number; limit: number; sort_by?: string; sort_order?: "asc" | "desc"; }) {
  const where: string[] = [];
  const params: any[] = [];
  let idx = 1;
  if (filters.project_id) { where.push(`r.project_id = $${idx}`); params.push(filters.project_id); idx++; }
  if (filters.type) { where.push(`r.type = $${idx}::requirement_type_enum`); params.push(filters.type); idx++; }
  if (filters.priority) { where.push(`r.priority = $${idx}::requirement_priority_enum`); params.push(filters.priority); idx++; }
  if (filters.status) { where.push(`r.status = $${idx}::requirement_status_enum`); params.push(filters.status); idx++; }
  if (filters.category !== undefined) { where.push(`(r.category IS NOT DISTINCT FROM $${idx})`); params.push(filters.category); idx++; }

  const access = `(p.user_id = $${idx} OR pm.user_id = $${idx})`; params.push(userId); idx++;
  const page = filters.page; const limit = filters.limit; const offset = (page - 1) * limit;
  const sortBy = ["created_at","updated_at","priority","status"].includes(String(filters.sort_by)) ? String(filters.sort_by) : "created_at";
  const sortOrder = filters.sort_order === "asc" ? "asc" : "desc";

  const baseJoin = `FROM requirements r JOIN projects p ON p.id = r.project_id LEFT JOIN project_members pm ON pm.project_id = r.project_id`;
  const whereSql = where.length ? `WHERE ${where.join(" AND ")} AND ${access}` : `WHERE ${access}`;

  const totalRes = await pgPool.query(`SELECT COUNT(*) ${baseJoin} ${whereSql}`, params);
  const total = Number(totalRes.rows[0]?.count || 0);

  const rows = await pgPool.query(
    `SELECT r.id, r.project_id, r.type, r.category, r.priority, r.title, r.description, r.status, r.confidence_score, r.created_by, r.created_at, r.updated_at
     ${baseJoin}
     ${whereSql}
     ORDER BY r.${sortBy} ${sortOrder}
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...params, limit, offset]
  );

  return { requirements: rows.rows, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export async function getRequirementByIdService(userId: string, id: string) {
  const rowRes = await pgPool.query(`SELECT r.*, p.user_id owner_id FROM requirements r JOIN projects p ON p.id = r.project_id WHERE r.id = $1`, [id]);
  const req = rowRes.rows[0]; if (!req) throw new Error("Not Found");
  const accessRes = await pgPool.query(`SELECT 1 FROM project_members pm WHERE pm.project_id = $1 AND pm.user_id = $2 LIMIT 1`, [req.project_id, userId]);
  if (!(req.owner_id === userId || accessRes.rowCount)) throw new Error("Forbidden");
  return req;
}

export async function createRequirementService(userId: string, data: { project_id: string; type: RequirementType; category?: string | null; priority: RequirementPriority; title: string; description?: string | null; }) {
  const owner = await isOwner(userId, data.project_id); if (!owner) throw new Error("Forbidden");
  let type = data.type; let category = data.category ?? null; let confidence = null as number | null;
  if (data.description) {
    const cls = await classifyWithGemini(data.description);
    if (cls) { type = cls.type === "Non-Functional" ? "non_functional" : "functional"; category = cls.subcategory ?? category; confidence = Number(cls.confidence ?? 60); }
  }
  const res = await pgPool.query(
    `INSERT INTO requirements (project_id, type, category, priority, title, description, status, confidence_score, created_by)
     VALUES ($1, $2::requirement_type_enum, $3, $4::requirement_priority_enum, $5, $6, 'draft'::requirement_status_enum, $7, $8)
     RETURNING *`,
    [data.project_id, type, category, data.priority, data.title, data.description ?? null, confidence, userId]
  );
  const req = res.rows[0];
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, "requirement_create", "requirement", req.id, JSON.stringify({ title: data.title })]
  );
  return req;
}

export async function updateRequirementService(userId: string, id: string, data: { title?: string; description?: string | null; type?: RequirementType; category?: string | null; priority?: RequirementPriority; status?: RequirementStatus; }) {
  const rowRes = await pgPool.query(`SELECT r.project_id FROM requirements r WHERE r.id = $1`, [id]);
  const row = rowRes.rows[0]; if (!row) throw new Error("Not Found");
  const owner = await isOwner(userId, row.project_id); if (!owner) throw new Error("Forbidden");
  const fields: string[] = []; const values: any[] = []; let idx = 1;
  if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
  if (data.description !== undefined) { fields.push(`description = $${idx++}`); values.push(data.description); }
  if (data.type !== undefined) { fields.push(`type = $${idx++}::requirement_type_enum`); values.push(data.type); }
  if (data.category !== undefined) { fields.push(`category = $${idx++}`); values.push(data.category); }
  if (data.priority !== undefined) { fields.push(`priority = $${idx++}::requirement_priority_enum`); values.push(data.priority); }
  if (data.status !== undefined) { fields.push(`status = $${idx++}::requirement_status_enum`); values.push(data.status); }
  fields.push(`updated_at = now()`); values.push(id);
  const sql = `UPDATE requirements SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  const res = await pgPool.query(sql, values);
  const req = res.rows[0];
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, "requirement_update", "requirement", id, JSON.stringify(data)]
  );
  return req;
}

export async function deleteRequirementService(userId: string, id: string) {
  const rowRes = await pgPool.query(`SELECT r.project_id FROM requirements r WHERE r.id = $1`, [id]);
  const row = rowRes.rows[0]; if (!row) throw new Error("Not Found");
  const owner = await isOwner(userId, row.project_id); if (!owner) throw new Error("Forbidden");
  await pgPool.query(`DELETE FROM requirements WHERE id = $1`, [id]);
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, "requirement_delete", "requirement", id, JSON.stringify({ deleted: true })]
  );
  return { success: true };
}

export async function classifyRequirementService(userId: string, id: string) {
  const rowRes = await pgPool.query(`SELECT r.project_id, r.description FROM requirements r WHERE r.id = $1`, [id]);
  const row = rowRes.rows[0]; if (!row) throw new Error("Not Found");
  const owner = await isOwner(userId, row.project_id); if (!owner) throw new Error("Forbidden");
  const cls = await classifyWithGemini(row.description || "");
  if (!cls) throw new Error("Classification failed");
  const type: RequirementType = cls.type === "Non-Functional" ? "non_functional" : "functional";
  const category = cls.subcategory ?? null; const confidence = Number(cls.confidence ?? 60);
  const res = await pgPool.query(
    `UPDATE requirements SET type = $1::requirement_type_enum, category = $2, confidence_score = $3, updated_at = now() WHERE id = $4 RETURNING *`,
    [type, category, confidence, id]
  );
  const req = res.rows[0];
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, "requirement_classify", "requirement", id, JSON.stringify(cls)]
  );
  return { classification: cls, requirement: req };
}

export async function bulkUpdateRequirementsService(userId: string, ids: string[], updates: { status?: RequirementStatus; priority?: RequirementPriority; category?: string | null; }) {
  if (!ids.length) return { success: true };
  const projRes = await pgPool.query(`SELECT DISTINCT r.project_id FROM requirements r WHERE r.id = ANY($1::uuid[])`, [ids]);
  const projectIds = projRes.rows.map((r) => r.project_id);
  for (const pid of projectIds) { const owner = await isOwner(userId, pid); if (!owner) throw new Error("Forbidden"); }
  const fields: string[] = []; const values: any[] = []; let idx = 1;
  if (updates.status !== undefined) { fields.push(`status = $${idx++}::requirement_status_enum`); values.push(updates.status); }
  if (updates.priority !== undefined) { fields.push(`priority = $${idx++}::requirement_priority_enum`); values.push(updates.priority); }
  if (updates.category !== undefined) { fields.push(`category = $${idx++}`); values.push(updates.category); }
  fields.push(`updated_at = now()`);
  const sql = `UPDATE requirements SET ${fields.join(", ")} WHERE id = ANY($${idx}::uuid[])`;
  await pgPool.query(sql, [...values, ids]);
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5::jsonb)`,
    [userId, "requirements_bulk_update", "requirement", ids[0], JSON.stringify({ ids, updates })]
  );
  return { success: true };
}
