import { useLocation, Link } from "react-router-dom";
import { Home, Folder, BarChart3, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/auth.store";

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuthStore();
  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/projects", label: "Projects", icon: Folder },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];
  return (
    <aside className={`${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:w-64 w-64 shrink-0 border-r h-[calc(100vh-56px)] p-4 text-sm bg-white fixed md:static top-14 left-0 transition-transform duration-300`}> 
      <div className="font-bold text-lg mb-4">ReqNexa</div>
      <nav className="space-y-1">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition ${active ? "bg-gray-100 text-primary" : "text-gray-700"}`} onClick={onClose}>
              <Icon className="w-4 h-4" /> {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 border rounded">
        <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center">{user?.name?.[0] || "U"}</div>
        <div className="flex-1">
          <div className="text-sm font-medium">{user?.name || "User"}</div>
          <div className="text-xs text-gray-500">{user?.email || "user@example.com"}</div>
        </div>
        <button className="text-red-600 hover:text-red-700" onClick={logout}><LogOut className="w-4 h-4" /></button>
      </div>
    </aside>
  );
}
