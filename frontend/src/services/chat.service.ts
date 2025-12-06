import { api } from "./api";

export async function startConversation(projectId: string | null, projectType: string) {
  const res = await api.post("/api/chat/start", { project_id: projectId, project_type: projectType });
  return res.data;
}

export async function sendMessage(conversationId: string, message: string, projectId?: string | null, projectType?: string) {
  const res = await api.post("/api/chat/message", { conversation_id: conversationId, message, project_id: projectId, project_type: projectType });
  return res.data;
}

export async function getConversation(conversationId: string) {
  const res = await api.get(`/api/chat/${conversationId}`);
  return res.data;
}

export async function getConversations(projectId?: string | null) {
  const res = await api.get(`/api/chat/conversations`, { params: { project_id: projectId ?? null } });
  return res.data;
}

export async function resumeConversation(conversationId: string) {
  const res = await api.post(`/api/chat/${conversationId}/resume`);
  return res.data;
}
