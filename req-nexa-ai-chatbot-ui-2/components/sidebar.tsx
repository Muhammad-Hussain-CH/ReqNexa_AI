"use client"
import { Menu, X, MessageSquare, Folder, Clock, Settings, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  onNavigate?: (page: "chat" | "projects" | "reports" | "history" | "settings" | "profile") => void
  currentPage?: "chat" | "projects" | "reports" | "history" | "settings" | "profile"
}

export function Sidebar({ open, onToggle, onNavigate, currentPage = "chat" }: SidebarProps) {
  const navItems = [
    { icon: MessageSquare, label: "Chat", id: "chat" as const },
    { icon: Folder, label: "Projects", id: "projects" as const },
    { icon: FileText, label: "Reports", id: "reports" as const },
    { icon: Clock, label: "History", id: "history" as const },
    { icon: Settings, label: "Settings", id: "settings" as const },
    { icon: User, label: "Profile", id: "profile" as const },
  ]

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 md:relative md:translate-x-0",
          open ? "w-64 translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 dark:bg-blue-600">
              <span className="text-sm font-bold text-white">R</span>
            </div>
            <h1 className="text-lg font-bold">ReqNexa AI</h1>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate?.(item.id)
                onToggle()
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                currentPage === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <User className="h-5 w-5" />
            <span>User Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {!open && (
        <Button variant="ghost" size="icon" className="absolute left-4 top-4 md:hidden" onClick={onToggle}>
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/50 dark:bg-black/70 md:hidden" onClick={onToggle} />}
    </>
  )
}
