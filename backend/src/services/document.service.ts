import { Db } from "mongodb";
import { pgPool } from "../config/database";
import { insertDocument, listDocumentsByProject, getDocumentById, deleteDocumentById } from "../models/document.model";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { format as fmt } from "date-fns";
import archiver from "archiver";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import PDFDocument from "pdfkit";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function toHtml(content: string) {
  return `<!doctype html><html><head><meta charset='utf-8'><title>ReqNexa Document</title><style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica;line-height:1.6;padding:24px;color:#111}h1,h2,h3{margin:16px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}</style></head><body>${content}</body></html>`;
}

export class DocumentGenerator {
  constructor(private db: Db) {}

  async generateSRS(projectId: string, formatType: "pdf" | "docx" | "html", options: { include_toc?: boolean; include_glossary?: boolean; include_traceability?: boolean; template?: "ieee" | "agile" } = {}) {
    const projRes = await pgPool.query("SELECT id, name, type, description, status, created_at, updated_at FROM projects WHERE id=$1", [projectId]);
    if (projRes.rowCount === 0) throw new Error("Project not found");
    const project = projRes.rows[0];

    const reqRes = await pgPool.query(
      `SELECT id, type, category, priority, title, description, status, confidence_score, created_at, updated_at
       FROM requirements WHERE project_id=$1
       ORDER BY CASE WHEN type='functional' THEN 0 ELSE 1 END, 
                CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, created_at`,
      [projectId]
    );
    const requirements = reqRes.rows;

    const teamRes = await pgPool.query(
      `SELECT pm.user_id, u.name, pm.role FROM project_members pm 
       LEFT JOIN users u ON u.id = pm.user_id 
       WHERE pm.project_id=$1`,
      [projectId]
    );
    const members = teamRes.rows;

    const dateStr = fmt(new Date(), "yyyy-MM-dd");
    const cover = `<h1>${project.name} - Software Requirements Specification</h1><p>Version 1.0 • ${dateStr}</p>`;
    const toc = options.include_toc ? `<h2>Table of Contents</h2><ol><li>Introduction</li><li>Overall Description</li><li>System Features</li><li>Non-Functional Requirements</li><li>Appendices</li></ol>` : "";
    const intro = `<h2>1. Introduction</h2><h3>1.1 Purpose</h3><p>This document describes the requirements for ${project.name}.</p><h3>1.2 Scope</h3><p>Scope of the product and its objectives.</p><h3>1.3 Definitions & Acronyms</h3><p>Key terms used throughout.</p>`;
    const overall = `<h2>2. Overall Description</h2><h3>2.1 Product Perspective</h3><p>Context and perspective.</p><h3>2.2 User Classes</h3><p>Primary user roles.</p><h3>2.3 Operating Environment</h3><p>Target platforms and environments.</p>`;
    const functional = `<h2>3. System Features</h2>${requirements.filter((r: any) => r.type === "functional").map((r: any) => `<h3>${r.title}</h3><p>${r.description || ""}</p>`).join("")}`;
    const nfrGroups: Record<string, any[]> = {};
    requirements.filter((r: any) => r.type !== "functional").forEach((r: any) => { const k = (r.category || "General"); nfrGroups[k] = nfrGroups[k] || []; nfrGroups[k].push(r); });
    const nonfunctional = `<h2>4. Non-Functional Requirements</h2>${Object.keys(nfrGroups).map((k) => `<h3>${k}</h3>${nfrGroups[k].map((r) => `<p>${r.title} - ${r.description || ""}</p>`).join("")}`).join("")}`;
    const appendices = `<h2>5. Appendices</h2>${options.include_glossary ? "<h3>Glossary</h3><p>Glossary terms...</p>" : ""}${options.include_traceability ? "<h3>Requirement Traceability Matrix</h3><p>Traceability details...</p>" : ""}`;

    const htmlContent = toHtml([cover, toc, intro, overall, functional, nonfunctional, appendices].join(""));

    const baseDir = path.join(process.cwd(), "storage", "documents", projectId);
    ensureDir(baseDir);
    const filenameBase = `SRS_${project.name.replace(/\s+/g, "_")}_${Date.now()}`;

    let filepath = "";
    let outputFormat = formatType;
    let size = 0;
    if (formatType === "html") {
      filepath = path.join(baseDir, `${filenameBase}.html`);
      await writeFile(filepath, htmlContent, "utf-8");
      size = (await fs.promises.stat(filepath)).size;
    } else if (formatType === "pdf") {
      filepath = path.join(baseDir, `${filenameBase}.pdf`);
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text(`${project.name} - Software Requirements Specification`, { align: "left" });
      doc.moveDown();
      doc.fontSize(12).text(htmlContent.replace(/<[^>]+>/g, " "));
      doc.end();
      await new Promise<void>((resolve) => stream.on("finish", resolve));
      size = (await fs.promises.stat(filepath)).size;
    } else if (formatType === "docx") {
      const doc = new Document({ sections: [{ properties: {}, children: [new Paragraph({ text: `${project.name} - SRS`, heading: HeadingLevel.TITLE }), new Paragraph({ text: "Generated by ReqNexa AI" }), new Paragraph({ text: htmlContent.replace(/<[^>]+>/g, " ") })] }] });
      const buffer = await Packer.toBuffer(doc);
      filepath = path.join(baseDir, `${filenameBase}.docx`);
      await writeFile(filepath, buffer);
      size = (await fs.promises.stat(filepath)).size;
    }

    const id = await insertDocument(this.db, { project_id: projectId, filename: path.basename(filepath), format: outputFormat, size, path: filepath });
    const download_url = `/api/documents/${id}/download`;
    return { document_id: id, filename: path.basename(filepath), format: outputFormat, size, download_url };
  }

