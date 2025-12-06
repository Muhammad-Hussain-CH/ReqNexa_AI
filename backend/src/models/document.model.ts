import { Db } from "mongodb";
import { getCollection } from "../config/mongodb";

export interface DocumentRecord {
  _id?: string;
  project_id: string;
  filename: string;
  format: string;
  size: number;
  path: string;
  created_at: Date;
}

const DOCS = "documents";

export async function insertDocument(db: Db, doc: Omit<DocumentRecord, "_id" | "created_at">) {
  const col = getCollection<DocumentRecord>(db, DOCS);
  const res = await col.insertOne({ ...doc, created_at: new Date() });
  return String(res.insertedId);
}

export async function listDocumentsByProject(db: Db, project_id: string): Promise<DocumentRecord[]> {
  const col = getCollection<DocumentRecord>(db, DOCS);
  const docs = await col.find({ project_id }).sort({ created_at: -1 }).toArray();
  return docs as DocumentRecord[];
}

export async function getDocumentById(db: Db, id: string): Promise<DocumentRecord | null> {
  const col = getCollection<DocumentRecord>(db, DOCS);
  // eslint-disable-next-line
  const doc = await col.findOne({ _id: (global as any).ObjectId ? new (global as any).ObjectId(id) : undefined } as any) as any;
  // Fall back to string _id
  return doc || (await col.findOne({ _id: id } as any)) as any;
}

export async function deleteDocumentById(db: Db, id: string) {
  const col = getCollection<DocumentRecord>(db, DOCS);
  await col.deleteOne({ _id: id } as any);
}
