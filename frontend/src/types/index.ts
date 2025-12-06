export type User = { id: string; email: string; name: string; role: string };
export type Project = { id: string; name: string; type: string; status: string; description?: string | null };
export type Requirement = { id: string; project_id: string; type: string; category?: string | null; priority: string; title: string; description?: string | null; status: string; confidence_score?: number | null };
export type Conversation = { _id: string; title: string; project_id?: string | null };
export type ChatMessage = { _id?: string; conversation_id: string; role: "user" | "assistant"; content: string };
