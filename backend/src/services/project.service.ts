import { pgPool } from "../config/database";
import { ProjectStatus, ProjectType } from "../types/models";
import { connectWithRetry } from "../config/mongodb";

type CreateProjectInput = { name: string; type: ProjectType; description: string | null };

export async function createProjectService(userId: string, data: CreateProjectInput, ip: string) {
  const status: ProjectStatus = "active";
  const res = await pgPool.query(
    `INSERT INTO projects (user_id, name, type, description, status)
     VALUES ($1, $2, $3::project_type_enum, $4, $5::project_status_enum)
     RETURNING id, user_id, name, type, description, status, created_at, updated_at`,
    [userId, data.name, data.type, data.description, status]
  );
  const project = res.rows[0];
  await pgPool.query(
    `INSERT INTO project_members (project_id, user_id, role, permissions)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [project.id, userId, "owner", JSON.stringify({})]
  );
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [userId, "project_create", "project", project.id, JSON.stringify({ name: data.name }), ip]
  );
  return project;
}

export async function getAllProjectsService(userId: string, page: number, limit: number, status?: ProjectStatus) {
  const offset = (page - 1) * limit;
  const totalRes = await pgPool.query(
    `SELECT COUNT(DISTINCT p.id) AS count
     FROM projects p
     LEFT JOIN project_members pm ON pm.project_id = p.id
     WHERE (p.user_id = $1 OR pm.user_id = $1)
       AND ($2::project_status_enum IS NULL OR p.status = $2::project_status_enum)`,
    [userId, status || null]
  );
  const total = Number(totalRes.rows[0]?.count || 0);
  const rows = await pgPool.query(
    `SELECT DISTINCT ON (p.id)
       p.id, p.user_id, p.name, p.type, p.description, p.status, p.created_at, p.updated_at,
       (SELECT COUNT(*) FROM requirements r WHERE r.project_id = p.id) AS requirements_count
     FROM projects p
     LEFT JOIN project_members pm ON pm.project_id = p.id
     WHERE (p.user_id = $1 OR pm.user_id = $1)
       AND ($2::project_status_enum IS NULL OR p.status = $2::project_status_enum)
     ORDER BY p.id, p.created_at DESC
     LIMIT $3 OFFSET $4`,
    [userId, status || null, limit, offset]
  );
  return { projects: rows.rows, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export async function userHasAccess(userId: string, projectId: string) {
  const res = await pgPool.query(
    `SELECT 1
     FROM projects p
     LEFT JOIN project_members pm ON pm.project_id = p.id
     WHERE p.id = $1 AND (p.user_id = $2 OR pm.user_id = $2)
     LIMIT 1`,
    [projectId, userId]
  );
  return Number(res.rowCount || 0) > 0;
}

export async function isOwner(userId: string, projectId: string) {
  const res = await pgPool.query(`SELECT 1 FROM projects WHERE id = $1 AND user_id = $2`, [projectId, userId]);
  return Number(res.rowCount || 0) > 0;
}

export async function getProjectByIdService(userId: string, projectId: string) {
  const access = await userHasAccess(userId, projectId);
  if (!access) throw new Error("Forbidden");
  const projectRes = await pgPool.query(
    `SELECT id, user_id, name, type, description, status, created_at, updated_at
     FROM projects WHERE id = $1`,
    [projectId]
  );
  const project = projectRes.rows[0];
  const summaryRes = await pgPool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE type = 'functional') AS functional_count,
       COUNT(*) FILTER (WHERE type = 'non_functional') AS non_functional_count,
       COUNT(*) FILTER (WHERE status = 'approved') AS approved_count,
       COUNT(*) FILTER (WHERE status = 'review') AS review_count,
       COUNT(*) FILTER (WHERE status = 'draft') AS draft_count
     FROM requirements WHERE project_id = $1`,
    [projectId]
  );
  const membersRes = await pgPool.query(
    `SELECT pm.user_id, pm.role, pm.permissions, pm.added_at, u.name, u.email
     FROM project_members pm
     JOIN users u ON u.id = pm.user_id
     WHERE pm.project_id = $1
     ORDER BY pm.added_at ASC`,
    [projectId]
  );
  return { project, requirements_summary: summaryRes.rows[0], team_members: membersRes.rows };
}

type UpdateProjectInput = { name?: string; description?: string | null; status?: ProjectStatus };

export async function updateProjectService(userId: string, projectId: string, data: UpdateProjectInput, ip: string, isAdmin: boolean) {
  const owner = await isOwner(userId, projectId);
  if (!owner && !isAdmin) throw new Error("Forbidden");
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  if (data.name !== undefined) {
    fields.push(`name = $${idx++}`);
    values.push(data.name);
  }
  if (data.description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (data.status !== undefined) {
    fields.push(`status = $${idx++}::project_status_enum`);
    values.push(data.status);
  }
  fields.push(`updated_at = now()`);
  values.push(projectId);
  const sql = `UPDATE projects SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, user_id, name, type, description, status, created_at, updated_at`;
  const res = await pgPool.query(sql, values);
  const project = res.rows[0];
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [userId, "project_update", "project", projectId, JSON.stringify(data), ip]
  );
  return project;
}

export async function deleteProjectService(userId: string, projectId: string, ip: string, isAdmin: boolean) {
  const owner = await isOwner(userId, projectId);
  if (!owner && !isAdmin) throw new Error("Forbidden");
  await pgPool.query(
    `UPDATE projects SET status = 'archived'::project_status_enum, updated_at = now() WHERE id = $1`,
    [projectId]
  );
  const db = await connectWithRetry();
  await db.collection("conversations").updateMany({ project_id: projectId }, { $set: { archived: true, updated_at: new Date() } });
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [userId, "project_archive", "project", projectId, JSON.stringify({ archived: true }), ip]
  );
  return { success: true };
}

type AddMemberInput = { user_id: string; role: string; permissions?: Record<string, unknown> };

export async function addTeamMemberService(userId: string, projectId: string, input: AddMemberInput, ip: string, isAdmin: boolean) {
  const owner = await isOwner(userId, projectId);
  if (!owner && !isAdmin) throw new Error("Forbidden");
  await pgPool.query(
    `INSERT INTO project_members (project_id, user_id, role, permissions)
     VALUES ($1, $2, $3, $4::jsonb)
     ON CONFLICT (project_id, user_id) DO UPDATE SET role = EXCLUDED.role, permissions = EXCLUDED.permissions`,
    [projectId, input.user_id, input.role, JSON.stringify(input.permissions || {})]
  );
  await pgPool.query(
    `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [userId, "project_add_member", "project", projectId, JSON.stringify({ member: input.user_id, role: input.role }), ip]
  );
  return { success: true };
}
