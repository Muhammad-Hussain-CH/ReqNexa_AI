import { create } from "zustand";

type Message = { id?: string; role: "user" | "assistant"; content: string };

type ChatState = {
  conversationId: string | null;
  messages: Message[];
  setConversationId: (id: string | null) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  conversationId: null,
  messages: [],
  setConversationId: (id) => set({ conversationId: id }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
}));
