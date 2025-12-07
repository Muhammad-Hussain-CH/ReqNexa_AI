import { Paperclip, Pencil, Trash } from "lucide-react";

type Props = { message: { role: "user" | "assistant"; content: string }; sender?: string; timestamp?: string; avatar?: string; suggested?: string[] };

export default function MessageBubble({ message, sender, timestamp, avatar, suggested }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 grid place-items-center mr-2">{avatar || "AI"}</div>}
      <div className="max-w-[70%]">
        <div className={`${isUser ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-100"} px-3 py-2 rounded relative group`}>{message.content}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition">{timestamp || "now"}</div>
        {suggested && suggested.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggested.map((s, i) => (
              <button key={i} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs hover:bg-gray-300 dark:hover:bg-gray-600">{s}</button>
            ))}
          </div>
        )}
      </div>
      {isUser && <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center ml-2">{sender?.[0] || "U"}</div>}
    </div>
  );
}
