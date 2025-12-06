import { useEffect } from "react";
import { useChatStore } from "../stores/chat.store";

export function useChat(conversationId?: string) {
  const { selectConversation, setTyping } = useChatStore();
  useEffect(() => {
    if (conversationId) selectConversation(conversationId);
  }, [conversationId, selectConversation]);
  useEffect(() => {
    const timer = setTimeout(() => setTyping(false), 6000);
    return () => clearTimeout(timer);
  }, [setTyping]);
}
