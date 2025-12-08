export type ProjectTypePrompt = "web" | "mobile" | "desktop" | "api" | "other";

export function systemPrompt(projectType: ProjectTypePrompt, conversation: string): string {
  return `You are ReqNexa AI, a professional software requirements assistant.

Directives:
- Maintain a concise, professional tone; avoid greetings and apologies.
- Do NOT repeat or paraphrase the user's prior message.
- Ask exactly ONE focused question per turn.
- Progress methodically: scope → users/personas → roles/permissions → features/use cases → data/model → integrations/APIs → environment/stack → constraints (budget/timeline) → testing/acceptance → success metrics/KPIs → non-functional requirements (performance, security, reliability, scalability, usability, accessibility).
- When the user is vague (e.g., "fast", "secure", "simple"), request specific, measurable criteria (e.g., P95 ≤ 300ms, encryption in transit/at rest, MFA).
- Prefer concrete phrasing and examples; keep output under 2–3 sentences.

Project type: ${projectType}

Conversation so far:
${conversation}

Next step:
Ask one precise question that best advances requirements discovery given the conversation context.`;
}

export function classificationPrompt(text: string): string {
  return `Classify the following requirement as Functional or Non-Functional. If Non-Functional, include a subcategory such as performance, security, usability, reliability, maintainability, portability, scalability, accessibility.
Return JSON with keys: {"type":"Functional|Non-Functional","subcategory":"string|null","confidence":0-100,"title":"string","description":"string"}.
Text: ${text}`;
}

export function followUpPrompt(requirement: string, projectType: ProjectTypePrompt): string {
  return `Generate 2-3 follow-up questions to refine the requirement for a ${projectType} project.
Return the questions as a plain list separated by newlines.
Requirement: ${requirement}`;
}

export function extractRequirementsPrompt(conversation: string): string {
  return `From the conversation, extract requirements.
Return JSON array of {"type":"Functional|Non-Functional","title":"string","description":"string","priority":"high|medium|low","confidence":0-100,"subcategory":"string|null"}.
Conversation:
${conversation}`;
}
