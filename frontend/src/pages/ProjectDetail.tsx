import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getProjectById } from "../services/project.service";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis } from "recharts";
import RequirementsTable from "../components/project/RequirementsTable";
import RequirementDetailModal from "../components/project/RequirementDetailModal";
import GenerateDocumentModal from "../components/project/GenerateDocumentModal";
import BulkUpdateRequirementsModal from "../components/project/BulkUpdateRequirementsModal";
import { useProjectStore } from "../stores/project.store";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [tab, setTab] = useState("overview");
  const { requirements, isLoading, loadRequirements, updateRequirement, deleteRequirement, bulkUpdateRequirements } = useProjectStore();
  const [openReq, setOpenReq] = useState<any | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [docOpen, setDocOpen] = useState(false);
  useEffect(() => {
    (async () => { if (id) { const res = await getProjectById(id); setProject(res.project ?? res); } })();
  }, [id]);
  useEffect(() => { if (id && tab === "requirements") loadRequirements(id, {}, { page: 1, limit: 25 }); }, [id, tab, loadRequirements]);
  const pieData = useMemo(() => [{ name: "Functional", value: 12 }, { name: "Non-functional", value: 6 }], []);
  const COLORS = ["#1976D2", "#F57C00"];
  const priorities = useMemo(() => [{ name: "High", value: 5 }, { name: "Medium", value: 9 }, { name: "Low", value: 4 }], []);
  const statuses = useMemo(() => [{ name: "Draft", value: 8 }, { name: "Review", value: 6 }, { name: "Approved", value: 4 }], []);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/projects" className="text-primary">Projects</Link>
            <span>/</span>
            <span>{project?.name || "Project"}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded border hover:bg-gray-50" onClick={() => setDocOpen(true)}>Generate Document</button>
            <Link to={`/projects/${id}/documents`} className="px-3 py-1.5 rounded border hover:bg-gray-50">Documents</Link>
            <button className="px-3 py-1.5 rounded border hover:bg-gray-50">Share</button>
          </div>
        </div>
        <div className="flex items-center gap-2 border-b">
          {[
            { k: "overview", t: "Overview" },
            { k: "requirements", t: "Requirements" },
            { k: "chat", t: "Chat History" },
            { k: "team", t: "Team" },
            { k: "settings", t: "Settings" },
          ].map((x) => (
            <button key={x.k} onClick={() => setTab(x.k)} className={`px-3 py-2 ${tab === x.k ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}>{x.t}</button>
          ))}
        </div>
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 rounded border bg-white p-4">
              <div className="font-semibold">Project Info</div>
              <div className="text-sm text-gray-600 mt-2">Name: {project?.name}</div>
              <div className="text-sm text-gray-600">Type: {project?.type}</div>
              <div className="text-sm text-gray-600">Description: {project?.description || ""}</div>
              <div className="text-sm text-gray-600">Created: {new Date().toLocaleDateString()}</div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded border bg-white p-4">
                <div className="font-semibold mb-2">Functional vs Non-functional</div>
                <div className="h-48">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded border bg-white p-4">
                <div className="font-semibold mb-2">By Priority</div>
                <div className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={priorities}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="#1976D2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded border bg-white p-4 md:col-span-2">
                <div className="font-semibold mb-2">By Status</div>
                <div className="h-48">
                  <ResponsiveContainer>
                    <BarChart data={statuses}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill="#F57C00" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab === "requirements" && (
          <div>
            <RequirementsTable
              items={requirements}
              isLoading={isLoading}
              onRowClick={(req) => setOpenReq(req)}
              onEdit={(req) => updateRequirement(req.id, { status: req.status })}
              onDelete={(req) => deleteRequirement(req.id)}
              onBulkUpdate={(ids) => { setBulkIds(ids); setBulkOpen(true); }}
            />
            <RequirementDetailModal open={!!openReq} requirement={openReq} onClose={() => setOpenReq(null)} />
            <BulkUpdateRequirementsModal
              open={bulkOpen}
              onClose={() => setBulkOpen(false)}
              onConfirm={async (updates) => {
                await bulkUpdateRequirements(bulkIds, updates);
                setBulkOpen(false);
                setBulkIds([]);
              }}
            />
            <GenerateDocumentModal projectId={id as string} open={docOpen} onClose={() => setDocOpen(false)} />
          </div>
        )}
        {tab === "chat" && (
          <div className="space-y-2">
            <div className="rounded border bg-white p-4">
              <div className="font-semibold mb-2">Conversations</div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50" onClick={() => navigate(`/chat/${id}`)}>Conversation {i + 1}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === "team" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Team Members</div>
              <button className="px-3 py-1.5 rounded border">Add Member</button>
            </div>
            <div className="rounded border bg-white">
              <table className="w-full text-sm">
                <tbody>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">Member {i + 1}</td>
                      <td className="p-2 text-right"><button className="px-3 py-1 rounded border">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === "settings" && (
          <div className="space-y-3">
            <div className="rounded border bg-white p-4">
              <div className="font-semibold">Edit Project</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <input className="px-3 py-2 border rounded" defaultValue={project?.name} />
                <select className="px-3 py-2 border rounded" defaultValue={project?.type}><option value="web">Web</option><option value="mobile">Mobile</option><option value="desktop">Desktop</option><option value="api">API</option><option value="other">Other</option></select>
                <textarea className="px-3 py-2 border rounded md:col-span-2" rows={4} defaultValue={project?.description || ""} />
              </div>
              <div className="mt-3 flex items-center gap-2"><button className="px-3 py-1.5 rounded bg-primary text-white">Save</button></div>
            </div>
            <div className="rounded border bg-white p-4">
              <div className="font-semibold">Danger Zone</div>
              <div className="mt-2 flex items-center gap-2">
                <button className="px-3 py-1.5 rounded border">Archive Project</button>
                <button className="px-3 py-1.5 rounded border text-red-600">Delete Project</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
