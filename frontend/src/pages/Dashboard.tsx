import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import ProjectCard from "../components/dashboard/ProjectCard";
import { useAuthStore } from "../stores/auth.store";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const recent = [
    { id: "1", name: "Sample App", type: "web", status: "active", progress: 60, updatedAt: "2d ago" },
    { id: "2", name: "Mobile Suite", type: "mobile", status: "completed", progress: 100, updatedAt: "5d ago" },
    { id: "3", name: "API Gateway", type: "api", status: "active", progress: 35, updatedAt: "1d ago" },
  ];
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name || "User"}</h1>
          <p className="text-gray-600">Here’s a quick overview of your workspace.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Active Projects" value={3} color="primary" />
          <StatCard title="Completed Projects" value={1} color="secondary" />
          <StatCard title="Total Requirements" value={42} color="accent" />
          <StatCard title="Team Members" value={7} color="primary" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Projects</h2>
            <button className="text-primary hover:underline" onClick={() => navigate("/projects")}>View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            {recent.map((p) => (
              <ProjectCard key={p.id} id={p.id} name={p.name} type={p.type} status={p.status} progress={p.progress} updatedAt={p.updatedAt} />
            ))}
          </div>
        </div>
        <button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg grid place-items-center hover:brightness-110 transition"
          onClick={() => navigate("/projects")}
          aria-label="New Project"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </DashboardLayout>
  );
}
