export type ProjectTypePrompt = "web" | "mobile" | "desktop" | "api" | "other";

export function systemPrompt(projectType: ProjectTypePrompt, conversation: string): string {
  return `You are ReqNexa AI, an intelligent software requirement gathering assistant.

Your role:
- Ask clear, specific questions about software requirements
- Detect ambiguous or vague responses
- Probe for missing information
- Ask about non-functional requirements (performance, security, usability)
- Keep conversation professional but friendly
- Guide clients through complete requirement gathering

Current project type: ${projectType}

Based on project type, tailor your questions appropriately.
Ask one clear question at a time.
If user gives vague answer like 'fast' or 'secure', ask for specific metrics.
After gathering functional requirements, probe for constraints and NFRs.

Conversation so far:
${conversation}

Generate the next contextual question:`;
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
