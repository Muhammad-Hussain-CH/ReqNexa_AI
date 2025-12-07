import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../../stores/chat.store";
import { useProjectStore } from "../../stores/project.store";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search } from "lucide-react";
import { startConversation as apiStart } from "../../services/chat.service";

export default function ConversationList() {
  const { conversations, activeConversation, loadConversations, selectConversation } = useChatStore();
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const projects = useProjectStore((s) => s.projects);
  const [query, setQuery] = useState("");
  useEffect(() => { loadConversations(currentProjectId || null); }, [currentProjectId, loadConversations]);
  const filtered = useMemo(() => conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())), [conversations, query]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function createNew() {
    if (creating) return;
    setError(null);
    setCreating(true);
    try {
      const proj = projects.find((p) => p.id === currentProjectId);
      const type = (proj?.type || "other") as string;
      const res = await apiStart(currentProjectId || null, type);
      await loadConversations(currentProjectId || null);
      if (res.conversation_id) selectConversation(res.conversation_id);
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Failed to start conversation");
    } finally {
      setCreating(false);
    }
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 w-full mr-2">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input className="ml-2 bg-transparent outline-none text-sm w-full dark:text-gray-100" placeholder="Search conversations" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="px-3 py-2 rounded bg-primary text-white flex items-center gap-2" onClick={createNew} disabled={creating}><Plus className="w-4 h-4" /> {creating ? "Starting..." : "New"}</button>
      </div>
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <div className="flex-1 overflow-y-auto">
        {!filtered.length && (
          <div className="h-full grid place-items-center text-gray-500 dark:text-gray-400">No conversations</div>
        )}
        {filtered.map((c) => (
          <button key={c._id} onClick={() => selectConversation(c._id)} className={`w-full text-left px-3 py-2 rounded mb-2 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${activeConversation === c._id ? "bg-gray-100 dark:bg-gray-700 border-primary" : "bg-white dark:bg-gray-800"}`}>
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.title}</div>
              <div className="w-2 h-2 rounded-full bg-accent" />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDistanceToNow(new Date(c.updated_at || Date.now()))} ago</div>
          </button>
        ))}
      </div>
    </div>
  );
}
