import { Menu, Bell, Search } from "lucide-react";
import { useState } from "react";

export default function Header({ onToggle }: { onToggle?: () => void }) {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-white/80 backdrop-blur flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onToggle}><Menu className="w-6 h-6" /></button>
        <span className="font-semibold">ReqNexa AI</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center px-3 py-1.5 border rounded bg-gray-50">
          <Search className="w-4 h-4 text-gray-500" />
          <input className="ml-2 bg-transparent outline-none text-sm" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] rounded-full px-1">3</span>
        </div>
        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-primary text-white grid place-items-center">U</div>
          <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow text-sm">
            <a className="block px-3 py-2 hover:bg-gray-50" href="#">Profile</a>
            <a className="block px-3 py-2 hover:bg-gray-50" href="#">Settings</a>
            <a className="block px-3 py-2 hover:bg-gray-50" href="#">Logout</a>
          </div>
        </div>
      </div>
    </header>
  );
}
