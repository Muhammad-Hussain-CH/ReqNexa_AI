import { pgPool } from "../config/database";
import { Conversation, ChatMessage } from "../types/models";

export async function createConversation(data: { user_id: string; project_id: string | null; title: string }): Promise<string> {
  const res = await pgPool.query(
    `INSERT INTO conversations (user_id, project_id, title) VALUES ($1, $2, $3) RETURNING id`,
    [data.user_id, data.project_id, data.title]
  );
  return res.rows[0].id as string;
}

export async function saveMessage(msg: { conversation_id: string; role: string; content: string; metadata: any | null }): Promise<string> {
  const res = await pgPool.query(
    `INSERT INTO chat_messages (conversation_id, role, content, metadata) VALUES ($1, $2, $3, $4) RETURNING id`,
    [msg.conversation_id, msg.role, msg.content, msg.metadata]
  );
  return res.rows[0].id as string;
}

export async function getMessages(conversation_id: string): Promise<ChatMessage[]> {
  const res = await pgPool.query(
    `SELECT id as _id, conversation_id, role, content, metadata, created_at FROM chat_messages WHERE conversation_id=$1 ORDER BY created_at ASC`,
    [conversation_id]
  );
  return res.rows as any;
}

export async function getLastMessages(conversation_id: string, limit = 10): Promise<ChatMessage[]> {
  const res = await pgPool.query(
    `SELECT id as _id, conversation_id, role, content, metadata, created_at FROM chat_messages WHERE conversation_id=$1 ORDER BY created_at DESC LIMIT $2`,
    [conversation_id, limit]
  );
  return (res.rows as any).reverse();
}

export async function getConversationsByUser(user_id: string, project_id: string | null): Promise<Conversation[]> {
  const params: any[] = [user_id];
  let where = `user_id=$1`;
  if (project_id !== null) { params.push(project_id); where += ` AND project_id=$${params.length}`; }
  const res = await pgPool.query(
    `SELECT id as _id, user_id, project_id, title, created_at, updated_at FROM conversations WHERE ${where} ORDER BY updated_at DESC`,
    params
  );
  return res.rows as any;
}
