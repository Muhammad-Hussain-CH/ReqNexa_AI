import { api } from "./api";

export async function startConversation(body: { project_id?: string | null; project_type: string }) {
  const res = await api.post("/api/chat/start", body);
  return res.data;
}

export async function sendMessage(body: { conversation_id: string; message: string; project_id?: string | null; project_type?: string }) {
  const res = await api.post("/api/chat/message", body);
  return res.data;
}

export async function getConversation(conversation_id: string) {
  const res = await api.get(`/api/chat/${conversation_id}`);
  return res.data;
}