  async generateUserStories(projectId: string) {
    const reqRes = await pgPool.query(`SELECT id, title, description FROM requirements WHERE project_id=$1 AND type='functional' ORDER BY created_at`, [projectId]);
    const stories = reqRes.rows.map((r: any) => ({ id: r.id, story: `As a user, I want ${r.title} so that ${r.description || "I can achieve the goal"}.` }));
    const baseDir = path.join(process.cwd(), "storage", "documents", projectId);
    ensureDir(baseDir);
    const filename = `UserStories_${Date.now()}.json`;
    const filepath = path.join(baseDir, filename);
    await writeFile(filepath, JSON.stringify(stories, null, 2), "utf-8");
    const id = await insertDocument(this.db, { project_id: projectId, filename, format: "json", size: (await fs.promises.stat(filepath)).size, path: filepath });
    return { document_id: id, filename, format: "json", size: (await fs.promises.stat(filepath)).size, download_url: `/api/documents/${id}/download` };
  }

  async exportRequirements(projectId: string, format: "csv" | "json" | "xml") {
    const reqRes = await pgPool.query(
      `SELECT id, type, category, priority, title, description, status, confidence_score, created_at, updated_at FROM requirements WHERE project_id=$1 ORDER BY created_at`,
      [projectId]
    );
    const reqs = reqRes.rows;
    const baseDir = path.join(process.cwd(), "storage", "documents", projectId);
    ensureDir(baseDir);
    let filename = `Requirements_${Date.now()}.${format}`;
    const filepath = path.join(baseDir, filename);
    if (format === "json") {
      await writeFile(filepath, JSON.stringify(reqs, null, 2), "utf-8");
    } else if (format === "csv") {
      const header = Object.keys(reqs[0] || {}).join(",");
      const rows = reqs.map((r: any) => Object.values(r).map((v) => String(v).replace(/,/g, ";")).join(",")).join("\n");
      await writeFile(filepath, `${header}\n${rows}`, "utf-8");
    } else if (format === "xml") {
      const rows = reqs.map((r: any) => `<requirement>${Object.entries(r).map(([k,v]) => `<${k}>${String(v)}</${k}>`).join("")}</requirement>`).join("");
      await writeFile(filepath, `<?xml version="1.0" encoding="UTF-8"?><requirements>${rows}</requirements>`, "utf-8");
    }
    const size = (await fs.promises.stat(filepath)).size;
    const id = await insertDocument(this.db, { project_id: projectId, filename, format, size, path: filepath });
    return { document_id: id, filename, format, size, download_url: `/api/documents/${id}/download` };
  }

  async list(projectId: string) {
    const docs = await listDocumentsByProject(this.db, projectId);
    return docs.map((d) => ({ document_id: d._id as string, filename: d.filename, format: d.format, size: d.size, created_at: d.created_at, download_url: `/api/documents/${d._id}/download` }));
  }

  async get(documentId: string) {
    const doc = await getDocumentById(this.db, documentId);
    if (!doc) throw new Error("Not Found");
    return doc;
  }

  async delete(documentId: string) {
    const doc = await getDocumentById(this.db, documentId);
    if (!doc) return;
    try { await fs.promises.unlink(doc.path); } catch {}
    await deleteDocumentById(this.db, documentId);
  }
}
