import { Db } from "mongodb";
import { getCollection } from "../config/mongodb";
import { Conversation, ChatMessage } from "../types/models";

const CONVERSATIONS = "conversations";
const MESSAGES = "chat_messages";

export async function createConversation(db: Db, data: Omit<Conversation, "_id" | "created_at" | "updated_at">): Promise<string> {
  const col = getCollection<Conversation>(db, CONVERSATIONS);
  const now = new Date();
  const res = await col.insertOne({ ...data, created_at: now, updated_at: now });
  return String(res.insertedId);
}

export async function saveMessage(db: Db, msg: Omit<ChatMessage, "_id" | "created_at">): Promise<string> {
  const col = getCollection<ChatMessage>(db, MESSAGES);
  const res = await col.insertOne({ ...msg, created_at: new Date() });
  return String(res.insertedId);
}

export async function getMessages(db: Db, conversation_id: string): Promise<ChatMessage[]> {
  const col = getCollection<ChatMessage>(db, MESSAGES);
  const docs = await col
    .find({ conversation_id })
    .sort({ created_at: 1 })
    .toArray();
  return docs as ChatMessage[];
}

export async function getLastMessages(db: Db, conversation_id: string, limit = 10): Promise<ChatMessage[]> {
  const col = getCollection<ChatMessage>(db, MESSAGES);
  const docs = await col
    .find({ conversation_id })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();
  return docs.reverse() as ChatMessage[];
}

export async function getConversationsByUser(db: Db, user_id: string, project_id: string | null): Promise<Conversation[]> {
  const col = getCollection<Conversation>(db, CONVERSATIONS);
  const filter: any = { user_id };
  if (project_id !== null) filter.project_id = project_id;
  const docs = await col
    .find(filter)
    .sort({ updated_at: -1 })
    .toArray();
  return docs as Conversation[];
}
