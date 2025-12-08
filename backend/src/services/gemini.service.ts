import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPTS } from "../config/systemPrompts";
import { CONVERSATION_STAGES } from "../config/conversationFlow";
import { AMBIGUOUS_TERMS, MISSING_INFO_PATTERNS } from "../config/ambiguityRules";

export type ChatTurn = { role: "user" | "assistant"; content: string };

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateChatResponse(
    conversationHistory: Array<{ role: string; content: string }>,
    projectType: string,
    currentStage?: string
  ) {
    try {
      // Build comprehensive prompt
      const systemPrompt = this.buildSystemPrompt(projectType);
      const stage = currentStage || this.computeStage(conversationHistory.length);
      const contextPrompt = this.buildContextPrompt(conversationHistory, stage);
      
      const fullPrompt = `${systemPrompt}

${contextPrompt}

CONVERSATION SO FAR:
${this.formatConversationHistory(conversationHistory)}

YOUR TASK:
 Based on the conversation stage "${stage}" and the information gathered so far:
1. Analyze if the last user response contains any ambiguous terms
2. Check if critical information is missing
3. Generate the next most appropriate question following the requirement engineering methodology
4. If enough information is gathered for current stage, suggest moving to next stage

Generate ONLY the next question or response (2-3 sentences maximum). Be specific, professional, and focused on gathering complete requirements.`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  private computeStage(len: number): string {
    if (len < 4) return "introduction";
    if (len < 12) return "core_functionality";
    if (len < 18) return "user_roles";
    if (len < 24) return "non_functional";
    if (len < 30) return "integrations";
    if (len < 35) return "constraints";
    if (len < 40) return "error_handling";
    return "completion";
  }

  private buildSystemPrompt(projectType: string): string {
    let prompt = SYSTEM_PROMPTS.MAIN;
    
    // Add project-specific context
    switch(projectType.toLowerCase()) {
      case 'web':
      case 'web_app':
        prompt += `\n\n${SYSTEM_PROMPTS.WEB_APP}`;
        break;
      case 'mobile':
      case 'mobile_app':
        prompt += `\n\n${SYSTEM_PROMPTS.MOBILE_APP}`;
        break;
      case 'desktop':
        prompt += `\n\n${SYSTEM_PROMPTS.DESKTOP_APP}`;
        break;
      case 'api':
      case 'backend':
        prompt += `\n\n${SYSTEM_PROMPTS.API_SERVICE}`;
        break;
    }

    return prompt;
  }

  private buildContextPrompt(history: any[], stage: string): string {
    // Add stage-specific context
    const stageQuestions = (CONVERSATION_STAGES as Record<string, { stage: string; questions: string[] }>)[stage.toUpperCase()]?.questions || [];
    
    return `CURRENT STAGE: ${stage}
STAGE OBJECTIVE: ${this.getStageObjective(stage)}
SAMPLE QUESTIONS FOR THIS STAGE:
${stageQuestions.slice(0, 3).join('\n')}`;
  }

  private formatConversationHistory(history: any[]): string {
    return history.slice(-10).map(msg => 
      `${msg.role === 'user' ? 'CLIENT' : 'REQNEXA AI'}: ${msg.content}`
    ).join('\n\n');
  }

  private getStageObjective(stage: string): string {
    const objectives: Record<string, string> = {
      introduction: 'Understand project type and main purpose',
      core_functionality: 'Gather all primary features and functions',
      user_roles: 'Define user types and their permissions',
      non_functional: 'Collect performance, security, and quality requirements',
      integrations: 'Identify external systems and APIs',
      constraints: 'Document technical, budget, and timeline constraints',
      error_handling: 'Define error scenarios and validation rules',
      completion: 'Review and confirm all requirements'
    };
    return objectives[stage] || 'Continue requirement gathering';
  }

  // Detect ambiguity in user response
  async detectAmbiguity(userMessage: string): Promise<{
    hasAmbiguity: boolean;
    ambiguousTerm?: string;
    clarification?: string;
  }> {
    const lowerMessage = userMessage.toLowerCase();
    
    const entries = Object.entries(AMBIGUOUS_TERMS) as Array<[string, { terms: string[]; clarification: string }]>;
    for (const [category, config] of entries) {
      for (const term of config.terms) {
        if (lowerMessage.includes(term)) {
          return {
            hasAmbiguity: true,
            ambiguousTerm: term,
            clarification: config.clarification.replace('{term}', term)
          };
        }
      }
    }

    return { hasAmbiguity: false };
  }

  async generateFollowUpQuestions(text: string, projectType: string = "other"): Promise<string[]> {
    const t = (text || "").toLowerCase();
    const map: Array<{ when: RegExp; suggestions: string[] }> = [
      { when: /\bscope|goal|objective|vision\b/, suggestions: ["Main user problem to solve?", "What is out of scope?"] },
      { when: /\buser|persona|audience\b/, suggestions: ["Primary persona?", "Accessibility needs (WCAG)?"] },
      { when: /\brole|permission|access\b/, suggestions: ["Admin vs member permissions?", "SSO/MFA required?"] },
      { when: /\bfeature|story|use case\b/, suggestions: ["List three must-haves", "Any reporting or exports?"] },
      { when: /\bdata|schema|model|entity\b/, suggestions: ["Sensitive fields needing encryption?", "Retention policy?"] },
      { when: /\bintegration|api|third|external\b/, suggestions: ["OAuth, webhooks, polling?", "Rate limits to expect?"] },
      { when: /\bperformance|latency|response|load\b/, suggestions: ["P95 ≤ 300ms?", "Peak RPS/concurrency?"] },
      { when: /\bsecurity|auth|encrypt|compliance\b/, suggestions: ["Compliance (SOC2/GDPR)?", "Audit logging needs?"] },
      { when: /\breliab|uptime|availability|backup|dr\b/, suggestions: ["Uptime SLA?", "RTO/RPO targets?"] },
      { when: /\bscalab|concurrency|traffic\b/, suggestions: ["Horizontal scaling?", "Expected growth per month?"] },
      { when: /\busab|ux|ui|accessibility\b/, suggestions: ["WCAG level?", "Localization needed?"] },
      { when: /\bbudget|timeline|deadline|constraint\b/, suggestions: ["Budget cap?", "Key milestones?"] },
      { when: /\bstack|tech|language|framework|cloud\b/, suggestions: ["Preferred frameworks?", "Cloud region/hosting?"] },
      { when: /\btest|qa|acceptance\b/, suggestions: ["Acceptance criteria?", "Automation coverage?"] },
      { when: /\bmetric|kpi|success\b/, suggestions: ["North-star KPI?", "Analytics requirements?"] },
    ];
    const found = map.find((m) => m.when.test(t));
    const base = found?.suggestions || [
      `Any domain constraints specific to ${projectType}?`,
      "Must-haves vs nice-to-haves?",
      "Risks or assumptions we should note?",
    ];
    return base.slice(0, 3);
  }

  async classifyRequirement(text: string): Promise<{ type: string; subcategory: string | null; confidence: number; title: string; description: string }> {
    const type = /\b(performance|security|usability|reliability|maintainability|scalability|accessibility)\b/i.test(text) ? "Non-Functional" : "Functional";
    return { type, subcategory: null, confidence: 60, title: text.slice(0, 80), description: text };
  }

  // Extract requirements from conversation
  async extractRequirements(conversationHistory: any[]): Promise<any[]> {
    const prompt = `As a requirement analyst, extract all software requirements from this conversation.

CONVERSATION:
${this.formatConversationHistory(conversationHistory)}

Extract requirements in this JSON format:
[
  {
    "id": "REQ-001",
    "type": "functional" or "non_functional",
    "category": "authentication|data|ui|performance|security|etc",
    "priority": "high|medium|low",
    "title": "Brief title",
    "description": "Detailed requirement statement using 'The system shall...'",
    "acceptance_criteria": ["criterion 1", "criterion 2"],
    "source": "Mentioned by client in conversation"
  }
]

Return ONLY valid JSON array. Extract ALL requirements mentioned.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response.text();
    
    // Parse JSON response
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse requirements:', error);
    }

    return [];
  }
}

export { GeminiService };
export default new GeminiService();
