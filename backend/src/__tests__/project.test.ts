import request from "supertest";
import { createApp } from "../../src/app";
import { pgPool } from "../../src/config/database";
import { generateJWT } from "../../src/utils/password.utils";

jest.mock("../../src/middleware/auth.middleware", () => ({
  authenticateToken: (req: any, _res: any, next: any) => { req.user = { id: "u1", email: "a@b.com", role: "client" }; next(); },
}));

describe("Project API", () => {
  const app = createApp();

  beforeEach(() => { (pgPool.query as jest.Mock).mockReset(); });

  test("Create project", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ id: "p1", user_id: "u1", name: "Proj", type: "web", description: null, status: "active" }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });
    const res = await request(app)
      .post("/api/projects")
      .send({ name: "Proj", type: "web", description: null });
    expect(res.status).toBe(201);
    expect(res.body.name || res.body.project?.name).toBe("Proj");
  });

  test("Get user's projects", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [{ count: 1 }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ id: "p1", user_id: "u1", name: "Proj", type: "web", description: null, status: "active" }], rowCount: 1 });
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBeGreaterThanOrEqual(1);
  });

  test("Update project", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rows: [{ id: "p1", user_id: "u1", name: "Updated", type: "web", description: null, status: "active" }], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });
    const res = await request(app).put("/api/projects/00000000-0000-0000-0000-000000000001").send({ name: "Updated" });
    expect(res.status).toBe(200);
  });

  test("Delete project", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });
    const res = await request(app).delete("/api/projects/00000000-0000-0000-0000-000000000001");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Add team member", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });
    const res = await request(app)
      .post("/api/projects/00000000-0000-0000-0000-000000000001/members")
      .send({ user_id: "00000000-0000-0000-0000-000000000002", role: "developer" });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
