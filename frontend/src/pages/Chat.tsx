import DashboardLayout from "../components/layout/DashboardLayout";
import ConversationList from "../components/chat/ConversationList";
import ChatInterface from "../components/chat/ChatInterface";
import { useProjectStore } from "../stores/project.store";
import { useChatStore } from "../stores/chat.store";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Download } from "lucide-react";
import { useEffect } from "react";

export default function Chat() {
  const { projects, currentProjectId, setCurrentProject } = useProjectStore();
  const { messages, activeConversation, resume } = useChatStore();
  const navigate = useNavigate();
  const loadProjects = useProjectStore((s) => s.loadProjects);
  function saveAndExit() {
    navigate("/dashboard");
  }
  function exportConversation() {
    const data = { exported_at: new Date().toISOString(), messages };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  useEffect(() => { if (!projects.length) loadProjects({}, { page: 1, limit: 50 }); }, [projects.length, loadProjects]);
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-56px)] max-w-6xl mx-auto overflow-hidden">
        <div className="md:col-span-1 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 p-6 overflow-hidden">
          <div className="mb-3">
            <select className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700" value={currentProjectId || ""} onChange={(e) => setCurrentProject(e.target.value || null)}>
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <ConversationList />
        </div>
        <div className="md:col-span-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="font-semibold">Conversation</div>
              <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary ring-1 ring-primary/20">{activeConversation ? activeConversation.slice(0,8) : "No conversation"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-md border dark:border-gray-700 hover:bg-white/50 dark:hover:bg-gray-700 flex items-center gap-2" onClick={resume} disabled={!activeConversation}><RefreshCcw className="w-4 h-4" /> Resume</button>
              <button className="px-3 py-1.5 rounded-md border dark:border-gray-700 hover:bg-white/50 dark:hover:bg-gray-700 flex items-center gap-2" onClick={exportConversation}><Download className="w-4 h-4" /> Export</button>
              <button className="px-3 py-1.5 rounded-md border dark:border-gray-700 hover:bg-white/50 dark:hover:bg-gray-700" onClick={saveAndExit}>Exit</button>
            </div>
          </div>
          <div className="h-full flex flex-col">
            <ChatInterface />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
