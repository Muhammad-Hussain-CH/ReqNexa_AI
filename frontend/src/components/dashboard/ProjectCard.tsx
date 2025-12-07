import Card from "../common/Card";
import { useNavigate } from "react-router-dom";

type Props = { id?: string; name: string; status: string; type: string; progress?: number; updatedAt?: string };

export default function ProjectCard({ id, name, status, type, progress = 0, updatedAt }: Props) {
  const navigate = useNavigate();
  return (
    <button onClick={() => id && navigate(`/projects/${id}`)} className="text-left w-full">
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{name}</div>
          <span className={`text-xs px-2 py-1 rounded ${status === "active" ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>{type}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{updatedAt ? `Updated ${updatedAt}` : status}</div>
        <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded">
          <div className="h-2 bg-primary rounded" style={{ width: `${progress}%` }} />
        </div>
      </Card>
    </button>
  );
}
