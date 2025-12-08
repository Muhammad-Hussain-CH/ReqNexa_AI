import DashboardLayout from "../components/layout/DashboardLayout";
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

type Report = { id: string; projectName: string; type: "pdf" | "srs"; generatedDate: string; size: string };

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([
    { id: "r1", projectName: "Sample App", type: "pdf", generatedDate: "2024-11-03", size: "1.2 MB" },
    { id: "r2", projectName: "Mobile Suite", type: "srs", generatedDate: "2024-11-01", size: "380 KB" },
  ]);
  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-background via-background to-blue-950/10 p-2 md:p-4 rounded-lg">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-gray-600 dark:text-gray-300">Generated documents and analytics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="rounded-lg border border-border/50 bg-gradient-to-br from-blue-950/20 via-background to-blue-900/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 grid place-items-center rounded-full bg-blue-500 text-white">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{r.projectName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.type.toUpperCase()} • {r.generatedDate} • {r.size}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><Eye className="h-4 w-4" /></button>
                  <button className="px-2 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"><Download className="h-4 w-4" /></button>
                  <button className="px-2 py-1.5 rounded border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={() => setReports((prev) => prev.filter((x) => x.id !== r.id))}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
