import request from "supertest";
import { createApp } from "../../src/app";
import { pgPool } from "../../src/config/database";
import * as password from "../../src/utils/password.utils";

describe("Auth API", () => {
  const app = createApp();

  beforeEach(() => {
    (pgPool.query as jest.Mock).mockReset();
  });

  test("User registration with valid data", async () => {
    (pgPool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [{ id: "u1", email: "a@b.com", password_hash: "hash", name: "Alice", role: "client", is_active: true }], rowCount: 1 });
    jest.spyOn(password, "hashPassword").mockResolvedValue("hash");

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@b.com", password: "Aa123456", name: "Alice", role: "client" });

    expect(res.status).toBe(201);
    expect(res.body.tokens.accessToken).toBeTruthy();
  });

  test("User registration with duplicate email (should fail)", async () => {
    (pgPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "u1" }], rowCount: 1 });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dup@b.com", password: "Aa123456", name: "Dup", role: "client" });
    expect(res.status).toBe(400);
  });

  test("User login with correct credentials", async () => {
    (pgPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "u1", email: "a@b.com", password_hash: "hash", name: "Alice", role: "client", is_active: true }], rowCount: 1 });
    jest.spyOn(password, "comparePassword").mockResolvedValue(true);
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com", password: "Aa123456" });
    expect(res.status).toBe(200);
    expect(res.body.tokens.accessToken).toBeTruthy();
  });

  test("User login with wrong password (should fail)", async () => {
    (pgPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "u1", email: "a@b.com", password_hash: "hash", name: "Alice", role: "client", is_active: true }], rowCount: 1 });
    jest.spyOn(password, "comparePassword").mockResolvedValue(false);
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com", password: "wrong" });
    expect(res.status).toBe(401);
  });

  test("JWT token verification", async () => {
    (pgPool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "u1", email: "a@b.com", password_hash: "hash", name: "Alice", role: "client", is_active: true }], rowCount: 1 });
    jest.spyOn(password, "comparePassword").mockResolvedValue(true);
    const res = await request(app).post("/api/auth/login").send({ email: "a@b.com", password: "Aa123456" });
    const token = res.body.tokens.accessToken as string;
    const decoded = password.verifyToken(token);
    expect(decoded.sub).toBe("u1");
  });

  test("Protected route access without token (should fail)", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(401);
  });
});
