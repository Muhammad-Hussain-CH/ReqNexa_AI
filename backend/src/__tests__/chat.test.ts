import request from "supertest";
import { createApp } from "../../src/app";
import { generateJWT } from "../../src/utils/password.utils";

jest.mock("../../src/services/chat.service", () => ({
  startConversationService: async (_payload: any) => ({ conversation_id: "c1", first_message: "Hello from mocked Gemini", message_id: "m1" }),
  sendMessageService: async (_payload: any) => ({ bot_response: "Hello from mocked Gemini", suggested_replies: [], extracted_requirement: null }),
  getConversationService: async (_cid: string) => ({ messages: [] }),
  resumeConversationService: async (_cid: string) => ({ message: "Hello from mocked Gemini" }),
  getConversationsService: async (_user_id: string, _project_id: string | null) => ({ conversations: [] }),
}));

describe("Chat API", () => {
  const app = createApp();
  const token = generateJWT("u1", "a@b.com", "client");

  test("Start conversation", async () => {
    const res = await request(app)
      .post("/api/chat/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ project_type: "web" });
    expect(res.status).toBe(201);
    expect(res.body.first_message).toContain("mocked Gemini");
  });

  test("Send message", async () => {
    const start = await request(app)
      .post("/api/chat/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ project_type: "web" });
    const cid = start.body.conversation_id;
    const res = await request(app)
      .post("/api/chat/message")
      .set("Authorization", `Bearer ${token}`)
      .send({ conversation_id: cid, message: "We must be secure" });
    expect(res.status).toBe(200);
    expect(res.body.bot_response).toContain("mocked Gemini");
  });

  test("Get conversation history", async () => {
    const start = await request(app)
      .post("/api/chat/start")
      .set("Authorization", `Bearer ${token}`)
      .send({ project_type: "web" });
    const cid = start.body.conversation_id;
    const res = await request(app)
      .get(`/api/chat/${cid}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.messages)).toBe(true);
  });
});
