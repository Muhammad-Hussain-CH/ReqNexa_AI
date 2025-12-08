"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { ChatArea } from "./chat-area"
import { MessageInputArea } from "./message-input-area"
import { ThemeToggle } from "./theme-toggle"
import { ProjectsPage } from "./projects-page"
import { ProfilePage } from "./profile-page"
import { SettingsPage } from "./settings-page"
import { ReportsPage } from "./reports-page"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  type: "text" | "code" | "system"
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState<"chat" | "projects" | "reports" | "history" | "settings" | "profile">(
    "chat",
  )
  const router = useRouter()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api"

  useEffect(() => {
    if (currentPage !== "chat") return
    if (conversationId) return
    const token = typeof window !== "undefined" ? localStorage.getItem("reqnexa_token") : null
    if (!token) {
      setMessages([
        {
          id: "sys-login",
          role: "bot",
          content:
            "You are not logged in. Go to Profile → Login to authenticate, then return here.",
          type: "system",
          timestamp: new Date(),
        },
      ])
      return
    }
    const start = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`${API_BASE}/chat/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ project_type: "web" }),
        })
        if (!res.ok) throw new Error(`Start failed: ${res.status}`)
        const data = await res.json()
        setConversationId(data.conversation_id)
        setMessages([
          {
            id: data.message_id || Date.now().toString(),
            role: "bot",
            content: data.first_message || "Hello!",
            type: "text",
            timestamp: new Date(),
          },
        ])
      } catch (err: any) {
        setMessages([
          {
            id: "sys-error",
            role: "bot",
            content: `Error starting chat. ${err?.message || "Please try again."}`,
            type: "system",
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, conversationId])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      type: "text",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    const token = typeof window !== "undefined" ? localStorage.getItem("reqnexa_token") : null
    if (!token || !conversationId) {
      setMessages((prev) => [
        ...prev,
        {
          id: "sys-noauth",
          role: "bot",
          content: !token
            ? "Login required. Go to Profile → Login and try again."
            : "No active conversation. Reload the chat page.",
          type: "system",
          timestamp: new Date(),
        },
      ])
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation_id: conversationId, message: content }),
      })
      if (!res.ok) throw new Error(`Send failed: ${res.status}`)
      const data = await res.json()
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.bot_response || "",
        type: "text",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "sys-send-error",
          role: "bot",
          content: `Error sending message. ${err?.message || "Please try again."}`,
          type: "system",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("reqnexa_token")
        localStorage.removeItem("reqnexa_refresh")
      }
    } catch {}
    router.push("/")
  }

  return (
    <div className="flex h-full">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-6">
          <h1 className="font-semibold text-foreground capitalize">{currentPage}</h1>
          <ThemeToggle />
        </div>

        {currentPage === "chat" && (
          <>
            <ChatArea messages={messages} isLoading={isLoading} />
            <MessageInputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        )}

        {currentPage === "projects" && <ProjectsPage />}

        {currentPage === "reports" && <ReportsPage />}

        {currentPage === "history" && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">History page coming soon</p>
          </div>
        )}

        {currentPage === "settings" && <SettingsPage />}

        {currentPage === "profile" && <ProfilePage onLogout={handleLogout} />}
      </div>
    </div>
  )
}
