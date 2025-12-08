"use client"

import type React from "react"

import { useState } from "react"
import { Send, Paperclip, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MessageInputAreaProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
}

export function MessageInputArea({ onSendMessage, isLoading = false }: MessageInputAreaProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-3 rounded-2xl bg-card p-3 shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={() => console.log("Attachment clicked")}
            disabled={isLoading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Input
            placeholder={isLoading ? "Waiting for reply…" : "Type your message…"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            onClick={() => console.log("Microphone clicked")}
            disabled={isLoading}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className="h-10 w-10 flex-shrink-0 bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
