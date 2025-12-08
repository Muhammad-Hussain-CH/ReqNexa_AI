import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChatStore } from "../../stores/chat.store";
import { Paperclip, Send, Mic } from "lucide-react";
import { useProjectStore } from "../../stores/project.store";

export default function ChatInterface() {
  const { messages, isTyping, sendMessage } = useChatStore();
  const { currentProjectId, projects } = useProjectStore();
  const [text, setText] = useState("");
  const [count, setCount] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }
  async function handleSend() {
    if (!text.trim()) return;
    const proj = projects.find((p) => p.id === currentProjectId);
    await sendMessage(text, currentProjectId || null, proj?.type);
    setText("");
    setCount(0);
  }
  function handleExport() {
    const data = { exported_at: new Date().toISOString(), messages };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleSuggestedClick(s: string) {
    setText(s);
    // Optionally send immediately
    // const proj = projects.find((p) => p.id === currentProjectId);
    // sendMessage(s, currentProjectId || null, proj?.type);
  }
  const proj = projects.find((p) => p.id === currentProjectId);
  const projectTypeLabel = proj?.type ? proj.type[0].toUpperCase() + proj.type.slice(1) : "All";
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">{projectTypeLabel}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">Conversation</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={handleExport}>Export</button>
        </div>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain space-y-5 p-6 max-w-4xl mx-auto w-full">
        <div className="mb-2 flex items-center gap-3 p-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <span className="text-sm font-bold">AI</span>
          </div>
          <div>
            <div className="font-semibold">ReqNexa AI Assistant</div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              Online
            </div>
          </div>
        </div>
        {!messages.length && <div className="h-full grid place-items-center text-gray-500 dark:text-gray-400">Start a conversation</div>}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} onSuggestedClick={handleSuggestedClick} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="mt-4 max-w-4xl mx-auto w-full sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t dark:border-gray-700 pt-3 pb-4 z-10">
        <div className="flex items-end gap-3 rounded-2xl border dark:border-gray-700 bg-white/80 dark:bg-gray-900 p-3">
          <button className="h-10 w-10 grid place-items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" disabled={isTyping}>
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            className="flex-1 px-3 py-2 rounded resize-none bg-transparent dark:text-gray-100 max-h-48 overflow-auto break-words outline-none"
            rows={Math.min(6, Math.max(1, Math.ceil(text.length / 60)))}
            value={text}
            onChange={(e) => { setText(e.target.value); setCount(e.target.value.length); }}
            onKeyDown={onKeyDown}
            placeholder={isTyping ? "Waiting for reply…" : "Type your message…"}
            disabled={isTyping}
          />
          <button className="h-10 w-10 grid place-items-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" disabled={isTyping}>
            <Mic className="w-5 h-5" />
          </button>
          <button className={`h-10 w-10 grid place-items-center rounded-md bg-primary text-white ${!text.trim() || isTyping ? "opacity-50 cursor-not-allowed" : "hover:brightness-110"}`} onClick={handleSend} disabled={!text.trim() || isTyping}>
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{count} characters • Press Enter to send</div>
      </div>
    </div>
  );
}
