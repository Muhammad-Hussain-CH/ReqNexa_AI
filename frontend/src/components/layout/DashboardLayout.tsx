import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      <Header onToggle={() => setOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 p-6 transition-all duration-300">{children}</main>
      </div>
    </div>
  );
}
