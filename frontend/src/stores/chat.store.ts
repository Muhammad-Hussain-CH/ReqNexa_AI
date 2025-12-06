import { create } from "zustand";
import { getConversation, getConversations, sendMessage as apiSend, startConversation as apiStart, resumeConversation } from "../services/chat.service";

type Message = { id?: string; role: "user" | "assistant"; content: string; created_at?: string };
type Conversation = { _id: string; title: string; project_id?: string | null; created_at?: string; updated_at?: string };

type ChatState = {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  loadConversations: (projectId?: string | null) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  sendMessage: (text: string, projectId?: string | null, projectType?: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setTyping: (b: boolean) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  async loadConversations(projectId) {
    set({ isLoading: true });
    try {
      const res = await getConversations(projectId);
      set({ conversations: res.conversations ?? [], isLoading: false });
    } catch {
      set({ conversations: [], isLoading: false });
    }
  },
  async selectConversation(id) {
    set({ isLoading: true, activeConversation: id });
    try {
      const res = await getConversation(id);
      set({ messages: res.messages ?? [], isLoading: false });
    } catch {
      set({ messages: [], isLoading: false });
    }
  },
  async sendMessage(text, projectId, projectType) {
    const id = get().activeConversation;
    if (!id || !text) return;
    set((s) => ({ messages: [...s.messages, { role: "user", content: text }] }));
    set({ isTyping: true });
    try {
      const res = await apiSend(id, text, projectId, projectType);
      set((s) => ({ messages: [...s.messages, { role: "assistant", content: res.bot_response }], isTyping: false }));
    } catch {
      set({ isTyping: false });
    }
  },
  addMessage(message) {
    set((s) => ({ messages: [...s.messages, message] }));
  },
  setTyping(b) {
    set({ isTyping: b });
  },
}));
