import { Request, Response } from "express";
import { z } from "zod";
import { connectWithRetry } from "../config/mongodb";
import { startConversationService, sendMessageService, getConversationService, resumeConversationService, getConversationsService } from "../services/chat.service";

const startSchema = z.object({
  project_id: z.string().uuid().nullable().optional(),
  project_type: z.enum(["web", "mobile", "desktop", "api", "other"]),
});

const messageSchema = z.object({
  conversation_id: z.string(),
  message: z.string().min(1),
  project_id: z.string().uuid().nullable().optional(),
  project_type: z.enum(["web", "mobile", "desktop", "api", "other"]).optional(),
});

export async function startConversation(req: Request, res: Response) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const parsed = startSchema.parse(req.body);
    const db = await connectWithRetry();
    const result = await startConversationService(db, {
      user_id: req.user.id,
      project_id: parsed.project_id ?? null,
      project_type: parsed.project_type,
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const parsed = messageSchema.parse(req.body);
    const db = await connectWithRetry();
    const result = await sendMessageService(db, {
      conversation_id: parsed.conversation_id,
      message: parsed.message,
      user_id: req.user.id,
      project_id: parsed.project_id ?? null,
      project_type: parsed.project_type,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function getConversation(req: Request, res: Response) {
  try {
    const conversation_id = z.string().parse(req.params.conversation_id);
    const db = await connectWithRetry();
    const result = await getConversationService(db, conversation_id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function resumeConversation(req: Request, res: Response) {
  try {
    const conversation_id = z.string().parse(req.params.conversation_id);
    const db = await connectWithRetry();
    const result = await resumeConversationService(db, conversation_id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function listConversations(req: Request, res: Response) {
  try {
    if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });
    const project_id = z.string().uuid().optional().nullable().safeParse(req.query.project_id).success ? (req.query.project_id as string | null) : null;
    const db = await connectWithRetry();
    const result = await getConversationsService(db, req.user.id, project_id || null);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}
