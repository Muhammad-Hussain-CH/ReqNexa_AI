import { Request, Response } from "express";
import { z } from "zod";
import { createProjectService, getAllProjectsService, getProjectByIdService, updateProjectService, deleteProjectService, addTeamMemberService } from "../services/project.service";

export async function createProject(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({ name: z.string().min(2), type: z.enum(["web", "mobile", "desktop", "api", "other"]), description: z.string().nullable().optional() }).parse(req.body);
    const project = await createProjectService(userId, { name: body.name, type: body.type as any, description: body.description ?? null }, req.ip || "");
    res.status(201).json(project);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function getAllProjects(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const query = z.object({ page: z.coerce.number().min(1).default(1), limit: z.coerce.number().min(1).max(100).default(10), status: z.enum(["active", "completed", "archived"]).optional() }).parse(req.query);
    const result = await getAllProjectsService(userId, query.page, query.limit, query.status as any);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const result = await getProjectByIdService(userId, id);
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const body = z.object({ name: z.string().min(2).optional(), description: z.string().nullable().optional(), status: z.enum(["active", "completed", "archived"]).optional() }).parse(req.body);
    const project = await updateProjectService(userId, id, body as any, req.ip || "", role === "admin");
    res.json(project);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const result = await deleteProjectService(userId, id, req.ip || "", role === "admin");
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function addTeamMember(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = z.string().uuid().parse(req.params.id);
    const body = z.object({ user_id: z.string().uuid(), role: z.string().min(2), permissions: z.record(z.string(), z.any()).optional() }).parse(req.body);
    const result = await addTeamMemberService(userId, id, body, req.ip || "", role === "admin");
    res.json(result);
  } catch (err: any) {
    if (String(err.message).toLowerCase() === "forbidden") return res.status(403).json({ error: "Forbidden" });
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}
