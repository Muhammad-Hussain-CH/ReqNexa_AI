import { Request, Response } from "express";
import { z } from "zod";
import { connectWithRetry } from "../config/mongodb";
import { DocumentGenerator } from "../services/document.service";

export async function generateDocument(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const body = z.object({
      project_id: z.string().uuid(),
      type: z.enum(["srs","user_stories","requirements_export"]),
      format: z.enum(["pdf","docx","html","csv","json","xml"]),
      template: z.enum(["ieee","agile"]).optional(),
      options: z.object({ include_toc: z.boolean().optional(), include_glossary: z.boolean().optional(), include_traceability: z.boolean().optional(), include_diagrams: z.boolean().optional() }).optional(),
    }).parse(req.body);
    const db = await connectWithRetry();
    const gen = new DocumentGenerator(db);
    let result: any;
    if (body.type === "srs") {
      result = await gen.generateSRS(body.project_id, body.format as any, { ...(body.options || {}), template: (body.template as any) || "ieee" });
    } else if (body.type === "user_stories") {
      result = await gen.generateUserStories(body.project_id);
    } else if (body.type === "requirements_export") {
      result = await gen.exportRequirements(body.project_id, body.format as any);
    }
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Bad Request" });
  }
}

export async function listDocuments(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const project_id = z.string().uuid().parse(req.params.project_id);
    const db = await connectWithRetry();
    const gen = new DocumentGenerator(db);
    const docs = await gen.list(project_id);
    res.json({ documents: docs });
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}

export async function downloadDocument(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const document_id = z.string().parse(req.params.document_id);
    const db = await connectWithRetry();
    const gen = new DocumentGenerator(db);
    const doc = await gen.get(document_id);
    const ext = doc.format.toLowerCase();
    const mime = ext === "pdf" ? "application/pdf" : ext === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ext === "html" ? "text/html" : ext === "csv" ? "text/csv" : ext === "json" ? "application/json" : ext === "xml" ? "application/xml" : "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.setHeader("Content-Disposition", `attachment; filename=${doc.filename}`);
    res.download(doc.path);
  } catch (err: any) { res.status(404).json({ error: err.message || "Not Found" }); }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const userId = req.user?.id; if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const document_id = z.string().parse(req.params.document_id);
    const db = await connectWithRetry();
    const gen = new DocumentGenerator(db);
    await gen.delete(document_id);
    res.json({ success: true });
  } catch (err: any) { res.status(400).json({ error: err.message || "Bad Request" }); }
}
