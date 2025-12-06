export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "archived";
  createdAt: string;
}

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  details: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  projectId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

