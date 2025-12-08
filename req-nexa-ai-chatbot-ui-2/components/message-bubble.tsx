"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  type: "text" | "code" | "system"
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "max-w-xs rounded-2xl px-4 py-3 md:max-w-md lg:max-w-lg",
          isUser ? "bg-blue-500 text-white shadow-md" : "bg-muted text-foreground shadow-sm",
        )}
      >
        {message.type === "code" ? (
          <div className="overflow-x-auto rounded-lg bg-slate-900 p-3">
            <pre className="font-mono text-xs text-slate-100">
              <code>{message.content}</code>
            </pre>
          </div>
        ) : message.type === "system" ? (
          <p className="text-center text-xs italic text-muted-foreground">{message.content}</p>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        )}
        <span className={cn("mt-1 block text-xs", isUser ? "text-blue-100" : "text-muted-foreground")}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </motion.div>
    </div>
  )
}
