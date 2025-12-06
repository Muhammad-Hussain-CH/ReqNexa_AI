import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../lib/env";
import { ProjectTypePrompt, systemPrompt, classificationPrompt, followUpPrompt, extractRequirementsPrompt } from "../utils/prompt-templates";

export type ChatTurn = { role: "user" | "assistant" | "system"; content: string };

type Classification = {
  type: "Functional" | "Non-Functional";
  subcategory: string | null;
  confidence: number;
  title: string;
  description: string;
};

type ExtractedRequirement = {
  type: "Functional" | "Non-Functional";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  confidence: number;
  subcategory: string | null;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, max = 3) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt += 1;
      const isRateLimit = err?.status === 429 || /rate limit/i.test(String(err?.message));
      if (attempt > max) throw err;
      const backoff = isRateLimit ? 3000 * attempt : 1000 * attempt;
      await sleep(backoff);
    }
  }
}

export class GeminiService {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.modelName = "gemini-pro";
  }

  private formatConversation(history: ChatTurn[]): string {
    return history
      .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
      .join("\n");
  }

  async generateChatResponse(conversationHistory: ChatTurn[], projectType: ProjectTypePrompt): Promise<string> {
    const conv = this.formatConversation(conversationHistory);
    const prompt = systemPrompt(projectType, conv);
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result?.response?.text?.() || "";
    if (!text) throw new Error("Invalid response");
    return text.trim();
  }

  detectAmbiguity(userMessage: string): { ambiguous: boolean; terms: string[] } {
    const terms = ["fast", "secure", "user-friendly", "simple"];
    const found = terms.filter((t) => new RegExp(`\\b${t}\\b`, "i").test(userMessage));
    return { ambiguous: found.length > 0, terms: found };
  }

  async generateFollowUpQuestions(requirement: string, projectType: ProjectTypePrompt): Promise<string[]> {
    const prompt = followUpPrompt(requirement, projectType);
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result?.response?.text?.() || "";
    if (!text) throw new Error("Invalid response");
    return text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s);
  }

  async classifyRequirement(requirementText: string): Promise<Classification> {
    const prompt = classificationPrompt(requirementText);
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result?.response?.text?.() || "";
    if (!text) throw new Error("Invalid response");
    try {
      const parsed = JSON.parse(text) as Classification;
      const confidence = Math.max(0, Math.min(100, Number(parsed.confidence ?? 0)));
      return { ...parsed, confidence };
    } catch {
      const fallback: Classification = {
        type: /non\s*-?functional/i.test(text) ? "Non-Functional" : "Functional",
        subcategory: null,
        confidence: 60,
        title: requirementText.slice(0, 80),
        description: requirementText,
      };
      return fallback;
    }
  }

  async extractRequirements(conversationHistory: ChatTurn[]): Promise<ExtractedRequirement[]> {
    const conv = this.formatConversation(conversationHistory);
    const prompt = extractRequirementsPrompt(conv);
    const model = this.client.getGenerativeModel({ model: this.modelName });
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result?.response?.text?.() || "";
    if (!text) throw new Error("Invalid response");
    try {
      const parsed = JSON.parse(text) as ExtractedRequirement[];
      return parsed.map((r) => ({
        ...r,
        confidence: Math.max(0, Math.min(100, Number(r.confidence ?? 0))),
        subcategory: r.subcategory ?? null,
      }));
    } catch {
      return [];
    }
  }
}
