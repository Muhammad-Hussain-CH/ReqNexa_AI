import DashboardLayout from "../components/layout/DashboardLayout";
import ProjectCard from "../components/dashboard/ProjectCard";

export default function Projects() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProjectCard name="Sample App" status="active" type="web" />
        <ProjectCard name="Mobile Suite" status="completed" type="mobile" />
      </div>
    </DashboardLayout>
  );
}
