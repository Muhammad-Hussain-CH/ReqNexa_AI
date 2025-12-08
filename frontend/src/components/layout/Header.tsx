import { Menu, Bell, Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../stores/theme.store";
import { useAuthStore } from "../../stores/auth.store";

export default function Header({ onToggle, title }: { onToggle?: () => void; title?: string }) {
  const { mode, toggle } = useThemeStore();
  const { user, logout } = useAuthStore();
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/80 dark:text-gray-100 backdrop-blur flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onToggle}><Menu className="w-6 h-6" /></button>
        <h1 className="font-semibold capitalize">{title || "dashboard"}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" onClick={toggle} aria-label="Toggle theme">
          {mode === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full px-1">3</span>
        </div>
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-semibold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="absolute right-0 mt-2 hidden group-hover:block bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg text-sm min-w-[220px]">
            <div className="px-3 pt-3 pb-2">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || "User"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</div>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-800" />
            <a className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800" href="/profile">Profile</a>
            <a className="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800" href="/settings">Settings</a>
            <button className="block w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={logout} aria-label="Logout">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}
