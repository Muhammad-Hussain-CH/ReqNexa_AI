type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "text-right" : "text-left"}>
      <div className={isUser ? "inline-block bg-primary text-white px-3 py-2 rounded" : "inline-block bg-gray-100 px-3 py-2 rounded"}>
        {content}
      </div>
    </div>
  );
}
