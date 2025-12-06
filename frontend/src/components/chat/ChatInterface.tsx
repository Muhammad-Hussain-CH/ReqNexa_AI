import { useState } from "react";
import MessageBubble from "./MessageBubble";
import Button from "../common/Button";
import { useChatStore } from "../../stores/chat.store";
import { sendMessage } from "../../services/chat.service";

export default function ChatInterface() {
  const { messages, conversationId, addMessage } = useChatStore();
  const [text, setText] = useState("");
  async function onSend() {
    if (!conversationId || !text) return;
    addMessage({ role: "user", content: text });
    const res = await sendMessage({ conversation_id: conversationId, message: text });
    addMessage({ role: "assistant", content: res.bot_response });
    setText("");
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 px-3 py-2 border rounded" value={text} onChange={(e) => setText(e.target.value)} />
        <Button onClick={onSend}>Send</Button>
      </div>
    </div>
  );
}
