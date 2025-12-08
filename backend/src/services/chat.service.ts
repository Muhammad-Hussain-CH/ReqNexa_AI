import { GeminiService, ChatTurn } from "./gemini.service";
import { pgPool } from "../config/database";
import { createConversation, saveMessage, getLastMessages, getMessages, getConversationsByUser } from "../models/conversation.model";
import { ChatMessage, Conversation } from "../types/models";
import { ProjectTypePrompt } from "../utils/prompt-templates";

type StartPayload = { user_id: string; project_id: string | null; project_type: ProjectTypePrompt };

type SendPayload = { conversation_id: string; message: string; user_id: string; project_id: string | null; project_type?: ProjectTypePrompt };

function formatHistory(messages: ChatMessage[]): string {
  return messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
}

const fallbackGemini = {
    generateChatResponse: async (turns: ChatTurn[] = [], projectType: ProjectTypePrompt = "other") => {
      const lower = turns.map((t) => t.content.toLowerCase()).join(" \n ");
      const lastUser = [...turns].reverse().find((t) => t.role === "user")?.content || "";
      const ambiguous = /\b(fast|secure|user-friendly|simple|easy|scalable)\b/.test(lastUser.toLowerCase());
      const pt = String(projectType || "other").toLowerCase();
      if (ambiguous) {
        return "To ensure measurable outcomes, could you specify concrete criteria (for example, target P95 response time, authentication method, and required security standards)?";
      }
      if (/e[-\s]?commerce|store|shop|retail/.test(lastUser.toLowerCase()) || pt === "ecommerce" || pt === "web") {
        return "To scope your e‑commerce platform, who are the primary customer segments (B2C or B2B), and roughly how many products and variants will you manage?";
      }
      const topics: Array<{ patterns: RegExp[]; question: string }> = [
        { patterns: [/\b(scope|goal|objective|problem|vision)\b/, /\bfeature\b/], question: "To frame the project, what is the primary objective and success criteria?" },
        { patterns: [/\buser\b/, /\bpersona\b/, /\baudience\b/], question: "Who are the key user groups and stakeholders, and what outcomes do they expect?" },
        { patterns: [/\brole\b/, /\bpermission\b/, /\baccess\b/], question: "Which roles exist and what permissions should each have?" },
        { patterns: [/\bfeature\b/, /\bstory\b/, /\buse case\b/], question: "Please list three must‑have features and up to three nice‑to‑haves." },
        { patterns: [/\bdata\b/, /\bschema\b/, /\bmodel\b/, /\bentity\b/], question: "What core data entities will the system manage, and are any fields sensitive?" },
        { patterns: [/\bintegration\b/, /\bapi\b/, /\bthird\b/, /\bexternal\b/], question: "Which external systems or APIs must be integrated, and what data will be exchanged?" },
        { patterns: [/\bperformance\b/, /\blatency\b/, /\bresponse\b/, /\bload\b/], question: "What performance targets should we meet under typical and peak loads?" },
        { patterns: [/\bsecurity\b/, /\bauth\b/, /\bencrypt\b/, /\bcompliance\b/], question: "What security requirements apply, including auth method and any compliance standards?" },
        { patterns: [/\breliab\b/, /\buptime\b/, /\bavailability\b/, /\bbackup\b/, /\bdr\b/], question: "Do you have availability targets and backup/disaster recovery expectations?" },
        { patterns: [/\bscalab\b/, /\bconcurrency\b/, /\btraffic\b/], question: "What growth or traffic levels should the system scale to support?" },
        { patterns: [/\busab\b/, /\bux\b/, /\bui\b/, /\baccessibility\b/], question: "Are there accessibility or UX guidelines we must follow?" },
        { patterns: [/\bbudget\b/, /\btimeline\b/, /\bdeadline\b/, /\bconstraint\b/], question: "What budget or timeline constraints should guide scope and prioritization?" },
      ];
      const covered = (pats: RegExp[]) => pats.some((r) => r.test(lower));
      const next = topics.find((t) => !covered(t.patterns));
      if (next) return next.question;
      return `Are there remaining constraints, risks, or compliance considerations we should capture for this ${projectType} project?`;
    },
    generateFollowUpQuestions: async (text: string, projectType: ProjectTypePrompt = "other") => {
      const t = (text || "").toLowerCase();
      if (/e[-\s]?commerce|store|shop|retail/.test(t) || String(projectType).toLowerCase() === "ecommerce") {
        return [
          "Payment methods and checkout flow?",
          "Shipping, taxes, and returns policies?",
          "Product variants, inventory, and catalog size?",
        ];
      }
      const map: Array<{ when: RegExp; suggestions: string[] }> = [
        { when: /\bscope|goal|objective|vision\b/, suggestions: ["Primary objective and success criteria?", "What is out of scope?"] },
        { when: /\buser|persona|audience\b/, suggestions: ["Key personas and needs?", "Accessibility requirements (WCAG)?"] },
        { when: /\brole|permission|access\b/, suggestions: ["Role matrix and permissions?", "SSO/MFA required?"] },
        { when: /\bfeature|story|use case\b/, suggestions: ["Three must‑haves", "Any reporting or exports?"] },
        { when: /\bdata|schema|model|entity\b/, suggestions: ["Sensitive fields to encrypt?", "Retention policy?"] },
        { when: /\bintegration|api|third|external\b/, suggestions: ["OAuth/webhooks/polling?", "Expected rate limits?"] },
        { when: /\bperformance|latency|response|load\b/, suggestions: ["Target P95 response time?", "Peak RPS/concurrency?"] },
        { when: /\bsecurity|auth|encrypt|compliance\b/, suggestions: ["Compliance (SOC2/GDPR)?", "Audit logging needs?"] },
        { when: /\breliab|uptime|availability|backup|dr\b/, suggestions: ["Uptime SLA?", "RTO/RPO targets?"] },
        { when: /\bscalab|concurrency|traffic\b/, suggestions: ["Horizontal scaling?", "Growth expectations?"] },
        { when: /\busab|ux|ui|accessibility\b/, suggestions: ["WCAG level?", "Localization needed?"] },
        { when: /\bbudget|timeline|deadline|constraint\b/, suggestions: ["Budget range?", "Key milestones?"] },
      ];
      const found = map.find((m) => m.when.test(t));
      const base = found?.suggestions || [
        `Any domain constraints specific to ${projectType}?`,
        "Top risks or assumptions to note?",
        "Stakeholder review cadence?",
      ];
      return base.slice(0, 3);
    },
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

const useRemote = Boolean(process.env.GEMINI_API_KEY);
const gemini: GeminiService | typeof fallbackGemini = useRemote ? new GeminiService() : fallbackGemini;

export async function startConversationService(payload: StartPayload) {
  const conversationId = await createConversation({
    user_id: payload.user_id,
    project_id: payload.project_id,
    title: "Requirement Gathering",
  });

  let welcome: string;
  try {
    welcome = await gemini.generateChatResponse([], payload.project_type);
  } catch (err: any) {
    welcome = await fallbackGemini.generateChatResponse([], payload.project_type);
  }

  const firstId = await saveMessage({
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

export async function sendMessageService(payload: SendPayload) {
  await saveMessage({
    conversation_id: payload.conversation_id,
    role: "user",
    content: payload.message,
    metadata: null,
  });

  const history = await getLastMessages(payload.conversation_id, 10);
  const turns: ChatTurn[] = history.map((m) => ({ role: m.role as any, content: m.content }));
  let bot: string;
  try {
    bot = await gemini.generateChatResponse(turns, (payload.project_type || "other") as ProjectTypePrompt);
  } catch (err: any) {
    bot = await fallbackGemini.generateChatResponse(turns, (payload.project_type || "other") as ProjectTypePrompt);
  }

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

  await saveMessage({
    conversation_id: payload.conversation_id,
    role: "assistant",
    content: bot,
    metadata: { extracted_requirement },
  });

  let suggested_replies: string[];
  try {
    suggested_replies = await (gemini as any).generateFollowUpQuestions(payload.message, (payload.project_type || "other") as ProjectTypePrompt);
  } catch {
    suggested_replies = await fallbackGemini.generateFollowUpQuestions(payload.message, (payload.project_type || "other") as ProjectTypePrompt);
  }

  return { bot_response: bot, suggested_replies, extracted_requirement };
}

export async function getConversationService(conversation_id: string) {
  const messages = await getMessages(conversation_id);
  return { messages };
}

export async function resumeConversationService(conversation_id: string) {
  const history = await getLastMessages(conversation_id, 10);
  const turns: ChatTurn[] = history.map((m) => ({ role: m.role as any, content: m.content }));
  let bot: string;
  try {
    bot = await gemini.generateChatResponse(turns, "other");
  } catch {
    bot = await fallbackGemini.generateChatResponse(turns, "other");
  }
  await saveMessage({ conversation_id, role: "assistant", content: bot, metadata: null });
  return { message: bot };
}

export async function getConversationsService(user_id: string, project_id: string | null) {
  const conversations = await getConversationsByUser(user_id, project_id);
  return { conversations };
}
