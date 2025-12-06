import { Request, Response } from "express";
import { z } from "zod";
import { getRequirementsService, getRequirementByIdService, createRequirementService, updateRequirementService, deleteRequirementService, classifyRequirementService, bulkUpdateRequirementsService } from "../services/requirement.service";

export async function getRequirements(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const query = z.object({
      project_id: z.string().uuid().optional(),
      type: z.enum(["functional","non_functional"]).optional(),
      priority: z.enum(["high","medium","low"]).optional(),
      status: z.enum(["draft","review","approved"]).optional(),
      category: z.string().optional(),
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(10),
      sort_by: z.enum(["created_at","updated_at","priority","status"]).optional(),
      sort_order: z.enum(["asc","desc"]).optional(),
    }).parse(req.query);
    const result = await getRequirementsService(userId, query as any);
    res.json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function getRequirementById(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const result = await getRequirementByIdService(userId, id);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(404).json({ error: err.message || "Not Found" });
  }
}

export async function createRequirement(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({
      project_id: z.string().uuid(),
      type: z.enum(["functional","non_functional"]),
      category: z.string().nullable().optional(),
      priority: z.enum(["high","medium","low"]),
      title: z.string().min(2),
      description: z.string().nullable().optional(),
    }).parse(req.body);
    const result = await createRequirementService(userId, body as any);
    res.status(201).json(result);
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function updateRequirement(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const body = z.object({ title: z.string().min(2).optional(), description: z.string().nullable().optional(), type: z.enum(["functional","non_functional"]).optional(), category: z.string().nullable().optional(), priority: z.enum(["high","medium","low"]).optional(), status: z.enum(["draft","review","approved"]).optional() }).parse(req.body);
    const result = await updateRequirementService(userId, id, body as any);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function deleteRequirement(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const result = await deleteRequirementService(userId, id);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function classifyRequirement(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const result = await classifyRequirementService(userId, id);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function bulkUpdate(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({ requirement_ids: z.array(z.string().uuid()).min(1), updates: z.object({ status: z.enum(["draft","review","approved"]).optional(), priority: z.enum(["high","medium","low"]).optional(), category: z.string().nullable().optional() }) }).parse(req.body);
    const result = await bulkUpdateRequirementsService(userId, body.requirement_ids, body.updates as any);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}
