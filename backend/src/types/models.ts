export type UserRole = "admin" | "manager" | "developer" | "qa" | "client";
export type ProjectType = "web" | "mobile" | "desktop" | "api" | "other";
export type ProjectStatus = "active" | "completed" | "archived";
export type RequirementType = "functional" | "non_functional";
export type RequirementPriority = "high" | "medium" | "low";
export type RequirementStatus = "draft" | "review" | "approved";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  user_id: string | null;
  name: string;
  type: ProjectType;
  description: string | null;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Requirement {
  id: string;
  project_id: string;
  type: RequirementType;
  category: string | null;
  priority: RequirementPriority;
  title: string;
  description: string | null;
  status: RequirementStatus;
  confidence_score: number | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  role: string | null;
  permissions: Record<string, unknown> | null;
  added_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: Date;
}

export interface Conversation {
  _id?: string;
  user_id: string;
  project_id: string | null;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  _id?: string;
  conversation_id: string;
  role: ChatRole;
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: Date;
}
