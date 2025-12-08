import { Paperclip, Pencil, Trash } from "lucide-react";

type Props = { message: { role: "user" | "assistant"; content: string; suggested?: string[] }; sender?: string; timestamp?: string; avatar?: string; onSuggestedClick?: (text: string) => void };

export default function MessageBubble({ message, sender, timestamp, avatar, onSuggestedClick }: Props) {
  const isUser = message.role === "user";
  function renderMessage(text: string) {
    const elements: JSX.Element[] = [];
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text))) {
      const before = text.slice(lastIndex, m.index);
      if (before.trim()) elements.push(<p className="mb-2 break-words whitespace-pre-wrap">{before}</p>);
      const code = m[2];
      elements.push(
        <pre className="mb-2 bg-gray-900 text-gray-100 rounded-lg p-3 overflow-x-auto">
          <code>{code}</code>
        </pre>
      );
      lastIndex = regex.lastIndex;
    }
    const tail = text.slice(lastIndex);
    if (tail.trim()) elements.push(<p className="break-words whitespace-pre-wrap">{tail}</p>);
    if (elements.length === 0) return <p className="break-words whitespace-pre-wrap">{text}</p>;
    return <>{elements}</>;
  }
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 grid place-items-center mr-2">{avatar || "AI"}</div>}
      <div className="max-w-xs md:max-w-md lg:max-w-lg">
        <div className={`${isUser ? "bg-primary text-white shadow-md" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-100"} px-4 py-3 rounded-2xl relative group break-words`}> 
          <div>{renderMessage(message.content)}</div>
          <div className={`mt-2 text-[11px] ${isUser ? "text-white/80" : "text-gray-600 dark:text-gray-300"}`}>{timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        {message.suggested && message.suggested.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.suggested.map((s, i) => (
              <button key={i} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs hover:bg-primary/15" onClick={() => onSuggestedClick && onSuggestedClick(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center ml-2">{sender?.[0] || "U"}</div>}
    </div>
  );
}
