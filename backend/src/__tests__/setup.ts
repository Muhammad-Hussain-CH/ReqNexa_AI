process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_1234567890";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "test_refresh_secret_1234567890";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
process.env.PORT = process.env.PORT || "5001";
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || "dummy";

jest.mock("../config/database", () => {
  const queries: { calls: any[] } = { calls: [] };
  return {
    pgPool: {
      query: jest.fn(async (sql: string, params?: any[]) => {
        queries.calls.push({ sql, params });
        return { rows: [], rowCount: 0 } as any;
      }),
      _debug: queries,
    },
  };
});

jest.mock("../services/gemini.service", () => {
  class GeminiServiceMock {
    async generateChatResponse() { return "Hello from mocked Gemini"; }
    async classifyRequirement(text: string) {
      return { type: /security/i.test(text) ? "Non-Functional" : "Functional", subcategory: null, confidence: 80, title: text.slice(0, 30), description: text };
    }
  }
  return { GeminiService: GeminiServiceMock };
});

// MongoDB removed; no mocks needed
