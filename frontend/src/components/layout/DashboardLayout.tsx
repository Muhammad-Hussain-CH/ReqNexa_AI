import React, { useMemo, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const title = useMemo(() => {
    if (pathname.startsWith("/projects/")) return "project";
    const map: Record<string, string> = {
      "/dashboard": "dashboard",
      "/projects": "projects",
      "/chat": "chat",
      "/admin": "analytics",
      "/settings": "settings",
      "/profile": "profile",
    };
    const found = Object.keys(map).find((p) => pathname.startsWith(p));
    return found ? map[found] : "dashboard";
  }, [pathname]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <Header onToggle={() => setOpen((o) => !o)} title={title} />
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 p-6 transition-all duration-300">{children}</main>
      </div>
    </div>
  );
}
