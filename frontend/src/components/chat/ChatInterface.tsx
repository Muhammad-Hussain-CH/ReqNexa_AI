import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChatStore } from "../../stores/chat.store";
import { Paperclip, Send } from "lucide-react";

export default function ChatInterface() {
  const { messages, isTyping, sendMessage } = useChatStore();
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }
  async function handleSend() {
    if (!text.trim()) return;
    await sendMessage(text);
    setText("");
    setCount(0);
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">Web</span>
          <div className="w-40 h-2 bg-gray-200 rounded">
            <div className="h-2 bg-primary rounded" style={{ width: "30%" }} />
          </div>
        </div>
        <button className="px-3 py-2 rounded border hover:bg-gray-50">Export</button>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 p-2">
        {!messages.length && <div className="h-full grid place-items-center text-gray-500">Start a conversation</div>}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="mt-3">
        <div className="flex items-end gap-2">
          <button className="p-2 rounded border hover:bg-gray-50"><Paperclip className="w-5 h-5" /></button>
          <textarea
            className="flex-1 px-3 py-2 border rounded resize-none"
            rows={Math.min(6, Math.max(1, Math.ceil(text.length / 60)))}
            value={text}
            onChange={(e) => { setText(e.target.value); setCount(e.target.value.length); }}
            onKeyDown={onKeyDown}
            placeholder="Type your message..."
          />
          <button className="px-4 py-2 rounded bg-primary text-white flex items-center gap-2" onClick={handleSend}><Send className="w-4 h-4" /> Send</button>
        </div>
        <div className="text-xs text-gray-500 mt-1">{count} characters • Press Enter to send</div>
      </div>
    </div>
  );
}
