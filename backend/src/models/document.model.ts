import { pgPool } from "../config/database";

export interface DocumentRecord {
  id?: string;
  project_id: string;
  filename: string;
  format: string;
  size: number;
  path: string;
  created_at: Date;
}

export async function insertDocument(doc: Omit<DocumentRecord, "id" | "created_at">) {
  const res = await pgPool.query(
    `INSERT INTO documents (project_id, filename, format, size, path) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [doc.project_id, doc.filename, doc.format, doc.size, doc.path]
  );
  return res.rows[0].id as string;
}

export async function listDocumentsByProject(project_id: string): Promise<DocumentRecord[]> {
  const res = await pgPool.query(
    `SELECT id, project_id, filename, format, size, path, created_at FROM documents WHERE project_id=$1 ORDER BY created_at DESC`,
    [project_id]
  );
  return res.rows as any;
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const res = await pgPool.query(
    `SELECT id, project_id, filename, format, size, path, created_at FROM documents WHERE id=$1`,
    [id]
  );
  return (res.rows[0] as any) || null;
}

export async function deleteDocumentById(id: string) {
  await pgPool.query(`DELETE FROM documents WHERE id=$1`, [id]);
}
