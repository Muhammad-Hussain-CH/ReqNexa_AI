import DashboardLayout from "../components/layout/DashboardLayout";

export default function ProjectDetail() {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <div className="text-xl font-semibold">Project Detail</div>
        <div className="text-sm text-gray-600">Details and requirements</div>
      </div>
    </DashboardLayout>
  );
}
