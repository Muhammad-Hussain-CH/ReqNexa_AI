import { Request, Response } from "express";
import { z } from "zod";
import { startConversationService, sendMessageService, getConversationService, resumeConversationService, getConversationsService } from "../services/chat.service";

export async function startConversation(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({ project_id: z.string().uuid().nullable().optional(), project_type: z.string().min(2) }).parse(req.body);
    const result = await startConversationService({ user_id: userId, project_id: body.project_id ?? null, project_type: body.project_type as any });
    res.status(201).json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({ conversation_id: z.string().min(1), message: z.string().min(1), project_id: z.string().uuid().nullable().optional(), project_type: z.string().optional() }).parse(req.body);
    const result = await sendMessageService({ conversation_id: body.conversation_id, message: body.message, user_id: userId, project_id: body.project_id ?? null, project_type: body.project_type as any });
    res.json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function getConversation(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const conversation_id = z.string().min(1).parse(req.params.conversation_id);
    const result = await getConversationService(conversation_id);
    res.json(result);
  } catch (err: any) { res.status(404).json({ error: err.message || "Not Found" }); }
}

export async function resumeConversation(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const conversation_id = z.string().uuid().parse(req.params.conversation_id);
    const result = await resumeConversationService(conversation_id);
    res.json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function listConversations(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project_id = req.query.project_id ? z.string().uuid().parse(String(req.query.project_id)) : null;
    const result = await getConversationsService(userId, project_id);
    res.json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}
