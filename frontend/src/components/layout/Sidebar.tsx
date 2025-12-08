import { useLocation, Link } from "react-router-dom";
import { Home, Folder, BarChart3, Settings, LogOut, MessageSquare, User, FileText } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/projects", label: "Projects", icon: Folder },
    { to: "/chat", label: "Chat", icon: MessageSquare },
    { to: "/admin", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/reports", label: "Reports", icon: FileText },
    { to: "/profile", label: "Profile", icon: User },
  ];
  return (
    <aside className={`${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:w-64 w-64 shrink-0 h-[calc(100vh-56px)] p-4 text-sm fixed md:sticky md:top-14 left-0 transition-transform duration-300 bg-white dark:bg-gray-900 border-r dark:border-gray-700 flex flex-col`}> 
      <div className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">ReqNexa</div>
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${active ? "bg-gray-200 text-primary dark:bg-gray-700 dark:text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"}`} onClick={onClose}>
              <Icon className="w-4 h-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-3.5 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white grid place-items-center font-semibold shadow-sm ring-2 ring-white/50 dark:ring-gray-800">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.name || "User"}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@example.com"}</div>
        </div>
        <button className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-gray-800" onClick={logout} aria-label="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
