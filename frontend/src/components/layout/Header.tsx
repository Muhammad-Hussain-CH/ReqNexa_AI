import { Menu, Bell, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "../../stores/theme.store";
import { useAuthStore } from "../../stores/auth.store";
import logoPng from "../../../logo/logo.png";

export default function Header({ onToggle }: { onToggle?: () => void }) {
  const [q, setQ] = useState("");
  const { mode, toggle } = useThemeStore();
  const { logout } = useAuthStore();
  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-white/80 dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-700 backdrop-blur flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onToggle}><Menu className="w-6 h-6" /></button>
        <picture>
          <source srcSet={logoPng} type="image/png" />
          <img src="/reqnexa-logo.svg" alt="ReqNexa AI" className="w-8 h-8" />
        </picture>
        <span className="font-semibold">ReqNexa AI</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center px-3 py-1.5 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <Search className="w-4 h-4 text-gray-500" />
          <input className="ml-2 bg-transparent outline-none text-sm dark:text-gray-100" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="p-2 rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggle} aria-label="Toggle theme">
          {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full px-1">3</span>
        </div>
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center">U</div>
          <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow text-sm">
            <a className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" href="/dashboard">Profile</a>
            <a className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" href="/admin">Settings</a>
            <button className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
