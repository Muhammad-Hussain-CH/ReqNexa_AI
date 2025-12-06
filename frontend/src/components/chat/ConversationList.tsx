import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../../stores/chat.store";
import { useProjectStore } from "../../stores/project.store";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search } from "lucide-react";

export default function ConversationList() {
  const { conversations, activeConversation, loadConversations, selectConversation } = useChatStore();
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const [query, setQuery] = useState("");
  useEffect(() => { loadConversations(currentProjectId || null); }, [currentProjectId, loadConversations]);
  const filtered = useMemo(() => conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center px-3 py-2 border rounded bg-gray-50 w-full mr-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input className="ml-2 bg-transparent outline-none text-sm w-full" placeholder="Search conversations" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="px-3 py-2 rounded bg-primary text-white flex items-center gap-2"><Plus className="w-4 h-4" /> New</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {!filtered.length && (
          <div className="h-full grid place-items-center text-gray-500">No conversations</div>
        )}
        {filtered.map((c) => (
          <button key={c._id} onClick={() => selectConversation(c._id)} className={`w-full text-left px-3 py-2 rounded mb-2 border hover:bg-gray-50 transition ${activeConversation === c._id ? "bg-gray-100 border-primary" : "bg-white"}`}>
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.title}</div>
              <div className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(c.updated_at || Date.now()))} ago</div>
          </button>
        ))}
      </div>
    </div>
  );
}
