import { GeminiService, ChatTurn } from "./gemini.service";
import { Db } from "mongodb";
import { pgPool } from "../config/database";
import { createConversation, saveMessage, getLastMessages, getMessages, getConversationsByUser } from "../models/conversation.model";
import { ChatMessage, Conversation } from "../types/models";
import { ProjectTypePrompt } from "../utils/prompt-templates";

type StartPayload = { user_id: string; project_id: string | null; project_type: ProjectTypePrompt };

type SendPayload = { conversation_id: string; message: string; user_id: string; project_id: string | null; project_type?: ProjectTypePrompt };

function formatHistory(messages: ChatMessage[]): string {
  return messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
}

let gemini: GeminiService;
try {
  gemini = new GeminiService();
} catch {
  gemini = {
    generateChatResponse: async () => "Hello! I'm ReqNexa AI. Tell me about your requirements.",
    generateFollowUpQuestions: async () => [
      "Can you clarify the scope?",
      "Who are the target users?",
      "Any performance/security constraints?",
    ],
    classifyRequirement: async (text: string) => ({
      type: /\b(performance|security|usability|reliability|maintainability|scalability|accessibility)\b/i.test(text) ? "Non-Functional" : "Functional",
      subcategory: null,
      confidence: 60,
      title: text.slice(0, 80),
      description: text,
    }),
    extractRequirements: async () => [],
    detectAmbiguity: (msg: string) => ({ ambiguous: /\b(fast|secure|user-friendly|simple)\b/i.test(msg), terms: [] }),
  } as any;
}

export async function startConversationService(db: Db, payload: StartPayload) {
  const conversationId = await createConversation(db, {
    user_id: payload.user_id,
    project_id: payload.project_id,
    title: "Requirement Gathering",
  });

  const welcome = await gemini.generateChatResponse([], payload.project_type);

  const firstId = await saveMessage(db, {
    conversation_id: conversationId,
    role: "assistant",
    content: welcome,
    metadata: null,
  });

  return { conversation_id: conversationId, first_message: welcome, message_id: firstId };
}

function containsRequirement(text: string): boolean {
  return /\b(must|should|need to|require|shall)\b/i.test(text);
}

export async function sendMessageService(db: Db, payload: SendPayload) {
  await saveMessage(db, {
    conversation_id: payload.conversation_id,
    role: "user",
    content: payload.message,
    metadata: null,
  });

  const history = await getLastMessages(db, payload.conversation_id, 10);
  const turns: ChatTurn[] = history.map((m) => ({ role: m.role as any, content: m.content }));
  turns.push({ role: "user", content: payload.message });
  const bot = await gemini.generateChatResponse(turns, (payload.project_type || "other") as ProjectTypePrompt);

  let extracted_requirement: any = null;
  if (containsRequirement(payload.message)) {
    const classify = await gemini.classifyRequirement(payload.message);
    if (classify && payload.project_id) {
      const type = classify.type === "Non-Functional" ? "non_functional" : "functional";
      const priority = "medium";
      const status = "draft";
      const res = await pgPool.query(
        `INSERT INTO requirements (project_id, type, category, priority, title, description, status, confidence_score, created_by)
         VALUES ($1, $2::requirement_type_enum, $3, $4::requirement_priority_enum, $5, $6, $7::requirement_status_enum, $8, $9)
         RETURNING id`,
        [
          payload.project_id,
          type,
          classify.subcategory || null,
          priority,
          classify.title || payload.message.slice(0, 80),
          classify.description || payload.message,
          status,
          Number(classify.confidence ?? 60),
          payload.user_id,
        ]
      );
      extracted_requirement = { id: res.rows[0].id, type: classify.type, subcategory: classify.subcategory, confidence: classify.confidence };
    }
  }

  await saveMessage(db, {
    conversation_id: payload.conversation_id,
    role: "assistant",
    content: bot,
    metadata: { extracted_requirement },
  });

  const suggested_replies = [
    "Can you provide specific performance targets (e.g., response time)?",
    "Are there any security compliance requirements (e.g., OWASP, SOC2)?",
    "Which user roles and permissions are needed?",
  ];

  return { bot_response: bot, suggested_replies, extracted_requirement };
}

export async function getConversationService(db: Db, conversation_id: string) {
  const messages = await getMessages(db, conversation_id);
  return { messages };
}

export async function resumeConversationService(db: Db, conversation_id: string) {
  const history = await getLastMessages(db, conversation_id, 10);
  const turns: ChatTurn[] = history.map((m) => ({ role: m.role as any, content: m.content }));
  const bot = await gemini.generateChatResponse(turns, "other");
  await saveMessage(db, { conversation_id, role: "assistant", content: bot, metadata: null });
  return { message: bot };
}

export async function getConversationsService(db: Db, user_id: string, project_id: string | null) {
  const conversations = await getConversationsByUser(db, user_id, project_id);
  return { conversations };
}
