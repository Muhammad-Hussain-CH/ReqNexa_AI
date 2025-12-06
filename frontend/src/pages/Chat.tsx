import DashboardLayout from "../components/layout/DashboardLayout";
import ConversationList from "../components/chat/ConversationList";
import ChatInterface from "../components/chat/ChatInterface";
import { useProjectStore } from "../stores/project.store";

export default function Chat() {
  const { projects, currentProjectId, setCurrentProject } = useProjectStore();
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
        <div className="md:col-span-1 border rounded bg-white p-4">
          <div className="mb-3">
            <select className="w-full px-3 py-2 border rounded" value={currentProjectId || ""} onChange={(e) => setCurrentProject(e.target.value || null)}>
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <ConversationList />
        </div>
        <div className="md:col-span-2 border rounded bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Conversation</div>
              <div className="w-40 h-2 bg-gray-200 rounded">
                <div className="h-2 bg-primary rounded" style={{ width: "30%" }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded border hover:bg-gray-50">Save & Exit</button>
              <button className="px-3 py-1.5 rounded border hover:bg-gray-50">Export Conversation</button>
            </div>
          </div>
          <ChatInterface />
        </div>
      </div>
    </DashboardLayout>
  );
}
