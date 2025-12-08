"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  type: "text" | "code" | "system"
  timestamp: Date
}

interface ChatAreaProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatArea({ messages, isLoading = false }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div>
            <h2 className="font-semibold text-card-foreground">ReqNexa AI Assistant</h2>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
              Online
            </p>
          </div>
        </div>

        {/* Messages */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </motion.div>

        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={scrollRef} />
      </div>
    </div>
  )
}
